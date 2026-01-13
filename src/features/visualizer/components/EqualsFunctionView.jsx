import React from 'react';

/**
 * EqualsFunctionView - Specialized visualization for the `equals` function
 * Shows: "Comparing: valueA ≟ valueB" with match/no-match visual feedback
 */
const EqualsFunctionView = ({ node, traceMap, onHoverNode }) => {
    if (!node || node.type !== 'CallExpression' || node.name.toLowerCase() !== 'equals') {
        return null;
    }

    const leftArg = node.arguments[0];  // First value
    const rightArg = node.arguments[1]; // Second value

    // Get trace data
    const resultTrace = traceMap?.get(node);
    const leftTrace = traceMap?.get(leftArg);
    const rightTrace = traceMap?.get(rightArg);
    const isMatch = resultTrace?.value === true;

    // Parse values
    const getDisplayInfo = (arg, trace) => {
        const fieldName = arg?.type === 'Identifier' ? arg.value : null;
        const resolvedValue = trace?.value !== undefined ? String(trace.value) :
            (arg?.type === 'StringLiteral' ? arg.value : '?');
        return { fieldName, resolvedValue };
    };

    const leftInfo = getDisplayInfo(leftArg, leftTrace);
    const rightInfo = getDisplayInfo(rightArg, rightTrace);

    const handleNodeHover = (nodeToHighlight) => (e) => {
        e.stopPropagation();
        if (nodeToHighlight?.range && onHoverNode) {
            onHoverNode(nodeToHighlight.range);
        }
    };

    const handleLeave = () => {
        if (onHoverNode) onHoverNode(null);
    };

    // Value display component
    const ValueBox = ({ info, arg, side }) => (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                cursor: 'pointer'
            }}
            onMouseEnter={handleNodeHover(arg)}
            onMouseLeave={handleLeave}
        >
            {info.fieldName && (
                <span style={{
                    fontSize: '0.75rem',
                    color: '#7dd3fc',
                    fontFamily: 'var(--font-mono, monospace)'
                }}>
                    {info.fieldName}
                </span>
            )}
            <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                background: isMatch
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isMatch
                    ? 'rgba(34, 197, 94, 0.4)'
                    : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px',
                fontFamily: 'var(--font-mono, monospace)'
            }}>
                {info.resolvedValue || '(empty)'}
            </span>
        </div>
    );

    return (
        <div className="equals-function-view" style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono, monospace)'
        }}>
            {/* Header: "equals" with result pill */}
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
                }}>equals</span>
                <span style={{
                    fontSize: '0.85rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: isMatch ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isMatch ? '#4ade80' : '#fbbf24',
                    borderLeft: `3px solid ${isMatch ? '#4ade80' : '#fbbf24'}`
                }}>
                    → {isMatch ? 'true' : 'false'}
                </span>
            </div>

            {/* Comparison visualization */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <ValueBox info={leftInfo} arg={leftArg} side="left" />

                {/* Comparison operator */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 0.25rem'
                }}>
                    <span style={{
                        fontSize: '1.5rem',
                        color: isMatch ? '#4ade80' : '#fbbf24',
                        fontWeight: 'bold'
                    }}>
                        {isMatch ? '=' : '≠'}
                    </span>
                    <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.1rem'
                    }}>
                        {isMatch ? 'match!' : 'no match'}
                    </span>
                </div>

                <ValueBox info={rightInfo} arg={rightArg} side="right" />
            </div>
        </div>
    );
};

export default EqualsFunctionView;
