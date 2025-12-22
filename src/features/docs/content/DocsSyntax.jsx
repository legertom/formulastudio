import React from 'react';

const DocsSyntax = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Syntax Overview</h3>
                <p>Understanding the unique notation that powers IDM formulas.</p>
            </header>

            {/* Prefix Notation History & Explanation */}
            <section className="docs-section">
                <h4>🚀 What is Prefix Notation?</h4>

                <p>
                    IDM formulas use <strong>Prefix Notation</strong> (historically known as <strong>Polish Notation</strong>).
                </p>
                <p>
                    It was invented in 1924 by the Polish logician and mathematician <strong>Jan Łukasiewicz</strong>.
                    His goal was to create a logic system that could be written purely linearly, <strong>eliminating the need for parentheses</strong> entirely.
                </p>

                <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid var(--accent-secondary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                        💡 The Key Insight
                    </div>
                    <p style={{ margin: 0 }}>
                        In Prefix Notation, the <strong>operator comes FIRST</strong>, followed by its arguments.
                        Because each function knows exactly how many arguments it needs,
                        <strong> no parentheses are ever needed</strong>.
                    </p>
                </div>

                <h5 style={{ marginTop: '1.5rem' }}>Comparison: Normal vs Prefix</h5>
                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>What You Mean</th>
                            <th>Normal (Infix)</th>
                            <th>Prefix Notation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Add 1 and 2</td>
                            <td><code>1 + 2</code></td>
                            <td><code>+ 1 2</code></td>
                        </tr>
                        <tr>
                            <td>Multiply 3 by 4</td>
                            <td><code>3 × 4</code></td>
                            <td><code>× 3 4</code></td>
                        </tr>
                        <tr>
                            <td>Is A equal to B?</td>
                            <td><code>A == B</code></td>
                            <td><code>equals A B</code></td>
                        </tr>
                        <tr>
                            <td>If X then Y else Z</td>
                            <td><code>X ? Y : Z</code></td>
                            <td><code>if X Y Z</code></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <hr className="docs-divider" />

            {/* Analogy Section */}
            <section className="docs-section">
                <h4>👨‍🍳 The Recipe Analogy</h4>
                <p>
                    Think of functions as <strong>cooking commands</strong>. When you follow a recipe, the instructions usually start with the <strong>VERB (Action)</strong>, followed by the ingredients.
                </p>

                <div className="docs-analogy-box">
                    <div className="docs-analogy-icon">🥣</div>
                    <div className="docs-analogy-content">
                        <h5>Verb First</h5>
                        <p style={{ marginBottom: '0.5rem' }}>
                            In English, we say: <em>"<strong>Mix</strong> flour, eggs, and milk."</em>
                        </p>
                        <p>
                            We <strong>don't</strong> usually say: <em>"Flour, eggs, and milk <strong>mix</strong>."</em>
                        </p>
                    </div>
                </div>

                <p>
                    IDM formulas work the same way. You always state <strong>WHAT you're doing first</strong> (the function),
                    then provide the items to do it to (the arguments):
                </p>

                <div className="code-example-block">
                    <code>{`{{toLower name.first}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ☝️ "Apply TOLOWER to name.first"
                </p>
            </section>

            <hr className="docs-divider" />

            {/* How Parsing Works */}
            <section className="docs-section">
                <h4>🔍 How the Parser Reads Your Formula</h4>
                <p>
                    The parser reads <strong>left to right</strong>. When it finds a function,
                    it immediately consumes the next N tokens as arguments (where N is the function's arity).
                </p>

                <div className="code-example-block">
                    <code>{`{{if equals user.role "admin" "Allow" "Deny"}}`}</code>
                </div>

                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        STEP-BY-STEP PARSING:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <div>
                            <strong>1.</strong> Parser sees <code style={{ color: 'var(--accent-secondary)' }}>if</code> — needs 3 arguments
                        </div>
                        <div style={{ paddingLeft: '1rem' }}>
                            <strong>2.</strong> Arg 1: sees <code style={{ color: 'var(--warning)' }}>equals</code> — needs 2 arguments
                            <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                                → consumes <code>user.role</code> and <code>"admin"</code>
                            </div>
                        </div>
                        <div style={{ paddingLeft: '1rem' }}>
                            <strong>3.</strong> Arg 2: consumes <code style={{ color: 'var(--success)' }}>"Allow"</code>
                        </div>
                        <div style={{ paddingLeft: '1rem' }}>
                            <strong>4.</strong> Arg 3: consumes <code style={{ color: 'var(--error)' }}>"Deny"</code>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            {/* Why No Parentheses */}
            <section className="docs-section">
                <h4>Why No Parentheses?</h4>
                <p>
                    In traditional programming, parentheses are used to group logic: <code>if(equals(a, b), "yes", "no")</code>.
                </p>
                <p>
                    Prefix Notation doesn't need them because <strong>each function knows exactly how many
                        arguments it consumes</strong>. The parser automatically figures out where one function's
                    arguments end and the next begins.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--error)', marginBottom: '0.5rem' }}>
                            ❌ Traditional Infix
                        </div>
                        <code style={{ fontSize: '0.85rem' }}>if(equals(role, "admin"), "Yes", "No")</code>
                    </div>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
                            ✅ Prefix Notation
                        </div>
                        <code style={{ fontSize: '0.85rem' }}>{`{{if equals role "admin" "Yes" "No"}}`}</code>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            {/* Quick Reference */}
            <section className="docs-section">
                <h4>Quick Reference</h4>
                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>Concept</th>
                            <th>Rule</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Formula wrapper</td>
                            <td>All formulas must be wrapped in <code>{`{{ }}`}</code></td>
                        </tr>
                        <tr>
                            <td>Function first</td>
                            <td>Function name always comes before its arguments</td>
                        </tr>
                        <tr>
                            <td>Reading order</td>
                            <td>Left to right, each function consumes what it needs</td>
                        </tr>
                        <tr>
                            <td>Nesting</td>
                            <td>Functions can be nested inside other functions (no extra syntax needed)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default DocsSyntax;
