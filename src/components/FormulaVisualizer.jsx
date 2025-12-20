import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';

// --- Context ---
const FormulaContext = createContext({ loopVariable: null, onHoverNode: () => { } });

// --- Concat Flattener ---

function flattenConcat(node) {
    if (node?.type === 'CallExpression' && node.name === 'concat') {
        return node.arguments.flatMap(flattenConcat);
    }
    return [node];
}

const ConcatView = ({ node }) => {
    const parts = flattenConcat(node);

    return (
        <div className="concat-stream">
            {parts.map((part, i) => (
                <div key={i} className="stream-part-wrapper">
                    {i > 0 && <span className="stream-plus">+</span>}
                    <CleanValue node={part} />
                </div>
            ))}
        </div>
    );
};



// --- Path Expansion Logic (The "Simulator") ---

/**
 * Expands a node into all possible execution paths (Scenarios).
 * Returns: Array of { valueParts: Node[], conditions: Node[] }
 */
function expandLogicPaths(node) {
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
            // We don't explicitly store "NOT condition" for visualizer simplicity usually,
            // but if it's an if-chain, `falseVal` is usually another IF.
            // If `falseVal` is just a value, it's the "Catch All" / "Else".
            // We can mark it as a "Default" condition if we want to show it.
            falsePaths.forEach(p => {
                // If the *next* thing is an IF, we don't strictly technically need to say "NOT Prev", 
                // because the Next IF's condition will be the focus.
                // However, for pure else, we might want a marker.
                // Let's rely on the structure: if falseVal is NOT an if, it's a catch-all.
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
function hasNestedLogic(node) {
    if (!node) return false;
    if (node.type === 'CallExpression' && node.name === 'if') return true;
    if (node.arguments) return node.arguments.some(hasNestedLogic);
    return false;
}


// --- Scenario View (Flattened) ---

const LogicScenariosView = ({ node }) => {
    // 1. Calculate all possible outcomes
    const paths = expandLogicPaths(node);

    // Filter out paths that result in purely empty strings if they are just fallbacks?
    // User might want to see them. Let's keep them but maybe dim them.

    return (
        <div className="scenarios-container">
            {paths.map((path, i) => {
                // Check if purely empty
                const isEmpty = path.valueParts.every(p => p.type === 'StringLiteral' && !p.value);
                // "Otherwise" condition is present if we hit an explicit else
                const isDefault = path.conditions.some(c => c.type === 'Default');

                return (
                    <div key={i} className={`scenario-card ${isEmpty ? 'scenario-empty' : ''}`}>
                        <header className="scenario-header">
                            <span className="scenario-label">Group Name Pattern</span>
                            <div className="scenario-result-stream">
                                {isEmpty ? (
                                    <span style={{ opacity: 0.5 }}>(Unique Empty Result)</span>
                                ) : (
                                    path.valueParts.map((part, pIdx) => (
                                        <CleanValue key={pIdx} node={part} />
                                    ))
                                )}
                            </div>
                        </header>
                        <div className="scenario-body">
                            <div className="reqs-label">Requires:</div>
                            <div className="scenario-reqs-list">
                                {path.conditions.length === 0 ? (
                                    <span style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.8em' }}>Always matches</span>
                                ) : (
                                    path.conditions.map((cond, cIdx) => {
                                        if (cond.type === 'Default') return <span key={cIdx} className="sc-catch-all">No other rules matched</span>;
                                        return <ConditionView key={cIdx} node={cond} />;
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const NodeView = ({ node }) => {
    const { loopVariable, onHoverNode } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = (e) => {
        // e.stopPropagation(); // Maybe? 
        onHoverNode(null);
    };

    if (!node) return null;

    if (node.type === 'StringLiteral') {
        return <span className="node-string" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>"{node.value}"</span>;
    }

    if (node.type === 'Identifier') {
        const isLoopVar = loopVariable && (node.value === loopVariable || node.value.startsWith(`${loopVariable}.`));
        return (
            <span className={`node-ident ${isLoopVar ? 'node-loop-var' : ''}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                {node.value}
            </span>
        );
    }

    if (node.type === 'CallExpression') {
        // Smart Switching:
        // If it's a Concat AND it has nested IFs, use the Flattened Scenario View
        if (node.name === 'concat' && hasNestedLogic(node)) {
            return <LogicScenariosView node={node} />;
        }

        if (node.name === 'concat') {
            return <ConcatView node={node} />; // Standard stream for simple concats
        }
        if (node.name === 'if') {
            // Also use Scenario View for top-level embedded IFs (not wrapped in concat)
            // to maintain consistency if they are just pure logic trees.
            // But wait, our previous view was nice cards.
            // Actually, expandLogicPaths works for IFs too. 
            // If we use ScenarioView here, it standardizes everything to "Output -> Conditions".
            return <LogicScenariosView node={node} />;
        }

        return (
            <div className={`node-call node-${node.name}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
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
    const { onHoverNode } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = () => onHoverNode(null);

    if (node?.type === 'StringLiteral') {
        if (!node.value) {
            return <span className="clean-string empty" style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.85em' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>(Empty)</span>;
        }
        return <span className="clean-string" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>{node.value}</span>;
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
    const { onHoverNode } = useContext(FormulaContext);

    const handleEnter = (e) => {
        e.stopPropagation();
        if (node?.range) onHoverNode(node.range);
    };
    const handleLeave = () => onHoverNode(null);

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
            <div className="condition-block condition-and" role="group" aria-label="All conditions required" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
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
            <div className="condition-block condition-or" role="group" aria-label="At least one condition required" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
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
            <div className="condition-equals-inline" aria-label={`${node.arguments[0]?.value} equals ${node.arguments[1]?.value}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="field-name">{node.arguments[0]?.value}</span>
                <span className="op">=</span>
                <CleanValue node={node.arguments[1]} />
            </div>
        );
    }

    // 4. Clean In/Contains: "Field IN List"
    if (node?.type === 'CallExpression' && (node.name === 'in' || node.name === 'contains')) {
        return (
            <div className="condition-equals-inline" style={{ maxWidth: '100%' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <span className="field-name">{node.arguments[0]?.value}</span>
                <span className="op" style={{ color: 'var(--accent-secondary)' }}>IN</span>
                <div style={{ display: 'inline-block', maxWidth: '150px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <CleanValue node={node.arguments[1]} />
                </div>
            </div>
        );
    }

    // Fallback
    return <NodeView node={node} />;
};

// --- Embedded Logic (String Builder context) ---

// --- Nested Logic Card (Inspired by RuleCard) ---
const LogicResultCard = ({ row }) => {
    const isCatchAll = row.condition.type === 'Default';

    return (
        <div className="logic-result-card">
            <header className="card-header">
                <span className="card-label">Result</span>
                <div className="card-value">
                    <CleanValue node={row.value} />
                </div>
            </header>
            <div className="card-reqs">
                <div className="reqs-label">{isCatchAll ? 'Otherwise' : 'Requires:'}</div>
                <div className="reqs-content">
                    {isCatchAll ? (
                        <span className="sc-catch-all">Fallback</span>
                    ) : (
                        <ConditionView node={row.condition} />
                    )}
                </div>
            </div>
        </div>
    );
};

const EmbeddedLogicView = ({ node }) => {
    const segments = segmentLogicChain(node);

    return (
        <div className="embedded-logic-container">
            {segments.map((seg, i) => (
                <div key={i} className="embedded-segment">
                    {seg.rows ? (
                        <div className="embedded-cards">
                            {seg.rows.map((row, idx) => (
                                <LogicResultCard key={idx} row={row} />
                            ))}
                        </div>
                    ) : (
                        <div className="embedded-raw">
                            <NodeView node={seg.node} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
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
    const { onHoverNode } = useContext(FormulaContext);
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
    const loopVariable = varNameNode?.value;

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
        <FormulaContext.Provider value={{ loopVariable, onHoverNode }}>
            <div className="group-logic-container">
                <div className="group-args-breakdown" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    background: 'var(--bg-secondary)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ForEach Iterator</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {/* Arg 1: Variable */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                color: 'var(--accent-secondary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid var(--glass-border)'
                            }}>
                                Arg 1
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Variable</div>
                                <div className="node-loop-var" style={{ fontSize: '0.9rem' }}>"{varNameNode?.value}"</div>
                            </div>
                        </div>

                        {/* Arg 2: List */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                color: 'var(--warning)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid var(--glass-border)'
                            }}>
                                Arg 2
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Source List</div>
                                <div className="node-ident" style={{ fontSize: '0.9rem' }}>{listNode?.value || 'list'}</div>
                            </div>
                        </div>

                        {/* Arg 3: Logic */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                color: 'var(--success)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: '1px solid var(--glass-border)'
                            }}>
                                Arg 3
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Inner Logic</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    (Visualized below)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
        </FormulaContext.Provider>
    );
};

export default function FormulaVisualizer({ ast, error, mode = 'OU', onHoverNode = () => { } }) {
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
        <FormulaContext.Provider value={{ loopVariable: null, onHoverNode }}>
            <div className="visualizer-container">
                <div className="view-mode-container">
                    {segments.map((seg, i) => (
                        <SmartSegment key={i} segment={seg} index={i} />
                    ))}
                </div>
            </div>
        </FormulaContext.Provider>
    );
}

