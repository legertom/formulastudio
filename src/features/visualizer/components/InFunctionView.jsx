import React from 'react';

/**
 * InFunctionView - Specialized visualization for the `in` function
 * Shows: "Looking for: field → value" and "In this list: [chip] [chip] [chip]"
 * Highlights the matching item with a checkmark
 */
const InFunctionView = ({ node, traceMap, onHoverNode }) => {
    if (!node || node.type !== 'CallExpression' || node.name.toLowerCase() !== 'in') {
        return null;
    }

    const searchArg = node.arguments[0]; // What we're looking for (e.g., student.grade)
    const listArg = node.arguments[1];   // The list to search in (e.g., "1 2 3 4 7")

    // Get trace data for the overall result and individual args
    const resultTrace = traceMap?.get(node);
    const searchTrace = traceMap?.get(searchArg);
    const isMatch = resultTrace?.value === true;

    // Parse the search value
    const searchFieldName = searchArg?.type === 'Identifier' ? searchArg.value : null;
    const searchResolvedValue = searchTrace?.value !== undefined ? String(searchTrace.value) :
        (searchArg?.type === 'StringLiteral' ? searchArg.value : '?');

    // Parse list items from the string
    const listString = listArg?.type === 'StringLiteral' ? listArg.value : '';
    const listItems = listString.split(/\s+/).filter(item => item.length > 0);

    // Determine which item matches
    const matchingItem = isMatch ? searchResolvedValue : null;

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
        <div className="in-function-view" style={{
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono, monospace)'
        }}>
            {/* Header: "in" with result pill */}
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
                }}>in</span>
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

            {/* Row 1: Looking for */}
            <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginRight: '0.5rem'
                }}>Looking for:</span>
                <span
                    style={{
                        color: '#7dd3fc', // Cyan/teal for field references
                        cursor: 'pointer'
                    }}
                    onMouseEnter={handleNodeHover(searchArg)}
                    onMouseLeave={handleLeave}
                >
                    {searchFieldName || searchResolvedValue}
                </span>
                {searchFieldName && (
                    <>
                        <span style={{
                            color: 'var(--text-muted)',
                            margin: '0 0.4rem',
                            fontSize: '0.8rem'
                        }}>→</span>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.15rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            borderRadius: '5px',
                            color: '#60a5fa',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            {searchResolvedValue}
                        </span>
                    </>
                )}
            </div>

            {/* Row 2: In this list */}
            <div>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginRight: '0.5rem'
                }}>In this list:</span>
                <div
                    style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginTop: '0.3rem'
                    }}
                    onMouseEnter={handleNodeHover(listArg)}
                    onMouseLeave={handleLeave}
                >
                    {listItems.map((item, i) => {
                        const isMatchingItem = item === matchingItem;
                        return (
                            <span
                                key={i}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.2rem 0.5rem',
                                    background: isMatchingItem
                                        ? 'rgba(34, 197, 94, 0.15)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${isMatchingItem
                                        ? 'rgba(34, 197, 94, 0.5)'
                                        : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '5px',
                                    color: isMatchingItem ? '#4ade80' : 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    fontWeight: isMatchingItem ? 600 : 400,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isMatchingItem && <span>✓</span>}
                                {item}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InFunctionView;
