import React from 'react';

const DocsNesting = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Nesting Logic</h3>
                <p>How to build complex, multi-condition formulas without parentheses.</p>
            </header>

            <section className="docs-section">
                <h4>What is Nesting?</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                    border: '1px solid var(--warning)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.7 }}>
                        <strong>Nesting</strong> is when you put one function <em>inside</em> another function's argument.
                        This allows you to build complex logic like "if A, then B, else if C, then D, else E" — all in a single formula.
                    </p>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>No Parentheses Needed</h4>
                <p>
                    In Prefix notation, nesting works automatically based on function <strong>arity</strong>
                    (how many arguments each function takes). No parentheses required!
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--error)' }}>❌ Wrong (using parentheses)</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>{`{{if (equals a "b") "c" "d"}}`}</code>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid var(--success)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--success)' }}>✅ Correct (no parentheses)</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>{`{{if equals a "b" "c" "d"}}`}</code>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Understanding Nested Logic Through Color</h4>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                    The <code>if</code> function always takes <strong>exactly 3 arguments</strong>.
                    Let's visualize how the parser identifies each one:
                </p>

                {/* Color-coded formula display */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.05))',
                    border: '2px solid var(--border)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    lineHeight: 2.2,
                    overflow: 'auto'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{'{{if'}</span>

                        {/* ARG 1: CONDITION (Blue) */}
                        <span style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '2px solid rgb(59, 130, 246)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'rgb(147, 197, 253)',
                            fontWeight: 'bold',
                            position: 'relative'
                        }}>
                            equals student.grade "12"
                            <span style={{
                                position: 'absolute',
                                top: '-28px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: 'rgb(59, 130, 246)',
                                whiteSpace: 'nowrap',
                                background: 'var(--bg-primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                            }}>
                                ARG 1: CONDITION
                            </span>
                        </span>

                        {/* ARG 2: TRUE VALUE (Green) */}
                        <span style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '2px solid rgb(16, 185, 129)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'rgb(110, 231, 183)',
                            fontWeight: 'bold',
                            position: 'relative'
                        }}>
                            "Senior"
                            <span style={{
                                position: 'absolute',
                                top: '-28px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: 'rgb(16, 185, 129)',
                                whiteSpace: 'nowrap',
                                background: 'var(--bg-primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                            }}>
                                ARG 2: IF TRUE
                            </span>
                        </span>

                        {/* ARG 3: FALSE VALUE (Orange) */}
                        <span style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '2px solid rgb(245, 158, 11)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: 'rgb(251, 191, 36)',
                            fontWeight: 'bold',
                            position: 'relative'
                        }}>
                            if equals student.grade "11" "Junior" "Other"
                            <span style={{
                                position: 'absolute',
                                top: '-28px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: 'rgb(245, 158, 11)',
                                whiteSpace: 'nowrap',
                                background: 'var(--bg-primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                            }}>
                                ARG 3: IF FALSE
                            </span>
                        </span>

                        <span style={{ color: 'var(--text-secondary)' }}>{'}}'}</span>
                    </div>
                </div>

                {/* Visual Legend */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '2px solid rgb(59, 130, 246)',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: 'rgb(147, 197, 253)',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🔵 Argument 1: Condition
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                            A boolean expression that evaluates to true/false.
                            Here it's a nested <code>equals</code> function.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '2px solid rgb(16, 185, 129)',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: 'rgb(110, 231, 183)',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🟢 Argument 2: True Value
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Returned when condition is <code>true</code>.
                            Can be a literal, variable, or another function.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '2px solid rgb(245, 158, 11)',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: 'rgb(251, 191, 36)',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🟠 Argument 3: False Value
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Returned when condition is <code>false</code>.
                            Here it's a <strong>nested if</strong> — the "else-if" logic!
                        </p>
                    </div>
                </div>

                {/* Execution Flow */}
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '2rem'
                }}>
                    <h5 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                        📊 How It Executes
                    </h5>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        fontSize: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(59, 130, 246)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>1</div>
                            <div>
                                <strong style={{ color: 'rgb(147, 197, 253)' }}>Evaluate the condition</strong><br />
                                Parser evaluates <code>equals student.grade "12"</code> → returns true or false
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(16, 185, 129)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>2</div>
                            <div>
                                <strong style={{ color: 'rgb(110, 231, 183)' }}>If TRUE</strong><br />
                                Return <code>"Senior"</code> and we're done! ✅
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(245, 158, 11)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>3</div>
                            <div>
                                <strong style={{ color: 'rgb(251, 191, 36)' }}>If FALSE</strong><br />
                                Execute the entire nested <code>if</code> statement:<br />
                                <code style={{ fontSize: '0.9rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block' }}>
                                    if equals student.grade "11" "Junior" "Other"
                                </code><br />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'inline-block' }}>
                                    This nested if is evaluated the exact same way, recursively! 🔄
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Insight */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))',
                    border: '2px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginTop: '2rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ fontSize: '2rem' }}>💡</div>
                        <div>
                            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>
                                The Power of Prefix Notation
                            </strong>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>
                                Because each function declares its arity (number of arguments), the parser
                                knows <em>exactly</em> how many tokens to consume. No parentheses, no ambiguity.
                                The third argument of <code>if</code> can be another <code>if</code>, creating
                                unlimited "else-if" chains naturally!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Common Nesting Patterns</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Pattern 1: If-Else Chain */}
                    <div>
                        <h5>If-Else Chain (Multiple Conditions)</h5>
                        <p>Check multiple values, return different results:</p>
                        <div className="code-example-block">
                            <code>{`{{if equals grade "12" "Senior"
  if equals grade "11" "Junior"
  if equals grade "10" "Sophomore"
  if equals grade "09" "Freshman" "Other"}}`}</code>
                        </div>
                    </div>

                    {/* Pattern 2: Compound Condition */}
                    <div>
                        <h5>Compound Conditions (AND / OR)</h5>
                        <p>Combine multiple checks:</p>
                        <div className="code-example-block">
                            <code>{`{{if and equals grade "12" equals status "Active" "Active Senior" "Not Active Senior"}}`}</code>
                        </div>
                        <div className="note" style={{ marginTop: '1rem' }}>
                            <strong>How it reads:</strong> If (grade = 12 AND status = Active), return "Active Senior", else "Not Active Senior"
                        </div>
                    </div>

                    {/* Pattern 3: Nested function in output */}
                    <div>
                        <h5>Nested Functions in Output</h5>
                        <p>Build dynamic output strings:</p>
                        <div className="code-example-block">
                            <code>{`{{if equals grade "12" concat "Senior: " name.first "Underclassman"}}`}</code>
                        </div>
                        <div className="note" style={{ marginTop: '1rem' }}>
                            <strong>Result:</strong> If grade 12, returns "Senior: Jean-Luc", else "Underclassman"
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Tips for Reading Nested Formulas</h4>
                <ul className="docs-list">
                    <li>
                        <strong>Count arguments:</strong> Know how many args each function needs (if=3, equals=2, concat=2, etc.)
                    </li>
                    <li>
                        <strong>Work left to right:</strong> Functions consume arguments in order
                    </li>
                    <li>
                        <strong>Use formatting:</strong> Add line breaks for readability (use the Format button!)
                    </li>
                    <li>
                        <strong>Check the visualizer:</strong> The visual tree shows exactly how your formula is parsed
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default DocsNesting;
