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
                    In Prefix notation, the function always comes <em>first</em>, followed by its arguments.
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

            <section className="docs-section" style={{ marginTop: '3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Data Types Section */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                            Understanding Data Types
                        </h5>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Every function expects specific inputs and returns a specific output type.
                            Mixing them up determines whether your formula works or breaks.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>String</span>
                                <span>Text (e.g. "Hello", "123")</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Number</span>
                                <span>Math-ready values (e.g. 10, 3.14)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>Boolean</span>
                                <span>True/False checks</span>
                            </div>
                        </div>
                    </div>

                    {/* Composition/Nesting Link Section */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05))',
                        border: '1px solid var(--accent-secondary)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                            Function Composition
                        </h5>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'auto' }}>
                            The output of one function can be use as the input for another! This is called <strong>Nesting</strong>.
                            <br /><br />
                            Instead of parentheses, we use <strong>Prefix Notation</strong> to chain logic together efficiently.
                        </p>
                        <button
                            onClick={() => onNavigate && onNavigate('nesting')}
                            style={{
                                marginTop: '1.5rem',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.6rem 1.2rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                alignSelf: 'start',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.target.style.transform = 'none'}
                        >
                            Learn about Nesting →
                        </button>
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
                            gridColumn: '1 / -1',
                            marginTop: idx === 0 ? 0 : '2rem'
                        }}>
                            <h5 style={{
                                margin: '0 0 1rem 0',
                                borderBottom: '1px solid var(--glass-border)',
                                paddingBottom: '0.5rem',
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem'
                            }}>
                                {cat.title}
                            </h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                {cat.ops.map(op => (
                                    <div
                                        key={op.name}
                                        onClick={() => onNavigate && onNavigate(cat.id, op.name)}
                                        style={{
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'var(--bg-secondary)';
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <code style={{
                                                color: 'var(--accent-primary)',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px'
                                            }}>
                                                {op.name}
                                            </code>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                border: '1px solid var(--glass-border)',
                                                padding: '0.1rem 0.4rem',
                                                borderRadius: '10px'
                                            }}>
                                                Returns: {op.returns || 'String'}
                                            </span>
                                        </div>

                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                            {op.desc}
                                        </div>

                                        <div style={{
                                            marginTop: 'auto',
                                            paddingTop: '0.8rem',
                                            fontSize: '0.8rem',
                                            fontFamily: 'monospace',
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {op.syntax}
                                        </div>
                                    </div>
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
