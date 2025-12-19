import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
            segments.push({ type: 'table', rows: [...currentBuffer], commonField: currentSubject });
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

const PortalTooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position above the element centered
            setCoords({
                top: rect.top - 10, // 10px spacing
                left: rect.left + rect.width / 2
            });
            setVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="portal-tooltip-trigger"
            >
                {children}
            </span>
            {visible && createPortal(
                <div
                    className="portal-tooltip"
                    style={{
                        top: coords.top,
                        left: coords.left,
                    }}
                    role="tooltip"
                >
                    {text}
                </div>,
                document.body
            )}
        </>
    );
};
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
            <PortalTooltip text="This is the OU that users go into if they don't fit anywhere else.">
                <span className="node-keyword node-catch-all">
                    Catch All
                    <span className="info-icon" aria-label="What is Catch All?">?</span>
                </span>
            </PortalTooltip>
        );
    }

    // 1. Top-Level AND: Stack them
    if (node?.type === 'CallExpression' && node.name === 'and') {
        const args = flattenOp(node, 'and');
        return (
            <div className="condition-block condition-and" role="group" aria-label="All conditions required">
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
            <div className="condition-block condition-or" role="group" aria-label="At least one condition required">
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
            <div className="condition-equals-inline" aria-label={`${node.arguments[0]?.value} equals ${node.arguments[1]?.value}`}>
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
    const isCatchAll = row.condition.type === 'Default';

    return (
        <article className="rule-card">
            <header className="rule-card-header">
                <span className="rule-label">Target OU</span>
                <div className="rule-result">
                    <CleanValue node={row.value} />
                </div>
                {isCatchAll && <ConditionView node={row.condition} />}
            </header>
            {!isCatchAll && (
                <div className="rule-card-body">
                    <div className="rule-conditions-label">Requires:</div>
                    <div className="rule-conditions-content">
                        <ConditionView node={row.condition} />
                    </div>
                </div>
            )}
        </article>
    );
};

const SmartSegment = ({ segment, index }) => {
    if (segment.type === 'tree') {
        return (
            <section className="segment-wrapper" aria-label={`Logic Segment ${index + 1}`}>
                <header className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Processing Rule</span>
                </header>
                <div className="segment-tree">
                    <NodeView node={segment.node} />
                </div>
            </section>
        );
    }

    const { rows, commonField } = segment;

    // Case A: Clean Table (Common Field detected)
    if (commonField) {
        return (
            <section className="smart-table-wrapper segment-table" aria-label={`Mapping Table for ${commonField}`}>
                <header className="segment-header">
                    <span className="segment-index">#{index + 1}</span>
                    <span>Mapping by <span className="header-field">{commonField}</span></span>
                </header>
                <table className="smart-table">
                    <thead>
                        <tr>
                            <th scope="col"><span className="header-label">If {commonField} is...</span></th>
                            <th scope="col">Target OU</th>
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
            </section>
        );
    }

    // Case B: Complex Logic -> Card List
    return (
        <section className="smart-card-list segment-cards" aria-label={`Complex Rules Segment ${index + 1}`}>
            <header className="segment-header">
                <span className="segment-index">#{index + 1}</span>
                <span>Complex Rules</span>
            </header>
            <div className="cards-container">
                {rows.map((row, idx) => (
                    <RuleCard key={idx} row={row} />
                ))}
            </div>
        </section>
    );
};

export default function FormulaVisualizer({ ast, error, mode = 'OU' }) {
    if (mode === 'GROUP') {
        return (
            <div className="visualizer-empty" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                opacity: 0.6
            }}>
                <h3>Group Logic Visualization</h3>
                <p>Coming Soon</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="visualizer-error" role="alert">
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

