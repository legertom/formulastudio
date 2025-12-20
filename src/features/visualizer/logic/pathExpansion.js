
// Logic for expanding AST nodes into logic paths and scenarios

export function flattenConcat(node) {
    if (node?.type === 'CallExpression' && node.name === 'concat') {
        return node.arguments.flatMap(flattenConcat);
    }
    return [node];
}

export function flattenOp(node, op) {
    if (node?.type === 'CallExpression' && node.name === op) {
        return node.arguments.flatMap(arg => flattenOp(arg, op));
    }
    return [node];
}

/**
 * Expands a node into all possible execution paths (Scenarios).
 * Returns: Array of { valueParts: Node[], conditions: Node[] }
 */
export function expandLogicPaths(node) {
    if (!node) return [{ valueParts: [], conditions: [] }];

    // 1. Strings/Literals -> Single path, no conditions
    if (node.type === 'StringLiteral' || node.type === 'Identifier' || node.type === 'NumberLiteral') {
        return [{ valueParts: [node], conditions: [] }];
    }

    // 2. Concat -> Cartesian Product of all arguments' paths
    if (node.type === 'CallExpression' && node.name === 'concat') {
        // flattenConcat handles nested concats, so we just iterate args
        const args = flattenConcat(node);
        let paths = [{ valueParts: [], conditions: [] }];

        for (const arg of args) {
            const argPaths = expandLogicPaths(arg);
            const newPaths = [];

            // Cross-multiply current paths with new arg paths
            for (const existing of paths) {
                for (const next of argPaths) {
                    newPaths.push({
                        valueParts: [...existing.valueParts, ...next.valueParts],
                        conditions: [...existing.conditions, ...next.conditions]
                    });
                }
            }
            paths = newPaths;
        }
        return paths;
    }

    // 3. If/Else -> Union of branches
    if (node.type === 'CallExpression' && node.name === 'if') {
        const paths = [];
        const [condition, trueVal, falseVal] = node.arguments;

        // Path A: Condition is True
        const truePaths = expandLogicPaths(trueVal);
        truePaths.forEach(p => {
            p.conditions.unshift(condition); // Add this condition
            paths.push(p);
        });

        // Path B: Condition is False (Else)
        if (falseVal) {
            const falsePaths = expandLogicPaths(falseVal);
            falsePaths.forEach(p => {
                if (falseVal.type !== 'CallExpression' || falseVal.name !== 'if') {
                    // It is a specific "Else" leaf
                    p.conditions.unshift({ type: 'Default', value: 'Start' });
                }
                paths.push(p);
            });
        }

        return paths;
    }

    // Fallback: Treat as atomic value
    return [{ valueParts: [node], conditions: [] }];
}

/**
 * Checks if a subtree contains branching logic (if).
 */
export function hasNestedLogic(node) {
    if (!node) return false;
    if (node.type === 'CallExpression' && node.name === 'if') return true;
    if (node.arguments) return node.arguments.some(hasNestedLogic);
    return false;
}

/**
 * Helper to get the field name if the node is a simple `equals field "value"` check.
 */
function getSubjectField(node) {
    if (node?.type === 'CallExpression' && node.name === 'equals') {
        if (node.arguments[0]?.type === 'Identifier') {
            return node.arguments[0].value;
        }
    }
    return null;
}

/**
 * Breaks the IF-chain into logical segments.
 * Returns an array of segments: { type: 'table'|'tree', rows?: [], node?: ... }
 */
export function segmentLogicChain(node) {
    if (node?.type !== 'CallExpression' || node.name !== 'if') {
        return [{ type: 'tree', node }];
    }

    const segments = [];
    let currentBuffer = []; // Accumulate rows for potential table
    let currentSubject = null;

    let current = node;

    function flushBuffer() {
        if (currentBuffer.length === 0) return;

        // Use heuristic: is it worth making a table?
        // If we have > 1 row with same subject, yes.
        if (currentSubject && currentBuffer.length > 1) {
            segments.push({ type: 'table', rows: [...currentBuffer], commonField: currentSubject });
        } else {
            segments.push({ type: 'table', rows: [...currentBuffer], commonField: currentSubject }); // Fallback to table even if mixed? Or maybe should be cards? 
            // The original code used 'table' type even for fallback to reuse the loop.
            // Let's keep original logic.
        }
        currentBuffer = [];
        currentSubject = null;
    }

    while (current?.type === 'CallExpression' && current.name === 'if') {
        const [condition, trueVal, falseVal] = current.arguments;

        // Analyze condition for subject
        const subject = getSubjectField(condition);

        if (subject && subject === currentSubject) {
            currentBuffer.push({ condition, value: trueVal });
        } else if (subject) {
            // New subject found
            flushBuffer();
            currentSubject = subject;
            currentBuffer.push({ condition, value: trueVal });
        } else {
            // Complex condition (no single subject)
            if (currentSubject !== null) flushBuffer();
            currentSubject = null;
            currentBuffer.push({ condition, value: trueVal });
        }

        // Advance
        if (falseVal?.type === 'CallExpression' && falseVal.name === 'if') {
            current = falseVal;
        } else {
            // End of chain
            currentBuffer.push({ condition: { type: 'Default', value: 'Catch All' }, value: falseVal });
            flushBuffer();
            current = null;
        }
    }

    return segments;
}
