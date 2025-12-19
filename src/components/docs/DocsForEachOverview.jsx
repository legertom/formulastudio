import React from 'react';

const DocsForEachOverview = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>forEach: Overview</h3>
                <p>Iterate over lists to generate multiple results.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section className="docs-section" style={{ marginBottom: 0 }}>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem' }}>

                            {/* 1. Function Signature */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h5 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                    Function Signature
                                </h5>
                                <div className="code-example-block" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                                    <code>{'{{forEach "variable" [list] "logic"}}'}</code>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    The <code>forEach</code> function requires exactly <strong>3 arguments</strong>.
                                </p>
                            </div>

                            {/* 2. Argument Breakdown */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h5 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                    Argument Breakdown
                                </h5>

                                {/* Arg 1 */}
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        color: 'var(--accent-secondary)',
                                        height: 'fit-content',
                                        minWidth: '80px',
                                        textAlign: 'center'
                                    }}>
                                        Arg 1
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Variable Name</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                            A temporary nickname strings (like <code>"s"</code>, <code>"item"</code>, or <code>"x"</code>) that represents the <strong>current item</strong> being processed.
                                            <br />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Must be in quotes (e.g. <code>"s"</code>).</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arg 2 */}
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        color: 'var(--warning)',
                                        height: 'fit-content',
                                        minWidth: '80px',
                                        textAlign: 'center'
                                    }}>
                                        Arg 2
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Source List</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                            The collection of data you want to loop through. This is usually a field from the user's data.
                                            <br />
                                            Common examples: <code>schools</code>, <code>sections</code>, or a manual string like <code>"1 2 3"</code>.
                                        </div>
                                    </div>
                                </div>

                                {/* Arg 3 */}
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        color: 'var(--success)',
                                        height: 'fit-content',
                                        minWidth: '80px',
                                        textAlign: 'center'
                                    }}>
                                        Arg 3
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Logic (Encoded)</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                            The formula to run for <strong>each individual item</strong> in the list.
                                            <br />
                                            <div style={{
                                                marginTop: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                borderLeft: '3px solid var(--error)',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-primary)'
                                            }}>
                                                ⚠️ <strong>Requirement:</strong> This string MUST be URL encoded (e.g. <code>%7B%7B...</code>) to avoid syntax errors.
                                                <br />
                                                Use the <strong>URL Encoder Tool</strong> in the menu to generate this.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Basic Example */}
                            <div>
                                <h5 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                    Basic Example
                                </h5>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Generate a group name for every school in the <code>schools</code> list.
                                </p>
                                <div className="code-example-block" style={{ marginBottom: '1rem' }}>
                                    <code>{'{{forEach "s" schools "%7B%7Bs.name%7D%7D"}}'}</code>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr',
                                    gap: '0.5rem 1rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg-primary)',
                                    padding: '1rem',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>"s"</span>
                                    <span>We are calling the current school "s".</span>

                                    <span style={{ color: 'var(--warning)', fontWeight: 600 }}>schools</span>
                                    <span>Looping through the user's schools list.</span>

                                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Logic</span>
                                    <span>Output <code>s.name</code> (encoded as <code>%7B%7Bs.name%7D%7D</code>).</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocsForEachOverview;
