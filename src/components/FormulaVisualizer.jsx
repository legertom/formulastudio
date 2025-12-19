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

const RuleCard = ({ row, targetLabel = "Target OU" }) => {
    const isCatchAll = row.condition.type === 'Default';

    return (
        <article className="rule-card">
            <header className="rule-card-header">
                <span className="rule-label">{targetLabel}</span>
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

const SmartSegment = ({ segment, index, targetLabel = "Target OU" }) => {
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
                            <th scope="col">{targetLabel}</th>
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
                    <RuleCard key={idx} row={row} targetLabel={targetLabel} />
                ))}
            </div>
        </section>
    );
};

import { tokenize, parse } from '../lib/parser';

const GroupLogicView = ({ ast, error }) => {
    // 1. Check if it's a forEach loop
    const isForEach = ast?.type === 'CallExpression' && ast.name === 'forEach';

    // Verification: If NOT forEach, render as standard logic but with "Target Group" label
    if (!isForEach) {
        const segments = segmentLogicChain(ast);
        return (
            <div className="view-mode-container">
                {segments.map((seg, i) => (
                    <SmartSegment key={i} segment={seg} index={i} targetLabel="Target Group" />
                ))}
            </div>
        );
    }

    const [varNameNode, listNode, logicNode] = ast.arguments;

    // 2. Extract Logic AST
    let innerAst = null;
    let parseError = null;

    try {
        if (logicNode?.type === 'StringLiteral') {
            // Case A: Encoded String (Standard)
            const decoded = decodeURIComponent(logicNode.value);
            const tokens = tokenize(decoded);
            innerAst = parse(tokens);
        } else if (logicNode?.type === 'CallExpression') {
            // Case B: Direct Expression (User Friendly / Pre-Encoded)
            innerAst = logicNode;
        } else {
            // Fallback or empty
            innerAst = null;
        }
    } catch (e) {
        parseError = e.message;
    }

    const segments = innerAst ? segmentLogicChain(innerAst) : [];

    return (
        <div className="group-logic-container">
            <header className="group-header" style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M2 12h20" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                        Iterator Context
                    </div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        For Each <span className="node-string" style={{ margin: '0 0.25rem' }}>"{varNameNode?.value}"</span> in <span className="node-ident" style={{ margin: '0 0.25rem' }}>{listNode?.value || 'list'}</span>
                    </div>
                </div>
            </header>

            {parseError ? (
                <div className="visualizer-error">
                    <h3>Inner Logic Parse Error</h3>
                    <p>{parseError}</p>
                </div>
            ) : (
                <div className="view-mode-container">
                    {segments.length > 0 ? (
                        segments.map((seg, i) => (
                            <SmartSegment key={i} segment={seg} index={i} targetLabel="Target Group" />
                        ))
                    ) : (
                        <div className="visualizer-empty" style={{ padding: '2rem' }}>
                            No logic defined inside loop
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function FormulaVisualizer({ ast, error, mode = 'OU' }) {
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

    if (mode === 'GROUP') {
        return (
            <div className="visualizer-container">
                <GroupLogicView ast={ast} error={error} />
            </div>
        );
    }

    // Default OU View
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

