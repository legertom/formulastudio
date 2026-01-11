import React from 'react';

// Examples based on QUIZ.md with detailed explanations
const EXAMPLES_DATA = [
    {
        title: "First Name Template",
        goal: "Create a template for the first name.",
        formula: "{{name.first}}",
        explanation: "Simply references the `first` field within the `name` object.",
        sampleData: { "name": { "first": "Jean-O'Luc" } },
        result: "Jean-O'Luc",
        difficulty: "beginner"
    },
    {
        title: "Full Name with Space",
        goal: "Create a template for first name + last name with a space in between.",
        formula: '{{concat name.first concat " " name.last}}',
        explanation: "Uses nested `concat` calls: the inner concat joins the space with the last name, then the outer concat joins the first name with that result.",
        sampleData: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
        result: "Jean-O'Luc Picard",
        difficulty: "beginner"
    },
    {
        title: "ID Generation",
        goal: "Create a template for first initial + last name + graduation year with no spaces.",
        formula: "{{substr name.first 0 1}}{{name.last}}{{student.graduation_year}}",
        explanation: "`substr` extracts the first character (index 0, length 1) of the first name. The rest are direct field references concatenated together.",
        sampleData: { "name": { "first": "Jean-O'Luc", "last": "Picard" }, "student": { "graduation_year": "2030" } },
        result: "JPicard2030",
        difficulty: "beginner"
    },
    {
        title: "Hyphen Replacement",
        goal: "Replace hyphens with spaces in a first name.",
        formula: '{{replace name.first "-" " "}}',
        explanation: "The `replace` function takes 3 arguments: source, target, replacement. It finds all hyphens and replaces them with spaces.",
        sampleData: { "name": { "first": "Jean-O'Luc" } },
        result: "Jean O'Luc",
        difficulty: "beginner"
    },
    {
        title: "Length Conditional",
        goal: "Output 'Long name' if the length of a first name is greater than 5, otherwise 'Short name'.",
        formula: '{{if greater len name.first 5 "Long name" "Short name"}}',
        explanation: "Nested functions: `len` gets the character count, `greater` compares to 5, `if` returns the appropriate string based on the comparison.",
        sampleData: { "name": { "first": "Jean-O'Luc" } },
        result: "Long name",
        difficulty: "intermediate"
    },
    {
        title: "Secret ID Check",
        goal: "Output 'secret' if a user's id is 'secret-id', otherwise 'not so secret'.",
        formula: '{{if equals id "secret-id" "secret" "not so secret"}}',
        explanation: "Simple equality check using `equals` inside an `if` statement.",
        sampleData: { "id": "12345" },
        result: "not so secret",
        difficulty: "beginner"
    },
    {
        title: "Graduation Status (Nested If)",
        goal: "Output 'New Student' if graduation year is 2037, 'Former Student' if 2025, otherwise 'Current Student'.",
        formula: '{{if equals student.graduation_year "2037" "New Student" if equals student.graduation_year "2025" "Former Student" "Current Student"}}',
        explanation: "Demonstrates nested `if` statements in Polish notation. The false branch of the first `if` contains another complete `if` statement.",
        sampleData: { "student": { "graduation_year": "2030" } },
        result: "Current Student",
        difficulty: "intermediate"
    },
    {
        title: "Middle Name Handling",
        goal: "Output the middle name if it exists, otherwise output nothing.",
        formula: "{{ignoreIfNull name.middle}}",
        explanation: "`ignoreIfNull` safely returns the value if it exists, or an empty string if it's null/undefined. This prevents 'Traffic Errors' from missing data.",
        sampleData: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
        result: "(empty string)",
        difficulty: "intermediate"
    },
    {
        title: "Middle Name with Fallback",
        goal: "Output the middle name if it exists, otherwise output 'No Middle Name'.",
        formula: '{{if ignoreIfNull name.middle ignoreIfNull name.middle "No Middle Name"}}',
        explanation: "Uses `ignoreIfNull` in both the condition and the true branch to safely handle potentially missing data. The condition evaluates to false for empty strings.",
        sampleData: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
        result: "No Middle Name",
        difficulty: "advanced"
    },
    {
        title: "Full Name with Optional Middle",
        goal: "Append first, middle (if exists), and last name with spaces.",
        formula: '{{concat name.first concat " " concat if ignoreIfNull name.middle concat ignoreIfNull name.middle " " "" name.last}}',
        explanation: "Complex nested concat chain that builds: First + space + (Middle + space IF exists ELSE empty) + Last. Demonstrates advanced function composition.",
        sampleData: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
        result: "Jean-O'Luc Picard",
        difficulty: "advanced"
    }
];

const DocsExamples = () => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#f59e0b';
            case 'advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Examples & Recipes</h3>
                <p>Practical formula examples from simple to complex. Each example includes sample data, expected output, and a detailed explanation.</p>
            </header>

            <section className="docs-section">
                <h4>Reference Data</h4>
                <p>Many examples below use this sample JSON data:</p>
                <div className="code-example-block" style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {`{
  "name": {
    "first": "Jean-O'Luc",
    "last": "Picard",
    "middle": null
  },
  "student": {
    "graduation_year": "2030"
  },
  "id": "12345"
}`}
                    </pre>
                </div>
            </section>

            <hr className="docs-divider" />

            {EXAMPLES_DATA.map((example, idx) => (
                <section key={idx} className="docs-section" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{idx + 1}. {example.title}</h4>
                        <span style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '999px',
                            background: getDifficultyColor(example.difficulty) + '20',
                            color: getDifficultyColor(example.difficulty),
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {example.difficulty}
                        </span>
                    </div>
                    <p><strong>Goal:</strong> {example.goal}</p>

                    <div className="code-example-block">
                        <code>{example.formula}</code>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        margin: '1rem 0',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Result</span>
                            <div style={{ fontWeight: '600', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                                {example.result}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderLeft: '3px solid var(--accent-primary)',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        <strong>Explanation:</strong> {example.explanation}
                    </div>

                    {idx < EXAMPLES_DATA.length - 1 && <hr className="docs-divider" style={{ marginTop: '2rem' }} />}
                </section>
            ))}
        </div>
    );
};

export default DocsExamples;
