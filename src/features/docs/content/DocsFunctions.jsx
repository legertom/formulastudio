import React from 'react';
import {
    TEXT_TRANSFORM_OPS,
    TEXT_EXTRACTION_OPS,
    SEARCH_REPLACE_OPS,
    MATH_DATE_OPS,
    LOGIC_OPS,
    UTILITY_OPS
} from '../data';

const DocsFunctions = ({ onNavigate }) => {

    const categories = [
        { title: "Text Transformation", ops: TEXT_TRANSFORM_OPS, id: 'text-transform' },
        { title: "Text Extraction", ops: TEXT_EXTRACTION_OPS, id: 'text-extraction' },
        { title: "Search & Replace", ops: SEARCH_REPLACE_OPS, id: 'search-replace' },
        { title: "Math & Dates", ops: MATH_DATE_OPS, id: 'math-dates' },
        { title: "Logic & Comparison", ops: LOGIC_OPS, id: 'logic' },
        { title: "Utilities", ops: UTILITY_OPS, id: 'utilities' }
    ];

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Functions</h3>
                <p>The building blocks of your formulas.</p>
            </header>

            <section className="docs-section">
                <h4>What is a Function?</h4>
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    borderLeft: '4px solid var(--accent-primary)'
                }}>
                    <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6 }}>
                        A <strong>Function</strong> is a command that performs a specific action.
                        It takes <strong>arguments</strong> (inputs) and produces a <strong>result</strong> (output).
                    </p>
                </div>

                <p>
                    In Polish notation, the function always comes <em>first</em>, followed by its arguments.
                    Think of it like a recipe: you state the action ("Bake") before listing the ingredients.
                </p>

                <div className="code-example-block" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Function</div>
                            <code style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>toUpper</code>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>+</div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Argument</div>
                            <code style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>name.first</code>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>=</div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Result</div>
                            <code style={{ border: '1px solid var(--success)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>"JOHN"</code>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Function Directory</h4>
                <p>Here is a complete list of available functions categorized by their purpose.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {categories.map((cat, idx) => (
                        <div key={idx} style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h5 style={{
                                margin: '0 0 1rem 0',
                                borderBottom: '1px solid var(--glass-border)',
                                paddingBottom: '0.5rem',
                                color: 'var(--text-primary)'
                            }}>
                                {cat.title}
                            </h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {cat.ops.map(op => (
                                    <button
                                        key={op.name}
                                        onClick={() => onNavigate && onNavigate(cat.id, op.name)}
                                        style={{
                                            background: 'rgba(139, 92, 246, 0.1)',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            borderRadius: '4px',
                                            padding: '0.3rem 0.6rem',
                                            color: 'var(--accent-primary)',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={e => {
                                            e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                                            e.target.style.transform = 'none';
                                        }}
                                    >
                                        {op.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DocsFunctions;
