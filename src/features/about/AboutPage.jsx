import React from 'react';
import '../docs/Docs.css';

const AboutPage = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>About Formula Studio</h3>
                <p>IDM formula tooling for builders, operators, and AI agents.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <section className="docs-section" style={{ marginBottom: 0 }}>
                    <h4>What this product does</h4>
                    <ul>
                        <li>Parse, format, and validate IDM formulas.</li>
                        <li>Compile structured JSON/CSV group rules into IDM formulas.</li>
                        <li>Run formula tests against sample data for pass/fail verification.</li>
                        <li>Provide API endpoints designed for both humans and AI agents.</li>
                    </ul>
                </section>

                <section className="docs-section" style={{ marginBottom: 0 }}>
                    <h4>Links</h4>
                    <ul>
                        <li>
                            API instructions (humans + robots):{' '}
                            <a href="https://formulastudio.net/api/instructions" target="_blank" rel="noreferrer">
                                formulastudio.net/api/instructions
                            </a>
                        </li>
                        <li>
                            Developer docs: <a href="/docs/intro">/docs/intro</a>
                        </li>
                        <li>
                            IDM machine spec:{' '}
                            <a href="https://formulastudio.net/api/idm-spec" target="_blank" rel="noreferrer">
                                formulastudio.net/api/idm-spec
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
