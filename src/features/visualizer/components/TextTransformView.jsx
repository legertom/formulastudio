import React from 'react';

/**
 * TextTransformView - Specialized visualization for text transformation functions
 * Handles: toLower, toUpper, upper, lower, trim, initials, alphanumeric
 * Shows: Function name header + Input → Output
 */
const TextTransformView = ({ node, traceMap, onHoverNode, funcName }) => {
    if (!node || node.type !== 'CallExpression') {
        return null;
    }

    const inputArg = node.arguments[0];

    // Get trace data
    const resultTrace = traceMap?.get(node);
    const inputTrace = traceMap?.get(inputArg);

    // Get values
    const inputFieldName = inputArg?.type === 'Identifier' ? inputArg.value : null;
    const inputValue = inputTrace?.value !== undefined ? String(inputTrace.value) :
        (inputArg?.type === 'StringLiteral' ? inputArg.value : '?');

    let resultValue = resultTrace?.value !== undefined ? String(resultTrace.value) : '?';

    // Transformation colors
    const transformColors = {
        'tolower': '#60a5fa',
        'lower': '#60a5fa',
        'toupper': '#f472b6',
        'upper': '#f472b6',
        'trim': '#fbbf24',
        'initials': '#a78bfa',
        'alphanumeric': '#34d399'
    };

    const color = transformColors[funcName.toLowerCase()] || 'var(--primary)';

    const handleNodeHover = (nodeToHighlight) => (e) => {
        e.stopPropagation();
        if (nodeToHighlight?.range && onHoverNode) {
            onHoverNode(nodeToHighlight.range);
        }
    };

    const handleLeave = () => {
        if (onHoverNode) onHoverNode(null);
    };

    return (
        <div className="text-transform-view" style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono, monospace)'
        }}>
            {/* Header with function name and result */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: color
                }}>{node.name}</span>
                <span style={{
                    fontSize: '0.85rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: `${color}22`,
                    color: color,
                    borderLeft: `3px solid ${color}`,
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    → {resultValue.length > 25 ? resultValue.substring(0, 22) + '...' : resultValue}
                </span>
            </div>

            {/* Input → Output transformation */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    cursor: 'pointer'
                }}
                onMouseEnter={handleNodeHover(inputArg)}
                onMouseLeave={handleLeave}
            >
                {/* Input */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                }}>
                    {inputFieldName && (
                        <span style={{ color: '#7dd3fc' }}>
                            {inputFieldName}
                        </span>
                    )}
                    {inputFieldName && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            = "{inputValue.length > 20 ? inputValue.substring(0, 17) + '...' : inputValue}"
                        </span>
                    )}
                    {!inputFieldName && (
                        <span style={{ color: 'var(--text-secondary)' }}>
                            "{inputValue}"
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextTransformView;
