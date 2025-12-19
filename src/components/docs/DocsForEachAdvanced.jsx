import React from 'react';

const DocsForEachAdvanced = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>forEach: Nested Functions</h3>
                <p>Using other IDM functions <strong>inside</strong> your loop.</p>
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
                            <p style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                                The 3rd argument of <code>forEach</code> can be <strong>any valid IDM formula</strong>.
                                This allows for powerful logic to be applied to every single item in your list.
                            </p>

                            {/* Concept Visualization */}
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.08)',
                                border: '1px solid var(--accent-secondary)',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-secondary)',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase'
                                }}>
                                    Workflow
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                                    <div>1. Write Logic: <span style={{ color: 'var(--success)' }}>{'{{concat s.name " Staff"}}'}</span></div>
                                    <div style={{ textAlign: 'center', margin: '0.25rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>⬇️ ENCODE ⬇️</div>
                                    <div>2. Use in Loop: <span style={{ color: 'var(--warning)' }}>{'{{forEach "s" schools "..."}}'}</span></div>
                                </div>
                            </div>

                            {/* Basic Nesting Example */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h5 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Basic Nesting</h5>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    Add the word "Staff" to the end of every school name.
                                </p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Logic:</div>
                                    <code style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{'{{concat s.name " Staff"}}'}</code>
                                </div>

                                <div className="code-example-block" style={{ marginBottom: '0.75rem' }}>
                                    <code>{'{{forEach "s" schools "%7B%7Bconcat%20s.name%20%22%20Staff%22%7D%7D"}}'}</code>
                                </div>
                            </div>

                            {/* Real World Complex Example */}
                            <div style={{ marginBottom: '1rem' }}>
                                <h5 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Real World Masterclass</h5>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    This real example iterates over <code>sections</code> to create specific "Teacher Group" names based on the grade level, but <strong>only</strong> for "Meadows Elementary".
                                </p>

                                <div style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    fontSize: '0.85rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>The Logic (Before Encoding):</div>
                                    <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                        {`{{if equals school_name "Meadows Elementary"
    concat "Grp - MD Grade "
        if in item.grade "1 2 3 4 5 6"
            concat concat "0" item.grade " Teachers - AG"
        if equals item.grade "Kindergarten"
            "00 Teachers - AG"
}}`}
                                    </pre>
                                </div>

                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    <strong>What is happening?</strong>
                                </p>
                                <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem' }}>
                                    <li>It checks if the school is "Meadows Elementary".</li>
                                    <li>It checks the <code>item.grade</code> (the grade of the section currently being looped).</li>
                                    <li>If the grade is 1-6, it pads it with a "0" (e.g., "01 Teachers - AG").</li>
                                    <li>If it's Kindergarten, it uses "00 Teachers - AG".</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocsForEachAdvanced;
