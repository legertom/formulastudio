import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Reusable component for rendering a function category page
const FunctionCategoryPage = ({ title, description, ops }) => {
    const { pageId } = useParams();
    const [copiedId, setCopiedId] = useState(null);

    const handleCopyLink = (funcName) => {
        // Construct URL: origin + /docs/ + current category (pageId) + / + functionName
        // Default to 'intro' if pageId is missing (though unlikely for function pages)
        const category = pageId || 'intro';
        const url = `${window.location.origin}/docs/${category}/${funcName}`;

        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(funcName);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Basic': return 'var(--success)';
            case 'Intermediate': return 'var(--warning)';
            case 'Advanced': return 'var(--accent-primary)';
            default: return 'var(--text-secondary)';
        }
    };

    const renderExample = (example, idx) => (
        <div key={idx} style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            padding: '1rem'
        }}>
            <div style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                color: 'var(--success)',
                marginBottom: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {example.level && (
                    <span style={{
                        background: getLevelColor(example.level),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.65rem'
                    }}>
                        {example.level}
                    </span>
                )}
                Example
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
                <code style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    wordBreak: 'break-all'
                }}>
                    {example.code}
                </code>
            </div>

            {/* Argument Breakdown for educational examples */}
            {example.argBreakdown && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.85rem'
                }}>
                    <div style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: '0.5rem',
                        fontWeight: 600
                    }}>
                        Argument Breakdown
                    </div>
                    {example.argBreakdown.map((arg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.25rem',
                            alignItems: 'baseline'
                        }}>
                            <span style={{
                                color: 'var(--accent-secondary)',
                                fontWeight: 600,
                                minWidth: '45px'
                            }}>{arg.arg}:</span>
                            <code style={{
                                color: 'var(--warning)',
                                background: 'rgba(245, 158, 11, 0.1)',
                                padding: '1px 4px',
                                borderRadius: '3px'
                            }}>{arg.value}</code>
                            <span style={{ color: 'var(--text-secondary)' }}>— {arg.meaning}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Human English Translation */}
            {example.humanEnglish && (
                <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid var(--accent-secondary)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.9rem',
                    color: 'var(--accent-secondary)',
                    fontStyle: 'italic'
                }}>
                    🗣️ "{example.humanEnglish}"
                </div>
            )}

            <div style={{
                color: getLevelColor(example.level) || 'var(--success)',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
            }}>
                {example.result}
            </div>

            {example.translation && (
                <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    💡 {example.translation}
                </div>
            )}
        </div>
    );

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>{title}</h3>
                <p>{description}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {ops.map((op, idx) => (
                    <section key={idx} id={op.name} className="docs-section" style={{ marginBottom: 0, scrollMarginTop: '2rem' }}>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}>
                            {/* Function Header */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderBottom: '1px solid var(--glass-border)',
                                background: 'var(--glass-highlight)'
                            }}>
                                <h4 style={{ margin: 0, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {op.name}
                                    <button
                                        onClick={() => handleCopyLink(op.name)}
                                        title="Copy link to function"
                                        aria-label={`Copy link to ${op.name}`}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                            color: copiedId === op.name ? 'var(--success)' : 'var(--text-muted)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        className="hover:bg-glass-border" // Assuming tailwind or utility class, otherwise use inline style hover via state or CSS
                                    >
                                        {copiedId === op.name ? (
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Copied!</span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                            </svg>
                                        )}
                                    </button>
                                </h4>
                                {op.arity && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        marginLeft: '0.5rem'
                                    }}>
                                        ({op.arity} {op.arity === 1 ? 'argument' : 'arguments'})
                                    </span>
                                )}
                            </div>

                            {/* Function Body */}
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ marginTop: 0, marginBottom: '1rem' }}>{op.desc}</p>

                                {/* Syntax */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        marginBottom: '0.5rem',
                                        fontWeight: 600
                                    }}>
                                        Syntax
                                    </div>
                                    <div className="code-example-block" style={{ margin: 0 }}>
                                        <code>{op.syntax}</code>
                                    </div>
                                </div>

                                {/* Generic Arguments Explanation */}
                                {op.args && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            color: 'var(--text-muted)',
                                            marginBottom: '0.5rem',
                                            fontWeight: 600
                                        }}>
                                            Arguments
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }}>
                                            {op.args.map((arg, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    gap: '0.75rem',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <code style={{
                                                        color: 'var(--accent-secondary)',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        minWidth: '60px',
                                                        textAlign: 'center'
                                                    }}>{arg.name}</code>
                                                    <span style={{ color: 'var(--text-secondary)' }}>
                                                        {arg.desc}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Note with Diagram (for functions like substr) */}
                                {op.note && (
                                    <div style={{
                                        background: 'rgba(99, 102, 241, 0.08)',
                                        border: '1px solid var(--accent-secondary)',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'var(--accent-secondary)',
                                            marginBottom: '0.5rem'
                                        }}>
                                            📐 {op.note.title}
                                        </div>
                                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
                                            {op.note.content}
                                        </p>

                                        {/* Position Diagram Table */}
                                        {op.note.diagram && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <table style={{
                                                    borderCollapse: 'collapse',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    <thead>
                                                        <tr>
                                                            <td style={{
                                                                padding: '0.25rem 0.5rem',
                                                                color: 'var(--text-muted)',
                                                                fontSize: '0.7rem'
                                                            }}>Position:</td>
                                                            {op.note.diagram.map((item, i) => (
                                                                <td key={i} style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    textAlign: 'center',
                                                                    color: 'var(--accent-secondary)',
                                                                    fontWeight: 600
                                                                }}>{item.pos}</td>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{
                                                                padding: '0.25rem 0.5rem',
                                                                color: 'var(--text-muted)',
                                                                fontSize: '0.7rem'
                                                            }}>Character:</td>
                                                            {op.note.diagram.map((item, i) => (
                                                                <td key={i} style={{
                                                                    padding: '0.5rem 0.75rem',
                                                                    textAlign: 'center',
                                                                    background: 'var(--bg-tertiary)',
                                                                    border: '1px solid var(--glass-border)',
                                                                    fontWeight: 600
                                                                }}>{item.char}</td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {op.note.example && (
                                            <code style={{
                                                display: 'block',
                                                background: 'var(--bg-tertiary)',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem'
                                            }}>
                                                {op.note.example}
                                            </code>
                                        )}
                                    </div>
                                )}

                                {/* Multiple Examples */}
                                {op.examples && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {op.examples.map((example, i) => renderExample(example, i))}
                                    </div>
                                )}

                                {/* Single Example (backward compatible) */}
                                {op.example && !op.examples && renderExample(op.example, 0)}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default FunctionCategoryPage;
