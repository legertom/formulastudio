import React from 'react';

const DocsBooleans = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Booleans</h3>
                <p>The decision makers: True and False.</p>
            </header>

            <section className="docs-section">
                <h4>What is a Boolean?</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                    border: '1px solid var(--info)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.7 }}>
                        A <strong>Boolean</strong> is a value that can only be one of two things: <br />
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>True</span> (Yes, Correct, On) or <br />
                        <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>False</span> (No, Incorrect, Off).
                    </p>
                </div>
                <p>
                    They are the heartbeat of logic. Every time you ask "Is this user Active?" or "Is the grade greater than 10?", you are asking a question that returns a Boolean.
                </p>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>How IDM Formula Handles Them</h4>
                <p>
                    Unlike some programming languages that have a strict <code>bool</code> type, IDM Formula is flexible.
                    It primarily uses <strong>Strings</strong> to represent these values.
                </p>

                <div className="docs-card-grid">
                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.2em' }}>🔤</span>
                            Explicit Strings
                        </h4>
                        <p>
                            The text values <code>"True"</code> and <code>"False"</code> are standard.
                        </p>
                        <div className="code-example-mini" style={{ marginTop: '0.5rem' }}>
                            <code>"True"</code>
                        </div>
                    </div>

                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.2em' }}>👁️</span>
                            Presence
                        </h4>
                        <p>
                            Checking if a value exists. Non-empty values are often treated as "True".
                        </p>
                        <div className="code-example-mini" style={{ marginTop: '0.5rem' }}>
                            <code>if name.middle ...</code>
                        </div>
                    </div>
                </div>
            </section>

            <section className="docs-section">
                <h4>1. Functions that Output Booleans</h4>
                <p>
                    These are the "Question Askers". They examine data and return a "True" or "False" answer.
                </p>
                <div className="docs-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="docs-feature-card">
                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Comparisons</h5>
                        <ul className="docs-list" style={{ fontSize: '0.9rem' }}>
                            <li><code>equals</code></li>
                            <li><code>greater</code> / <code>less</code></li>
                            <li><code>geq</code> / <code>leq</code></li>
                        </ul>
                    </div>

                    <div className="docs-feature-card">
                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Checks</h5>
                        <ul className="docs-list" style={{ fontSize: '0.9rem' }}>
                            <li><code>contains</code></li>
                            <li><code>in</code></li>
                            <li><code>isEmpty</code></li>
                        </ul>
                    </div>

                    <div className="docs-feature-card">
                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Logic</h5>
                        <ul className="docs-list" style={{ fontSize: '0.9rem' }}>
                            <li><code>not</code></li>
                            <li><code>and</code></li>
                            <li><code>or</code></li>
                        </ul>
                    </div>
                </div>
                <div className="code-example-block" style={{ marginTop: '1rem' }}>
                    <code>{`{{equals user.department "IT"}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Returns <code>"True"</code> if the department is IT, otherwise <code>"False"</code>.
                </p>
            </section>

            <section className="docs-section">
                <h4>2. Functions that Consume Booleans</h4>
                <p>
                    These are the "Decision Makers". They take a "True" or "False" result and do something with it.
                </p>

                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1.5rem'
                }}>
                    <ul className="docs-list" style={{ margin: 0 }}>
                        <li>
                            <strong><code>if</code></strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                The primary consumer. Takes a boolean test and splits the path.
                            </div>
                        </li>
                        <li>
                            <strong><code>and</code> / <code>or</code></strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Combine multiple boolean answers into one final boolean.
                            </div>
                        </li>
                        <li>
                            <strong><code>not</code></strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Flips a boolean answer (True &rarr; False).
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="code-example-block" style={{ marginTop: '1rem' }}>
                    <code>{`{{if (equals user.dept "IT") "Admin Access" "User Access"}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    The <code>if</code> function consumes the boolean result of the <code>equals</code> function.
                </p>
            </section>
        </div>
    );
};

export default DocsBooleans;
