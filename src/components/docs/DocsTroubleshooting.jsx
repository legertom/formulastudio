import React from 'react';

const TROUBLESHOOTING_DATA = [
    {
        title: "Traffic Errors (Missing Data)",
        symptoms: [
            "Formula fails in production but works in testing",
            "Error messages about null or undefined values",
            "Intermittent failures on some records"
        ],
        cause: "Accessing a field that doesn't exist for some users. For example, not all users have a middle name.",
        solution: 'Use `ignoreIfNull` to safely handle potentially missing data.',
        badCode: '{{name.middle}}',
        goodCode: '{{ignoreIfNull name.middle}}',
        explanation: "When a field is null or undefined, directly accessing it causes a 'Traffic Error'. The `ignoreIfNull` function returns an empty string instead of throwing an error."
    },
    {
        title: "Unbalanced Braces",
        symptoms: [
            "Syntax error in the editor",
            "Formula doesn't parse at all",
            "Red error highlighting"
        ],
        cause: "Missing opening `{{` or closing `}}` braces.",
        solution: "Ensure every formula starts with `{{` and ends with `}}`.",
        badCode: 'if equals name.first "John" "Hello" "World"}}',
        goodCode: '{{if equals name.first "John" "Hello" "World"}}',
        explanation: "IDM formulas must always be wrapped in double curly braces. The editor's syntax highlighting will help identify missing braces."
    },
    {
        title: "Wrong Argument Count",
        symptoms: [
            "Unexpected output",
            "Arguments being consumed by wrong function",
            "Logic not working as expected"
        ],
        cause: "Providing too few or too many arguments to a function. Each function has a fixed arity (argument count).",
        solution: "Check the documentation for each function's required argument count.",
        badCode: '{{if equals name.first "John" "Hello"}}',
        goodCode: '{{if equals name.first "John" "Hello" "World"}}',
        explanation: "The `if` function requires exactly 3 arguments: condition, true_value, false_value. Missing the false_value will cause parsing errors or unexpected behavior."
    },
    {
        title: "Nested If Confusion",
        symptoms: [
            "Wrong branch being taken",
            "Unexpected string outputs",
            "Conditions evaluating incorrectly"
        ],
        cause: "Improper nesting of if statements in Polish notation.",
        solution: "Remember that nested if statements go in the false branch position (3rd argument).",
        badCode: '{{if equals a "1" "One" {{if equals a "2" "Two" "Other"}}}}',
        goodCode: '{{if equals a "1" "One" if equals a "2" "Two" "Other"}}',
        explanation: "In Polish notation, you don't use extra braces for nesting. The parser knows to consume the entire `if equals a \"2\" \"Two\" \"Other\"` as the third argument."
    },
    {
        title: "String vs Variable Confusion",
        symptoms: [
            "Literal text appearing instead of data",
            "Field reference not resolving",
            "Comparing to wrong value"
        ],
        cause: "Forgetting quotes around string literals or adding quotes around variable names.",
        solution: 'Variables use dot notation without quotes. Strings use double quotes.',
        badCode: '{{if equals "student.grade" "12" "Senior" "Other"}}',
        goodCode: '{{if equals student.grade "12" "Senior" "Other"}}',
        explanation: "`student.grade` without quotes refers to the actual data field. `\"student.grade\"` in quotes is just the literal text string."
    },
    {
        title: "Comparison Type Issues",
        symptoms: [
            "`greater` and `less` not working as expected",
            "Numbers comparing as strings",
            "\"9\" appearing greater than \"10\""
        ],
        cause: "String comparison instead of numeric comparison. \"9\" > \"10\" alphabetically.",
        solution: "Be aware that comparisons may be string-based. Use consistent formatting (leading zeros if needed).",
        badCode: '{{if greater student.grade "10" "Upper" "Lower"}}',
        goodCode: '{{if greater student.grade "09" "Upper" "Lower"}}',
        explanation: "When grades are stored as strings, \"9\" may compare differently than expected. Using \"09\" format ensures consistent string comparison behavior."
    }
];

const DocsTroubleshooting = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Troubleshooting</h3>
                <p>Common issues and how to fix them. If your formula isn't working as expected, check these common problems first.</p>
            </header>

            {TROUBLESHOOTING_DATA.map((issue, idx) => (
                <section key={idx} className="docs-section" style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '1.5rem',
                            height: '1.5rem',
                            background: 'var(--accent-secondary)',
                            borderRadius: '50%',
                            fontSize: '0.8rem',
                            marginRight: '0.5rem',
                            color: 'white'
                        }}>
                            {idx + 1}
                        </span>
                        {issue.title}
                    </h4>

                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <strong style={{ color: '#ef4444' }}>⚠️ Symptoms:</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                            {issue.symptoms.map((symptom, sIdx) => (
                                <li key={sIdx} style={{ marginBottom: '0.25rem' }}>{symptom}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Cause:</strong> {issue.cause}
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <strong style={{ color: '#10b981' }}>✅ Solution:</strong> {issue.solution}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#ef4444',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                            }}>
                                ❌ Incorrect
                            </div>
                            <div className="code-example-block" style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderColor: '#ef4444'
                            }}>
                                <code>{issue.badCode}</code>
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#10b981',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                            }}>
                                ✅ Correct
                            </div>
                            <div className="code-example-block" style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderColor: '#10b981'
                            }}>
                                <code>{issue.goodCode}</code>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderLeft: '3px solid var(--accent-primary)',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <strong>💡 Explanation:</strong> {issue.explanation}
                    </div>

                    {idx < TROUBLESHOOTING_DATA.length - 1 && <hr className="docs-divider" style={{ marginTop: '2rem' }} />}
                </section>
            ))}
        </div>
    );
};

export default DocsTroubleshooting;
