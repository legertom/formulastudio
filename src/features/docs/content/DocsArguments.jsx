import React from 'react';

const DocsArguments = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Arguments</h3>
                <p>The inputs that functions operate on.</p>
            </header>

            <section className="docs-section">
                <h4>What is an Argument?</h4>
                <p>
                    In programming and mathematics, an "argument" is just a fancy word for an <strong>input</strong>.
                </p>
                <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid var(--accent-secondary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                }}>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>
                        <strong>🤔 Why calling it an "Argument"?</strong><br />
                        The term comes from mathematics and logic. It refers to the "independent variable" that determines the value of a function.
                        You can think of it simply as: <strong>Input provided to a command.</strong>
                    </p>
                </div>
                <p>
                    In IDM Formula's <strong>Prefix Notation</strong>, arguments always effectively "follow" the function name.
                </p>
                <div className="code-example-mini">
                    <code>func input1 input2</code>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Types of Arguments</h4>
                <p>There are three main things you can use as an argument:</p>

                <div className="docs-card-grid">
                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.2em' }}>📝</span>
                            Literals
                        </h4>
                        <p>
                            Fixed, static values that you type directly.
                        </p>
                        <ul className="docs-list" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            <li><strong>Strings:</strong> <code>"admin"</code></li>
                            <li><strong>Numbers:</strong> <code>123</code></li>
                        </ul>
                    </div>

                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.2em' }}>👤</span>
                            Variables
                        </h4>
                        <p>
                            Dynamic data values from the identity system.
                        </p>
                        <ul className="docs-list" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            <li><code>user.department</code></li>
                            <li><code>account.status</code></li>
                        </ul>
                    </div>

                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.2em' }}>🔧</span>
                            Functions
                        </h4>
                        <p>
                            The result of another formula (nested logic).
                        </p>
                        <ul className="docs-list" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            <li><code>toLower ...</code></li>
                            <li><code>add ...</code></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="docs-section">
                <h4>1. Literals</h4>
                <p>
                    Literals are exact values. They never change. You use them when you want to compare against a specific word or use a specific number.
                </p>
                <p>
                    <strong>Strings</strong> must be wrapped in double quotes <code>" "</code>. <br />
                    <strong>Numbers</strong> are written plain, but are treated as text internally.
                </p>
                <div className="code-example-block">
                    <code>{`{{equals user.type "employee"}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Here, <code>"employee"</code> is a string literal argument.
                </p>
            </section>

            <section className="docs-section">
                <h4>2. Variables</h4>
                <p>
                    Variables are placeholders for real data. When the formula runs for a specific user, the variable is replaced by that user's actual data.
                </p>
                <p>
                    They are written plain (no quotes).
                </p>
                <div className="code-example-block">
                    <code>{`{{toUpper user.lastname}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    If the user is "John Smith", <code>user.lastname</code> becomes <code>"Smith"</code>.
                </p>
            </section>

            <section className="docs-section">
                <h4>3. Functions (Nesting)</h4>
                <p>
                    You can use the <em>result</em> of one function as an argument for another. This is called nesting.
                </p>
                <div className="code-example-block">
                    <code>{`{{equals toLower user.department "hr"}}`}</code>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    The result of <code>toLower</code> becomes the first argument for <code>equals</code>.
                </p>
            </section>
            <section className="docs-section">
                <h4>What about Booleans?</h4>
                <p>
                    Arguments can also be <strong>True/False</strong> values (Booleans).
                    Since this is a big topic, we have a specific page for it.
                </p>
                <div className="note" style={{ marginTop: '0.5rem' }}>
                    See <a href="/docs/booleans" style={{ textDecoration: 'underline' }}>Core Concepts: Booleans</a> to understand how Logic flows.
                </div>
            </section>
        </div>
    );
};

export default DocsArguments;
