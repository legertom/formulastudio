import React from 'react';
import BlockNode from './BlockNode';

/**
 * IfFunctionView - Specialized visualization for the `if` function
 * Shows: Condition → Then/Else with the active branch highlighted
 */
const IfFunctionView = ({ node, traceMap, onHoverNode }) => {
    if (!node || node.type !== 'CallExpression' || node.name.toLowerCase() !== 'if') {
        return null;
    }

    const conditionArg = node.arguments[0]; // Condition
    const thenArg = node.arguments[1];      // Then branch
    const elseArg = node.arguments[2];      // Else branch

    // Get trace data
    const resultTrace = traceMap?.get(node);
    const conditionTrace = traceMap?.get(conditionArg);
    const conditionResult = conditionTrace?.value === true;

    // Determine which branch was taken
    const thenTaken = conditionResult === true;
    const elseTaken = conditionResult === false;

    // Get the result value
    const resultValue = resultTrace?.value;
    let resultDisplay = resultValue !== undefined ? String(resultValue) : '?';
    if (resultDisplay.length > 40) resultDisplay = resultDisplay.substring(0, 37) + '...';

    const handleNodeHover = (nodeToHighlight) => (e) => {
        e.stopPropagation();
        if (nodeToHighlight?.range && onHoverNode) {
            onHoverNode(nodeToHighlight.range);
        }
    };

    const handleLeave = () => {
        if (onHoverNode) onHoverNode(null);
    };

    // Branch component
    const Branch = ({ label, arg, isTaken, icon }) => (
        <div style={{
            padding: '0.5rem 0.75rem',
            background: isTaken
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isTaken
                ? 'rgba(34, 197, 94, 0.4)'
                : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '8px',
            opacity: isTaken ? 1 : 0.5,
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.4rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: isTaken ? '#4ade80' : 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <span>{icon}</span>
                <span>{label}</span>
                {isTaken && <span style={{ marginLeft: 'auto' }}>← ACTIVE</span>}
            </div>
            <div
                onMouseEnter={handleNodeHover(arg)}
                onMouseLeave={handleLeave}
                style={{ cursor: 'pointer' }}
            >
                {arg?.type === 'CallExpression' ? (
                    <BlockNode node={arg} traceMap={traceMap} />
                ) : (
                    <span style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        color: isTaken ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontSize: '0.9rem',
                        fontWeight: isTaken ? 600 : 400
                    }}>
                        {arg?.type === 'StringLiteral' ? `"${arg.value}"` : arg?.value || '?'}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="if-function-view" style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono, monospace)'
        }}>
            {/* Header: "if" with result pill */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--primary)'
                }}>if</span>
                <span style={{
                    fontSize: '0.85rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    borderLeft: '3px solid #a78bfa',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    → {resultDisplay}
                </span>
            </div>

            {/* Condition */}
            <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <span>🔍</span>
                    <span>Condition</span>
                    <span style={{
                        marginLeft: 'auto',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: conditionResult
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color: conditionResult ? '#4ade80' : '#fbbf24'
                    }}>
                        {conditionResult ? 'TRUE' : 'FALSE'}
                    </span>
                </div>
                <div
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={handleNodeHover(conditionArg)}
                    onMouseLeave={handleLeave}
                >
                    {conditionArg?.type === 'CallExpression' ? (
                        <BlockNode node={conditionArg} traceMap={traceMap} />
                    ) : (
                        <span style={{ color: '#7dd3fc' }}>
                            {conditionArg?.value || '?'}
                        </span>
                    )}
                </div>
            </div>

            {/* Branches */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem'
            }}>
                <Branch
                    label="Then"
                    arg={thenArg}
                    isTaken={thenTaken}
                    icon="✓"
                />
                {elseArg && (
                    <Branch
                        label="Else"
                        arg={elseArg}
                        isTaken={elseTaken}
                        icon="✗"
                    />
                )}
            </div>
        </div>
    );
};

export default IfFunctionView;
