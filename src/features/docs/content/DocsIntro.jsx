import React from 'react';

const DocsIntro = () => {
    return (
        <div className="docs-page">
            <div className="docs-intro-hero">
                <h3>Introduction to IDM Formula</h3>
                <p>A powerful logic template system designed to eliminate ambiguity and streamline identity management operations.</p>
            </div>

            <section className="docs-section">
                <div className="docs-card-grid">
                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.5em' }}>📦</span>
                            Encapsulated Logic
                        </h4>
                        <p>
                            All formulas are wrapped in <code>{`{{ ... }}`}</code>, keeping them distinct from surrounding text and ensuring clear boundaries.
                        </p>
                    </div>

                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.5em' }}>🚀</span>
                            Prefix Notation
                        </h4>
                        <p>
                            Functions always appear <em>before</em> their arguments (e.g., <code>equals a b</code>), eliminating the need for complex parentheses.
                        </p>
                    </div>

                    <div className="docs-feature-card">
                        <h4>
                            <span className="viz-icon" style={{ fontSize: '1.5em' }}>🎯</span>
                            Strict Arity
                        </h4>
                        <p>
                            Every function consumes a fixed number of arguments. This predictability makes parsing faster and nesting logic safer.
                        </p>
                    </div>
                </div>
            </section>

            <section className="docs-info-block">
                <h4>Technical Scope</h4>
                <p>
                    For the technically inclined, IDM Formula is a <strong>Domain-Specific Language (DSL)</strong> tailored
                    specifically for Identity Management logic.
                </p>
                <p>
                    It functions as a <strong>purely functional expression language</strong>. There are no variable
                    assignments or mutable state—only nested function calls that evaluate to a final result.
                </p>
                <div className="docs-analogy-box">
                    <div className="docs-analogy-icon">💡</div>
                    <div className="docs-analogy-content">
                        <h5>Analogy</h5>
                        <p>It's conceptually very similar to <strong>Excel formulas</strong>, just with a cleaner, Lisp-like syntax.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DocsIntro;
