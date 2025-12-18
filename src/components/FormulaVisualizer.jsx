import React from 'react';

const NodeView = ({ node }) => {
    if (!node) return null;

    if (node.type === 'StringLiteral') {
        return <span className="node-string">"{node.value}"</span>;
    }

    if (node.type === 'Identifier') {
        return <span className="node-ident">{node.value}</span>;
    }

    if (node.type === 'CallExpression') {
        return (
            <div className={`node-call node-${node.name}`}>
                <div className="node-header">{node.name}</div>
                <div className="node-args">
                    {node.arguments.map((arg, i) => (
                        <div key={i} className="node-arg-wrapper">
                            <NodeView node={arg} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <div className="node-unknown">Unknown Node</div>;
};

// --- Smart View Logic ---

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
function segmentLogicChain(node) {
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
            // Fallback to tree for each item if not enough for a table
            // Actually, if it's just 1 item but valid if/else, we might want to just show it as a small table 
            // OR just standard tree nodes. Let's keep it simple: small tables are fine.
            segments.push({ type: 'table', rows: [...currentBuffer], commonField: currentSubject });
        }
        currentBuffer = [];
        currentSubject = null;
    }

    while (current?.type === 'CallExpression' && current.name === 'if') {
        const [condition, trueVal, falseVal] = current.arguments;

        // Analyze condition for subject
        const subject = getSubjectField(condition);

        // Logic: If subject matches current buffer, add to buffer.
        // If subject differs, flush buffer and start new.
        // Use 'null' subject for complex logic (which forces a flush if we were tracking a subject)

        if (subject && subject === currentSubject) {
            currentBuffer.push({ condition, value: trueVal });
        } else if (subject) {
            // New subject found
            flushBuffer();
            currentSubject = subject;
            currentBuffer.push({ condition, value: trueVal });
        } else {
            // Complex condition (no single subject)
            flushBuffer(); // Flush previous simple stuff

            // For complex items, we can either:
            // A) Make a "Generic Table Row" (Condition | Result)
            // B) Output a Tree Node
            // Let's use a "Generic Table" approach for the chain, but with no common field.
            // Actually, typically if it's complex, it might be better as a tree.
            // BUT, to keep the "Flow" vertical, a table with explicit conditions is often better.
            // So let's start a generic buffer (subject = null).

            if (currentSubject !== null) flushBuffer();
            currentSubject = null;
            currentBuffer.push({ condition, value: trueVal });
        }

        // Advance
        if (falseVal?.type === 'CallExpression' && falseVal.name === 'if') {
            current = falseVal;
        } else {
            // End of chain
            // Add the final 'else' to the current buffer
            currentBuffer.push({ condition: { type: 'Default', value: 'Catch All' }, value: falseVal });
            flushBuffer();
            current = null;
        }
    }

    return segments;
}

const CleanValue = ({ node }) => {
    if (node?.type === 'StringLiteral') {
        return <span className="clean-string">{node.value}</span>;
    }
    return <NodeView node={node} />;
};

// --- Logic Flattener ---

function flattenOp(node, op) {
    if (node?.type === 'CallExpression' && node.name === op) {
        return node.arguments.flatMap(arg => flattenOp(arg, op));
    }
    return [node];
}

const ConditionView = ({ node }) => {
    // 0. Synthetic Default (Else) -> "Catch All"
    if (node?.type === 'Default') {
        return (
            <div className="tooltip-container">
                <span className="node-keyword node-catch-all">
                    Catch All
                    <span className="info-icon">?</span>
                </span>
                <span className="tooltip-text">
                    This is the OU that users go into if they don't fit anywhere else.
                </span>
            </div>
        );
    }

    // 1. Top-Level AND: Stack them
    if (node?.type === 'CallExpression' && node.name === 'and') {
        const args = flattenOp(node, 'and');
        return (
            <div className="condition-block condition-and">
                <span className="logic-label">All Required:</span>
                <div className="condition-stack">
                    {args.map((arg, i) => <ConditionView key={i} node={arg} />)}
                </div>
            </div>
        );
    }

    // 2. OR Chains: Group as tags
    if (node?.type === 'CallExpression' && node.name === 'or') {
        const args = flattenOp(node, 'or');
        return (
            <div className="condition-block condition-or">
                <span className="logic-label">Matches One Of:</span>
                <div className="condition-tags">
                    {args.map((arg, i) => <ConditionView key={i} node={arg} />)}
                </div>
            </div>
        );
    }

    // 3. Clean Equals: "Field = Value"
    if (node?.type === 'CallExpression' && node.name === 'equals') {
        return (
            <div className="condition-equals-inline">
                <span className="field-name">{node.arguments[0]?.value}</span>
                <span className="op">=</span>
                <CleanValue node={node.arguments[1]} />
            </div>
        );
    }

    // Fallback
    return <NodeView node={node} />;
};

// --- Card View for Complex Logic ---

const RuleCard = ({ row }) => {
    return (
        <div className="rule-card">
            <div className="rule-card-header">
                <span className="rule-label">Target OU</span>
                <div className="rule-result">
                    <CleanValue node={row.value} />
                </div>
            </div>
            <div className="rule-card-body">
                <div className="rule-conditions-label">Requires:</div>
                <div className="rule-conditions-content">
                    <ConditionView node={row.condition} />
                </div>
            </div>
        </div>
    );
};

const SmartSegment = ({ segment, index }) => {
    if (segment.type === 'tree') {
        return (
            <div className="segment-wrapper">
                <div className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Processing Rule</span>
                </div>
                <div className="segment-tree">
                    <NodeView node={segment.node} />
                </div>
            </div>
        );
    }

    const { rows, commonField } = segment;

    // Case A: Clean Table (Common Field detected)
    if (commonField) {
        return (
            <div className="smart-table-wrapper segment-table">
                <div className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Mapping by <span className="header-field">{commonField}</span></span>
                </div>
                <table className="smart-table">
                    <thead>
                        <tr>
                            <th><span className="header-label">If {commonField} is...</span></th>
                            <th>Target OU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            if (row.condition.type === 'Default') {
                                return (
                                    <tr key={idx}>
                                        <td><ConditionView node={row.condition} /></td>
                                        <td><CleanValue node={row.value} /></td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={idx}>
                                    <td>
                                        <CleanValue node={row.condition.arguments[1]} />
                                    </td>
                                    <td><CleanValue node={row.value} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // Case B: Complex Logic -> Card List
    return (
        <div className="smart-card-list segment-cards">
            <div className="segment-header">
                <span className="segment-index">#{index + 1}</span>
                <span>Complex Rules</span>
            </div>
            <div className="cards-container">
                {rows.map((row, idx) => (
                    <RuleCard key={idx} row={row} />
                ))}
            </div>
        </div>
    );
};

export default function FormulaVisualizer({ ast, error }) {
    if (error) {
        return (
            <div className="visualizer-error">
                <h3>Parse Error</h3>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!ast) {
        return <div className="visualizer-empty">No Formula Parsed</div>;
    }

    const segments = segmentLogicChain(ast);

    return (
        <div className="visualizer-container">
            <div className="view-mode-container">
                {segments.map((seg, i) => (
                    <SmartSegment key={i} segment={seg} index={i} />
                ))}
            </div>
        </div>
    );
}

