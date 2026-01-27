/**
 * Data Flow Analysis
 *
 * Analyzes AST and trace data to extract:
 * - Which input fields were accessed
 * - The transformation pipeline
 * - The final output
 */

/**
 * Extract all field accesses (Identifiers) from the AST
 * Returns array of { path, value, exists, accessed }
 */
export function extractFieldAccesses(ast, testData, traceMap) {
    const fieldAccesses = [];
    const seenPaths = new Set();
    const pathNodes = new Map(); // Track first node for each path

    const traverse = (node) => {
        if (!node) return;

        if (node.type === 'Identifier') {
            const path = node.value;

            // Skip boolean keywords
            if (['true', 'false', 'null'].includes(path)) return;

            // Skip if we've already recorded this path
            if (seenPaths.has(path)) return;
            seenPaths.add(path);
            pathNodes.set(path, node);

            // Check if this field was actually accessed (in trace map)
            // We need to check if ANY node with this path was accessed
            const accessed = traceMap ? traceMap.has(node) : false;

            // Try to get the value from trace map or evaluate it
            let value = null;
            let exists = false;
            let error = null;

            if (traceMap && traceMap.has(node)) {
                const traceData = traceMap.get(node);
                value = traceData.value;
                exists = true;
            } else {
                // Try to resolve the path in testData
                try {
                    value = resolvePath(testData, path);
                    exists = true;
                } catch (e) {
                    error = e.message;
                    exists = false;
                }
            }

            fieldAccesses.push({
                path,
                value,
                exists,
                accessed,
                error
            });
        }

        // Recurse
        if (node.type === 'CallExpression' && node.arguments) {
            node.arguments.forEach(traverse);
        }
        if (Array.isArray(node)) {
            node.forEach(traverse);
        }
    };

    traverse(ast);
    return fieldAccesses;
}

/**
 * Resolve a dot-notation path in data object
 * Supports array indexing like "schools[0].name"
 */
function resolvePath(data, path) {
    const segments = [];
    const pathParts = path.split('.');

    for (const part of pathParts) {
        // Check if part contains array indexing like "schools[0]"
        const bracketMatch = part.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(\[(\d+)\])?$/);
        if (bracketMatch) {
            segments.push(bracketMatch[1]); // property name
            if (bracketMatch[3] !== undefined) {
                segments.push(parseInt(bracketMatch[3], 10)); // array index
            }
        } else {
            segments.push(part);
        }
    }

    let current = data;
    for (let i = 0; i < segments.length; i++) {
        const key = segments[i];
        if (current === null || current === undefined) {
            throw new Error(`Cannot access property '${key}' of ${current}`);
        }
        if (typeof key === 'number') {
            // Array index access
            if (!Array.isArray(current)) {
                throw new Error(`Cannot use index [${key}] on non-array`);
            }
            if (key >= current.length) {
                throw new Error(`Array index [${key}] out of bounds`);
            }
            current = current[key];
        } else {
            // Property access
            if (!(key in current)) {
                throw new Error(`Field '${key}' does not exist`);
            }
            current = current[key];
        }
    }

    return current;
}

/**
 * Build a linear transformation pipeline from the AST
 * Shows the step-by-step operations in execution order
 */
export function buildTransformationPipeline(ast, traceMap) {
    const steps = [];

    // Recursively collect all executed function calls in post-order (bottom-up)
    // This shows the execution flow: inner functions execute first, then outer
    const traverse = (node) => {
        if (!node) return;

        // Get trace data if available
        const traceData = traceMap && traceMap.has(node) ? traceMap.get(node) : null;
        const executed = traceData ? traceData.executed : false;
        const value = traceData ? traceData.value : null;

        if (node.type === 'CallExpression') {
            const funcName = node.name;

            // First, recursively process arguments (bottom-up execution order)
            node.arguments.forEach(arg => traverse(arg));

            // Then add this function call
            if (executed) {
                let inputValues = [];

                // Collect input values from arguments
                if (traceMap) {
                    node.arguments.forEach(arg => {
                        if (traceMap.has(arg)) {
                            inputValues.push(traceMap.get(arg).value);
                        }
                    });
                }

                steps.push({
                    type: 'function',
                    name: funcName,
                    description: funcName,
                    inputs: inputValues,
                    output: value,
                    executed: true,
                    node
                });
            }
        } else if (node.type === 'Identifier') {
            // Field access - only show if executed
            if (executed && value !== undefined) {
                // Check if we haven't already added this field
                const alreadyAdded = steps.some(s =>
                    s.type === 'field' && s.name === node.value
                );

                if (!alreadyAdded) {
                    steps.push({
                        type: 'field',
                        name: node.value,
                        description: `Read ${node.value}`,
                        output: value,
                        executed: true,
                        node
                    });
                }
            }
        } else if (Array.isArray(node)) {
            // Handle arrays
            node.forEach(item => traverse(item));
        }
    };

    traverse(ast);
    return steps;
}

/**
 * Classify the formula archetype based on its structure
 */
export function classifyFormula(ast) {
    if (!ast) return { type: 'unknown', label: 'Unknown' };

    // Helper to check if node contains certain functions
    const containsFunction = (node, funcNames) => {
        if (!node) return false;
        if (node.type === 'CallExpression' && funcNames.includes(node.name.toLowerCase())) {
            return true;
        }
        if (node.type === 'CallExpression' && node.arguments) {
            return node.arguments.some(arg => containsFunction(arg, funcNames));
        }
        return false;
    };

    // Count different types of operations
    const hasConditional = containsFunction(ast, ['if', 'switch']);
    const hasStringOps = containsFunction(ast, ['concat', 'upper', 'lower', 'replace', 'substr', 'trim', 'trimleft', 'initials', 'tolower', 'toupper']);
    const hasLogicOps = containsFunction(ast, ['and', 'or', 'not', 'equals', 'greater', 'less', 'geq', 'leq', 'contains', 'in']);

    // Check if root is conditional
    const rootIsConditional = ast.type === 'CallExpression' && ['if', 'switch'].includes(ast.name.toLowerCase());

    // Classify
    if (rootIsConditional && hasLogicOps) {
        return {
            type: 'classifier',
            label: 'Decision Logic',
            description: 'Evaluates conditions and returns different values based on the result',
            icon: ''
        };
    }

    if (rootIsConditional && !hasLogicOps) {
        return {
            type: 'validator',
            label: 'Validator',
            description: 'Checks conditions and validates data',
            icon: ''
        };
    }

    if (hasStringOps && !hasConditional) {
        return {
            type: 'transformer',
            label: 'String Transformer',
            description: 'Transforms and formats string data',
            icon: ''
        };
    }

    if (hasLogicOps && hasConditional) {
        return {
            type: 'boolean_checker',
            label: 'Boolean Logic',
            description: 'Complex logical evaluation with multiple conditions',
            icon: ''
        };
    }

    return {
        type: 'generic',
        label: 'Generic Formula',
        description: 'Evaluates an expression',
        icon: ''
    };
}

/**
 * Format a value for display (truncate long strings, handle special types)
 */
export function formatValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value === true) return 'true';
    if (value === false) return 'false';
    if (typeof value === 'string') {
        if (value.length > 50) {
            return `"${value.substring(0, 47)}..."`;
        }
        return `"${value}"`;
    }
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}
