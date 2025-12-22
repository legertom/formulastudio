import React from 'react';
import {
    TEXT_TRANSFORM_OPS,
    LOGIC_OPS,
    MATH_DATE_OPS,
    UTILITY_OPS,
    TEXT_EXTRACTION_OPS,
    SEARCH_REPLACE_OPS
} from '../data';

const DocsArity = () => {
    // Combine all functions into a single sorted list
    const allFunctions = [
        ...LOGIC_OPS,
        ...TEXT_TRANSFORM_OPS,
        ...MATH_DATE_OPS,
        ...UTILITY_OPS,
        ...TEXT_EXTRACTION_OPS,
        ...SEARCH_REPLACE_OPS
    ].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Arity</h3>
                <p>Understanding how functions consume arguments in Polish notation.</p>
            </header>

            <section className="docs-section">
                <h4>What is Arity?</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05))',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.7 }}>
                        <strong>Arity</strong> is the number of arguments a function expects.
                        In Polish notation, knowing each function's arity is critical because it tells the parser
                        <em> exactly how many tokens to consume</em> after encountering a function name.
                    </p>
                </div>

                <h5>Why Arity Matters</h5>
                <p>
                    Polish notation doesn't use parentheses. Instead, the parser relies on arity to determine
                    where one function's arguments end and the next begins. This makes formulas unambiguous
                    and elegant — but you need to know the arity of each function you use.
                </p>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Common Function Arities</h4>
                <p>Here are the arities for all available functions:</p>

                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>Function</th>
                            <th>Arity</th>
                            <th>Arguments</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allFunctions.map(func => (
                            <tr key={func.name}>
                                <td><code>{func.name}</code></td>
                                <td><strong>{func.arity}</strong></td>
                                <td>{func.args ? func.args.map(a => a.name || a.arg.replace('Arg ', 'arg')).join(', ') : 'args...'}</td>
                                <td>
                                    <code>{func.examples && func.examples[0] ? func.examples[0].code : ''}</code>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <strong>Note:</strong> Most functions have fixed arity and require an exact number of arguments.
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>How the Parser Uses Arity</h4>
                <p>Let's trace through an example to see how arity guides parsing:</p>

                <div className="code-example-block">
                    <code>{`{{if equals student.grade "12" toUpper name.first toLower name.last}}`}</code>
                </div>

                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '1.5rem'
                }}>
                    <h5 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📖 Step-by-Step Parsing</h5>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(139, 92, 246)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>1</div>
                            <div>
                                <strong>Parser encounters <code>if</code></strong><br />
                                Arity = 3 → needs to consume 3 arguments
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(139, 92, 246)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>2</div>
                            <div>
                                <strong>First argument is <code>equals student.grade "12"</code></strong><br />
                                Parser sees <code>equals</code> → Arity = 2 → consumes <code>student.grade</code> and <code>"12"</code><br />
                                <span style={{ color: 'var(--success)' }}>✓ Argument 1 complete</span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(139, 92, 246)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>3</div>
                            <div>
                                <strong>Second argument is <code>toUpper name.first</code></strong><br />
                                Parser sees <code>toUpper</code> → Arity = 1 → consumes <code>name.first</code><br />
                                <span style={{ color: 'var(--success)' }}>✓ Argument 2 complete</span>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <div style={{
                                minWidth: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgb(139, 92, 246)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>4</div>
                            <div>
                                <strong>Third argument is <code>toLower name.last</code></strong><br />
                                Parser sees <code>toLower</code> → Arity = 1 → consumes <code>name.last</code><br />
                                <span style={{ color: 'var(--success)' }}>✓ Argument 3 complete</span>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
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
                            }}>✓</div>
                            <div>
                                <strong>Parsing complete!</strong><br />
                                <code>if</code> received all 3 arguments → formula is valid ✅
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>What Happens with Wrong Arity?</h4>
                <p>If you provide too few or too many arguments, the parser will report an error:</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    {/* Too few arguments */}
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--error)' }}>❌ Too Few Arguments</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>{`{{if equals x "5" "Yes"}}`}</code>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            <code>if</code> needs 3 arguments but only got 2.<br />
                            Missing the <em>falseValue</em>.
                        </p>
                    </div>

                    {/* Too many tokens */}
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <strong style={{ color: 'var(--error)' }}>❌ Extra Tokens</strong>
                        <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                            <code>{`{{toUpper name.first name.last}}`}</code>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            <code>toUpper</code> only takes 1 argument.<br />
                            <code>name.last</code> is left unconsumed.
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--success)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <strong style={{ color: 'var(--success)' }}>✅ Correct Arity</strong>
                    <div className="code-example-block" style={{ marginTop: '0.5rem' }}>
                        <code>{`{{if equals x "5" "Yes" "No"}}`}</code>
                    </div>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                        <code>if</code> receives exactly 3 arguments → parses successfully!
                    </p>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Key Takeaways</h4>
                <ul className="docs-list">
                    <li>
                        <strong>Arity determines consumption:</strong> Each function consumes a specific number of arguments
                    </li>
                    <li>
                        <strong>No parentheses needed:</strong> Arity makes the structure unambiguous
                    </li>
                    <li>
                        <strong>Parsing is left-to-right:</strong> Functions consume arguments in order
                    </li>
                    <li>
                        <strong>Know your arities:</strong> Always check the function reference to know how many arguments are needed
                    </li>
                    <li>
                        <strong>Nesting works recursively:</strong> Nested functions are evaluated with the same arity rules
                    </li>
                </ul>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Practice Exercise</h4>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05))',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                }}>
                    <p style={{ marginTop: 0 }}>
                        <strong>Challenge:</strong> Identify which arguments each function consumes:
                    </p>
                    <div className="code-example-block">
                        <code>{`{{if or equals grade "11" equals grade "12" concat "Senior: " toUpper name.last "Underclassman"}}`}</code>
                    </div>
                    <details style={{ marginTop: '1rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                            Show Answer
                        </summary>
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <ol style={{ margin: 0, lineHeight: 2 }}>
                                <li><code>if</code> (arity 3) needs: condition, trueValue, falseValue</li>
                                <li style={{ marginLeft: '1rem' }}>
                                    Arg 1 (condition): <code>or equals grade "11" equals grade "12"</code>
                                    <ul>
                                        <li><code>or</code> (arity 2+) consumes: <code>equals grade "11"</code> and <code>equals grade "12"</code></li>
                                    </ul>
                                </li>
                                <li style={{ marginLeft: '1rem' }}>
                                    Arg 2 (trueValue): <code>concat "Senior: " toUpper name.last</code>
                                    <ul>
                                        <li><code>concat</code> (arity 2+) consumes: <code>"Senior: "</code> and <code>toUpper name.last</code></li>
                                        <li><code>toUpper</code> (arity 1) consumes: <code>name.last</code></li>
                                    </ul>
                                </li>
                                <li style={{ marginLeft: '1rem' }}>Arg 3 (falseValue): <code>"Underclassman"</code></li>
                            </ol>
                        </div>
                    </details>
                </div>
            </section>
        </div>
    );
};

export default DocsArity;
