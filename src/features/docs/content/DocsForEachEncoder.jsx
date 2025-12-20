import React, { useState } from 'react';

const DocsForEachEncoder = () => {
    const [input, setInput] = useState('');
    const [encodedOutput, setEncodedOutput] = useState('');
    const [activeTab, setActiveTab] = useState('encode'); // 'encode' or 'decode'
    const [status, setStatus] = useState('');

    const handleAction = () => {
        try {
            if (activeTab === 'encode') {
                const encoded = encodeURIComponent(input).replace(/'/g, "%27").replace(/"/g, "%22");
                // Native encodeURIComponent doesn't encode everything typical IDM might want strict control over, 
                // but usually it's sufficient. we might want to ensure {{ is clear.
                // Actually, standard encodeURIComponent is usually what user needs, but let's be safe.
                setEncodedOutput(encoded);
                setStatus('Encoded!');
            } else {
                const decoded = decodeURIComponent(input);
                setEncodedOutput(decoded);
                setStatus('Decoded!');
            }
        } catch (e) {
            setEncodedOutput('Error processing text');
            setStatus('Error');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(encodedOutput);
        setStatus('Copied!');
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>URL Encoder / Decoder</h3>
                <p>Utility tool to prepare your logic for the <code>forEach</code> loop.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section className="docs-section" style={{ marginBottom: 0 }}>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1rem 1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                                💡 Why do we need this?
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                The <code>forEach</code> function uses curly braces <code>{'{{ ... }}'}</code> itself. If the inner logic also used curly braces,
                                the system would get confused about where the command starts and ends.
                                <br /><br />
                                By <strong>URL encoding</strong> the inner logic, we turn it into a harmless string of text (like <code>%7B%7B...</code>)
                                that can be safely passed as an argument without breaking the outer loop syntax.
                            </p>
                        </div>
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <button
                                onClick={() => { setActiveTab('encode'); setInput(''); setEncodedOutput(''); setStatus(''); }}
                                style={{
                                    background: activeTab === 'encode' ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === 'encode' ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Encoder
                            </button>
                            <button
                                onClick={() => { setActiveTab('decode'); setInput(''); setEncodedOutput(''); setStatus(''); }}
                                style={{
                                    background: activeTab === 'decode' ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === 'decode' ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Decoder
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <p style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {activeTab === 'encode'
                                    ? "Enter your logic formula below (e.g. {{s.name}}) to convert it into a URL-encoded string suitable for the 3rd argument of forEach."
                                    : "Paste an encoded string (e.g. %7B%7B...) to see what the original logic was."}
                            </p>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    {activeTab === 'encode' ? 'Input Formula' : 'Input Encoded String'}
                                </label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={activeTab === 'encode' ? '{{concat s.name " Staff"}}' : '%7B%7Bconcat%20s.name%20%22%20Staff%22%7D%7D'}
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-mono)',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleAction}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--accent-secondary)',
                                    color: 'var(--accent-secondary)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    marginBottom: '1.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {activeTab === 'encode' ? 'Encode Logic' : 'Decode String'}
                            </button>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Result</label>
                                    {status && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{status}</span>}
                                </div>
                                <div style={{
                                    position: 'relative',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    minHeight: '60px'
                                }}>
                                    <code style={{ wordBreak: 'break-all', color: 'var(--success)' }}>
                                        {encodedOutput || '...'}
                                    </code>
                                    {encodedOutput && (
                                        <button
                                            onClick={copyToClipboard}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '4px',
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            Copy
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocsForEachEncoder;
