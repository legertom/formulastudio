
import React, { useContext } from 'react';
import { tokenize, parse } from '../../../lib/parser';
import { FormulaContext } from '../FormulaContext';
import { segmentLogicChain } from '../logic/pathExpansion';
import SmartSegment from './SmartSegment';

const GroupLogicView = ({ ast }) => {
    const { onHoverNode, searchTerm } = useContext(FormulaContext); // Loop var might be passed down or set here?
    // Actually FormulaVisualizer sets the provider?
    // In original code, GroupLogicView SETS the provider.

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
        <FormulaContext.Provider value={{ loopVariable, onHoverNode, searchTerm, targetLabel: 'Target Group' }}>
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

export default GroupLogicView;
