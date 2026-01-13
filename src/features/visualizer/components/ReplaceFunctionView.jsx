import React from 'react';
import BlockNode from './BlockNode';

/**
 * ReplaceFunctionView - Specialized visualization for the `replace` function
 * Shows: Source → Find/Replace → Result with visual transformation
 */
const ReplaceFunctionView = ({ node, traceMap, onHoverNode }) => {
    if (!node || node.type !== 'CallExpression' || node.name.toLowerCase() !== 'replace') {
        return null;
    }

    const sourceArg = node.arguments[0]; // Source text
    const findArg = node.arguments[1];   // Text to find
    const replaceArg = node.arguments[2]; // Text to replace with

    // Get trace data
    const resultTrace = traceMap?.get(node);
    const sourceTrace = traceMap?.get(sourceArg);

    // Get values
    const sourceValue = sourceTrace?.value !== undefined ? String(sourceTrace.value) :
        (sourceArg?.type === 'StringLiteral' ? sourceArg.value : '?');
    const findValue = findArg?.type === 'StringLiteral' ? findArg.value : '?';
    const replaceValue = replaceArg?.type === 'StringLiteral' ? replaceArg.value : '?';

    let resultValue = resultTrace?.value !== undefined ? String(resultTrace.value) : '?';
    if (resultValue.length > 50) resultValue = resultValue.substring(0, 47) + '...';

    // Check if replacement actually happened
    const hasMatch = sourceValue.includes(findValue);

    const handleNodeHover = (nodeToHighlight) => (e) => {
        e.stopPropagation();
        if (nodeToHighlight?.range && onHoverNode) {
            onHoverNode(nodeToHighlight.range);
        }
    };

    const handleLeave = () => {
        if (onHoverNode) onHoverNode(null);
    };

    // Visual representation of the find string (show quotes for spaces/empty)
    const displayFind = findValue === ' ' ? '" "' : findValue === '' ? '(empty)' : `"${findValue}"`;
    const displayReplace = replaceValue === ' ' ? '" "' : replaceValue === '' ? '(nothing)' : `"${replaceValue}"`;

    return (
        <div className="replace-function-view" style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono, monospace)'
        }}>
            {/* Header */}
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
                }}>replace</span>
                <span style={{
                    fontSize: '0.85rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    borderLeft: '3px solid #a78bfa',
                    maxWidth: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    → {resultValue}
                </span>
            </div>

            {/* Visual transformation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
            }}>
                {/* Find */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                    }}
                    onMouseEnter={handleNodeHover(findArg)}
                    onMouseLeave={handleLeave}
                >
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Find</span>
                    <span style={{
                        padding: '0.3rem 0.5rem',
                        background: hasMatch ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${hasMatch ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '5px',
                        color: hasMatch ? '#f87171' : 'var(--text-muted)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textDecoration: hasMatch ? 'line-through' : 'none'
                    }}>
                        {displayFind}
                    </span>
                </div>

                {/* Arrow */}
                <span style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)'
                }}>→</span>

                {/* Replace with */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                    }}
                    onMouseEnter={handleNodeHover(replaceArg)}
                    onMouseLeave={handleLeave}
                >
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Replace</span>
                    <span style={{
                        padding: '0.3rem 0.5rem',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '5px',
                        color: '#4ade80',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        {displayReplace}
                    </span>
                </div>
            </div>

            {/* Source */}
            <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem'
                }}>Source</div>
                <div
                    onMouseEnter={handleNodeHover(sourceArg)}
                    onMouseLeave={handleLeave}
                    style={{ cursor: 'pointer' }}
                >
                    {sourceArg?.type === 'CallExpression' ? (
                        <BlockNode node={sourceArg} traceMap={traceMap} />
                    ) : (
                        <div style={{
                            padding: '0.4rem 0.6rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#7dd3fc' }}>
                                {sourceArg?.type === 'Identifier' ? sourceArg.value : '?'}
                            </span>
                            {sourceTrace?.value !== undefined && (
                                <>
                                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        "{sourceValue}"
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReplaceFunctionView;
