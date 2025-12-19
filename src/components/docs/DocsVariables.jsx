import React from 'react';

const DocsVariables = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Variables</h3>
                <p>How to access dynamic data from your SIS records.</p>
            </header>

            <section className="docs-section">
                <h4>What is a Variable?</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05))',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.7 }}>
                        A <strong>variable</strong> is a placeholder that represents <em>dynamic data</em> that changes for each user.
                        Instead of typing a student's actual name, you use a variable like <code>name.first</code> which gets replaced
                        with the real value (e.g., "Jean-Luc") when the formula runs.
                    </p>
                </div>

                <h5>Real-World Analogy</h5>
                <p>
                    Think of a mail merge template: <em>"Dear [First Name]"</em>. The <code>[First Name]</code> is a variable —
                    it's a placeholder that gets replaced with actual data for each person receiving the mail.
                </p>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Variable Syntax</h4>
                <p>Variables use <strong>dot notation</strong> to access nested fields in your SIS data:</p>

                <div className="code-example-block">
                    <code>object.field</code>
                </div>

                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>Variable</th>
                            <th>What it accesses</th>
                            <th>Example Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>name.first</code></td>
                            <td>The user's first name</td>
                            <td>"Jean-Luc"</td>
                        </tr>
                        <tr>
                            <td><code>name.last</code></td>
                            <td>The user's last name</td>
                            <td>"Picard"</td>
                        </tr>
                        <tr>
                            <td><code>student.grade</code></td>
                            <td>The student's grade level</td>
                            <td>"09"</td>
                        </tr>
                        <tr>
                            <td><code>student.graduation_year</code></td>
                            <td>Expected graduation year</td>
                            <td>"2030"</td>
                        </tr>
                        <tr>
                            <td><code>student.sis_id</code></td>
                            <td>Unique SIS identifier</td>
                            <td>"123456"</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Variables vs Literals</h4>
                <p>The key difference:</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid var(--accent-secondary)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--accent-secondary)' }}>Variable (Dynamic)</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>name.first</code>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            → Different for each user<br />
                            → No quotes<br />
                            → Reads from SIS data
                        </p>
                    </div>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid var(--success)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--success)' }}>Literal (Static)</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>"John"</code>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            → Always the same value<br />
                            → Surrounded by quotes<br />
                            → Hardcoded text
                        </p>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Common Mistake</h4>
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--error)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                }}>
                    <strong style={{ color: 'var(--error)' }}>❌ Don't put quotes around variables</strong>
                    <div className="code-example-block" style={{ marginTop: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <code>{`{{if equals "name.first" "John" "Match" "No Match"}}`}</code>
                    </div>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                        This compares the literal text "name.first" (not the actual first name) to "John".
                    </p>
                </div>

                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--success)',
                    borderRadius: '8px',
                    padding: '1rem'
                }}>
                    <strong style={{ color: 'var(--success)' }}>✅ Variables should not have quotes</strong>
                    <div className="code-example-block" style={{ marginTop: '0.5rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                        <code>{`{{if equals name.first "John" "Match" "No Match"}}`}</code>
                    </div>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                        This correctly compares the user's actual first name to "John".
                    </p>
                </div>
            </section>
        </div>
    );
};

export default DocsVariables;
