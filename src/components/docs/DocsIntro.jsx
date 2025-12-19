import React from 'react';

const DocsIntro = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Introduction to IDM Formula</h3>
                <p>A powerful logic template system for identity management operations.</p>
            </header>

            <section className="docs-section">
                <h4>What is it?</h4>
                <p>
                    IDM Formula combines the familiar double-curly-brace syntax of Handlebars <code>{`{{ ... }}`}</code> with a functional,
                    <strong>Prefix (Polish) Notation</strong> logic system.
                </p>
                <p>
                    This approach allows for complex, nested logic without the ambiguity of parentheses or order-of-operations issues common in other systems.
                </p>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Core Rules</h4>
                <ul className="docs-list">
                    <li>
                        <strong>Wrapper:</strong> All formulas must be wrapped in double curly braces: <code>{`{{ ... }}`}</code>.
                    </li>
                    <li>
                        <strong>No Parentheses:</strong> The syntax does <strong>not</strong> support parentheses <code>()</code> for grouping or nesting.
                        Nesting is handled by the strict argument count of each function.
                    </li>
                    <li>
                        <strong>Prefix Notation:</strong> Functions appear <em>before</em> their arguments.
                        <div className="code-example-mini" style={{ marginTop: '0.5rem' }}>
                            <code>equals a b</code> <span className="comment">// Is 'a' equal to 'b'?</span>
                        </div>
                    </li>
                    <li>
                        <strong>Strict Argument Consumption:</strong> Functions consume a fixed number of arguments (arity).
                        If an argument is itself a function call, the parser evaluates it first (recursively) before passing the result to the parent function.
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default DocsIntro;
