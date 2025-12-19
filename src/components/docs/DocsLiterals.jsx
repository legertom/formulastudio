import React from 'react';

const DocsLiterals = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Literals</h3>
                <p>Fixed values that never change — text, numbers, and constants.</p>
            </header>

            <section className="docs-section">
                <h4>What is a Literal?</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    border: '1px solid var(--success)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.7 }}>
                        A <strong>literal</strong> is a <em>fixed, hardcoded value</em> that you type directly into your formula.
                        Unlike variables (which change per user), literals are constants — they're always exactly what you typed.
                    </p>
                </div>

                <h5>Real-World Analogy</h5>
                <p>
                    In a sentence like <em>"Welcome to Springfield Elementary"</em>, "Springfield Elementary" is a literal —
                    it's the exact text you want to appear, not a placeholder for something else.
                </p>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Types of Literals</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* String Literals */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h5 style={{ marginTop: 0, color: 'var(--success)' }}>📝 String Literals</h5>
                        <p>Text values wrapped in <strong>double quotes</strong>.</p>

                        <table className="docs-table">
                            <thead>
                                <tr>
                                    <th>Example</th>
                                    <th>Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>"Hello World"</code></td>
                                    <td>A greeting message</td>
                                </tr>
                                <tr>
                                    <td><code>"Senior"</code></td>
                                    <td>Grade level label</td>
                                </tr>
                                <tr>
                                    <td><code>"@students.edu"</code></td>
                                    <td>Email domain suffix</td>
                                </tr>
                                <tr>
                                    <td><code>" "</code></td>
                                    <td>A single space character</td>
                                </tr>
                                <tr>
                                    <td><code>""</code></td>
                                    <td>Empty string (nothing)</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="note" style={{ marginTop: '1rem' }}>
                            <strong>Important:</strong> Always use straight double quotes <code>"</code>, not curly/smart quotes <code>" "</code>.
                        </div>
                    </div>

                    {/* Number Literals */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '1.5rem'
                    }}>
                        <h5 style={{ marginTop: 0, color: 'var(--accent-secondary)' }}>🔢 Number Literals</h5>
                        <p>Numeric values used in comparisons and math operations.</p>

                        <table className="docs-table">
                            <thead>
                                <tr>
                                    <th>Example</th>
                                    <th>Use Case</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>"12"</code></td>
                                    <td>Checking if grade is 12</td>
                                </tr>
                                <tr>
                                    <td><code>"2030"</code></td>
                                    <td>Comparing graduation year</td>
                                </tr>
                                <tr>
                                    <td><code>"09"</code></td>
                                    <td>Grade level (with leading zero)</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="note" style={{ marginTop: '1rem' }}>
                            <strong>Note:</strong> In IDM formulas, numbers are typically treated as strings.
                            Use quotes for consistency: <code>"12"</code> not <code>12</code>.
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>When to Use Literals</h4>

                <ul className="docs-list">
                    <li>
                        <strong>Comparison values:</strong> Checking if a field equals a specific value<br />
                        <code>{`{{if equals student.grade "12" "Senior" "Other"}}`}</code>
                    </li>
                    <li>
                        <strong>Output text:</strong> The text you want to return from your formula<br />
                        <code>{`{{if equals student.status "Active" "✓ Active Student" "Inactive"}}`}</code>
                    </li>
                    <li>
                        <strong>Separators & formatting:</strong> Spaces, dashes, prefixes<br />
                        <code>{`{{concat name.first " " name.last}}`}</code>
                    </li>
                    <li>
                        <strong>Default/fallback values:</strong> What to return when data is missing<br />
                        <code>{`{{if name.middle name.middle "No Middle Name"}}`}</code>
                    </li>
                </ul>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Literals vs Variables: Quick Reference</h4>

                <table className="docs-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Literal</th>
                            <th>Variable</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Value</strong></td>
                            <td>Fixed, hardcoded</td>
                            <td>Dynamic, changes per user</td>
                        </tr>
                        <tr>
                            <td><strong>Quotes</strong></td>
                            <td>Surrounded by <code>" "</code></td>
                            <td>No quotes</td>
                        </tr>
                        <tr>
                            <td><strong>Example</strong></td>
                            <td><code>"Admin"</code></td>
                            <td><code>user.role</code></td>
                        </tr>
                        <tr>
                            <td><strong>Source</strong></td>
                            <td>You type it</td>
                            <td>SIS data</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default DocsLiterals;
