import React, { useState } from 'react';

const OPERATIONS_DATA = [
    {
        category: "Text Transformation",
        description: "Basic operations to change casing or extract parts of a string.",
        ops: [
            {
                name: "toLower",
                syntax: "{{toLower [field]}}",
                desc: "Converts text to lowercase.",
                example: {
                    code: "{{toLower name.first}}",
                    result: '"JOHN" → "john"',
                    translation: "Takes the First Name and converts all letters to lowercase."
                }
            },
            {
                name: "toUpper",
                syntax: "{{toUpper [field]}}",
                desc: "Converts text to uppercase.",
                example: {
                    code: "{{toUpper name.last}}",
                    result: '"Doe" → "DOE"',
                    translation: "Takes the Last Name and converts all letters to uppercase."
                }
            },
            {
                name: "substr",
                syntax: "{{substr [field] start end}}",
                desc: "Extracts a portion of text.",
                example: {
                    code: "{{substr student.sis_id 0 3}}",
                    result: '"123456" → "123"',
                    translation: "Starts at character 0 and extracts 3 characters from the SIS ID."
                }
            },
            {
                name: "alphanumeric",
                syntax: "{{alphanumeric [field]}}",
                desc: "Removes non-alphanumeric characters.",
                example: {
                    code: "{{alphanumeric name.last}}",
                    result: '"O\'Connor" → "OConnor"',
                    translation: "Removes any symbols (like apostrophes) so only letters and numbers remain."
                }
            },
            {
                name: "initials",
                syntax: "{{initials [field]}}",
                desc: "Extracts the first letter of each word.",
                example: {
                    code: "{{initials name.first}}",
                    result: '"Jean-Luc" → "JL"',
                    translation: "Takes the initials from the First Name, handling hyphens or spaces."
                }
            },
            {
                name: "trimLeft",
                syntax: "{{trimLeft [field]}}",
                desc: "Removes leading whitespace.",
                example: {
                    code: '{{trimLeft "  data"}}',
                    result: '"  data" → "data"',
                    translation: "Removes any empty spaces from the beginning of the text."
                }
            }
        ]
    },
    {
        category: "Text Extraction",
        description: "Functions to pull specific parts of a string based on delimiters.",
        ops: [
            {
                name: "textBefore",
                syntax: '{{textBefore [field] "char"}}',
                desc: "Extracts text before a specific character.",
                example: {
                    code: '{{textBefore student.email "@"}}',
                    result: '"jdoe123@school.edu" → "jdoe123"',
                    translation: "Extracts the username portion of an email address by taking everything before the '@' symbol."
                }
            },
            {
                name: "textAfter",
                syntax: '{{textAfter [field] "char"}}',
                desc: "Extracts text after a specific character.",
                example: {
                    code: '{{textAfter student.email "@"}}',
                    result: '"jdoe123@school.edu" → "school.edu"',
                    translation: "Extracts the domain portion of an email address by taking everything after the '@' symbol."
                }
            },
            {
                name: "textAfterLast",
                syntax: '{{textAfterLast [field] "char"}}',
                desc: "Extracts text after the LAST occurrence of a character.",
                example: {
                    code: '{{textAfterLast email "."}}',
                    result: '"user@school.edu" → "edu"',
                    translation: "Finds the last '.' in the email and keeps the text after it (the domain extension)."
                }
            }
        ]
    },
    {
        category: "Search & Replace",
        description: "Find and modify specific content within a field.",
        ops: [
            {
                name: "replace",
                syntax: '{{replace [field] "find" "replace"}}',
                desc: "Replaces all occurrences of a string.",
                example: {
                    code: '{{replace student.phone "-" ""}}',
                    result: '"555-0199" → "5550199"',
                    translation: "Removes hyphens from a phone number by replacing them with nothing (empty text)."
                }
            }
        ]
    },
    {
        category: "Math & Dates",
        description: "Perform calculations or reformat dates.",
        ops: [
            {
                name: "add",
                syntax: "{{add [field] val}}",
                desc: "Adds a number to a field.",
                example: {
                    code: "{{add student.grade 1}}",
                    result: '"10" → "11"',
                    translation: "Takes the student's grade and adds 1 to it."
                }
            },
            {
                name: "subtract",
                syntax: "{{subtract [field] val}}",
                desc: "Subtracts a number from a field.",
                example: {
                    code: "{{subtract student.grad_year 1}}",
                    result: '"2024" → "2023"',
                    translation: "Takes the graduation year and subtracts 1 from it."
                }
            },
            {
                name: "formatDate",
                syntax: '{{formatDate [field] "format"}}',
                desc: "Changes the date format.",
                example: {
                    code: '{{formatDate student.dob "MM/DD/YYYY"}}',
                    result: '"2010-05-20" → "05/20/2010"',
                    translation: "Takes the Date of Birth and formats it as Month/Day/Year."
                }
            }
        ]
    },
    {
        category: "Logic & Comparison",
        description: "Operators for conditional logic and booleans.",
        ops: [
            {
                name: "if",
                syntax: '{{if condition "true" "false"}}',
                desc: "Returns one value if true, another if false.",
                example: {
                    code: '{{if equals student.grade "12" "Senior" "Underclassman"}}',
                    result: "If Grade is 12, returns 'Senior'. If 09, returns 'Underclassman'.",
                    translation: "Checks if the student's grade is exactly '12'. If it is, the formula outputs 'Senior'; otherwise, it outputs 'Underclassman'."
                }
            },
            {
                name: "equals",
                syntax: "{{equals val1 val2}}",
                desc: "Checks if two values are identical.",
                example: {
                    code: '{{equals student.grade "12"}}',
                    result: "True or False",
                    translation: "Compares the student's grade to the number 12."
                }
            },
            {
                name: "greater",
                syntax: "{{greater val1 val2}}",
                desc: "Checks if val1 > val2.",
                example: {
                    code: '{{greater student.grade "08"}}',
                    result: "True if grade is 9-12",
                    translation: "Checks if the grade is strictly higher than 08."
                }
            },
            {
                name: "less",
                syntax: "{{less val1 val2}}",
                desc: "Checks if val1 < val2.",
                example: {
                    code: '{{less student.grade "09"}}',
                    result: "True if grade is K-8",
                    translation: "Checks if the grade is strictly lower than 09."
                }
            },
            {
                name: "geq",
                syntax: "{{geq val1 val2}}",
                desc: "Greater than or equal to.",
                example: {
                    code: '{{if geq student.grade "09" "High School" "Middle School"}}',
                    result: "If grade is 09+, returns 'High School'",
                    translation: "Checks if the grade is 09 or higher (Greater Than or Equal To)."
                }
            },
            {
                name: "leq",
                syntax: "{{leq val1 val2}}",
                desc: "Less than or equal to.",
                example: {
                    code: '{{if leq student.grade "05" "Elementary" "Secondary"}}',
                    result: "If grade is 05 or lower, returns 'Elementary'",
                    translation: "Checks if the grade is 05 or lower (Less Than or Equal To)."
                }
            },
            {
                name: "contains",
                syntax: "{{contains str sub}}",
                desc: "Checks if a string contains a substring.",
                example: {
                    code: '{{contains email "@student"}}',
                    result: "True if email has '@student'",
                    translation: "Looks inside the email address to see if it includes the text '@student'."
                }
            },
            {
                name: "in",
                syntax: '{{in val "item1 item2"}}',
                desc: "Checks if a value is in a list.",
                example: {
                    code: '{{in student.grade "09 10 11 12"}}',
                    result: "True if grade is one of the HS grades",
                    translation: "Checks if the student's grade matches ANY of the grades in the list."
                }
            },
            {
                name: "not",
                syntax: "{{not val}}",
                desc: "Inverts a boolean (True becomes False).",
                example: {
                    code: '{{not equals student.grade "12"}}',
                    result: "True if grade is NOT 12",
                    translation: "Flips the result. If 'equals' is true, 'not' makes it false."
                }
            },
            {
                name: "and",
                syntax: "{{and val1 val2}}",
                desc: "True only if BOTH are true.",
                example: {
                    code: '{{and (equals grade "12") (equals status "Active")}}',
                    result: "True only for Active Seniors",
                    translation: "Checks that Condition A AND Condition B are both met."
                }
            },
            {
                name: "or",
                syntax: "{{or val1 val2}}",
                desc: "True if AT LEAST ONE is true.",
                example: {
                    code: '{{or (equals grade "11") (equals grade "12")}}',
                    result: "True for Juniors or Seniors",
                    translation: "Checks if either Condition A OR Condition B is met."
                }
            }
        ]
    },
    {
        category: "Utilities",
        description: "Combine fields or handle empty data.",
        ops: [
            {
                name: "concat",
                syntax: "{{concat val1 val2}}",
                desc: "Joins two strings together.",
                example: {
                    code: "{{concat name.first name.last}}",
                    result: '"John" + "Doe" → "JohnDoe"',
                    translation: "Smashes the First Name and Last Name together into one word."
                }
            },
            {
                name: "ignoreIfNull",
                syntax: "{{ignoreIfNull [field]}}",
                desc: "Skips the field if it has no data.",
                example: {
                    code: '{{concat name.first " " (ignoreIfNull name.middle) " " name.last}}',
                    result: '"John" + "" + "Doe" → "John  Doe" (cleans up spaces)',
                    translation: "Useful when building full names where a middle name might not exist. Prevents the formula from breaking or adding 'null' text."
                }
            }
        ]
    }
];

const DocsOperations = () => {
    // State to track expanded examples: { "category-opName": boolean }
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Common Operations</h3>
                <p>Functions to transform and manipulate text data.</p>
            </header>

            {OPERATIONS_DATA.map((section, idx) => (
                <section key={idx} className="docs-section">
                    <h4>{section.category}</h4>
                    <p>{section.description}</p>
                    <table className="docs-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Operation</th>
                                <th style={{ width: '35%' }}>Usage</th>
                                <th style={{ width: '45%' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {section.ops.map((op, opIdx) => {
                                const id = `${idx}-${op.name}`;
                                const isExpanded = expanded[id];

                                return (
                                    <React.Fragment key={opIdx}>
                                        <tr className={isExpanded ? "op-row-expanded" : ""}>
                                            <td>
                                                <strong>{op.name}</strong>
                                            </td>
                                            <td>
                                                <code className="op-syntax">{op.syntax}</code>
                                            </td>
                                            <td>
                                                <div style={{ marginBottom: '0.5rem' }}>{op.desc}</div>
                                                <button
                                                    className={`btn-show-example ${isExpanded ? 'active' : ''}`}
                                                    onClick={() => toggleExpand(id)}
                                                >
                                                    {isExpanded ? 'Hide Example' : 'Show Example'}
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="example-row">
                                                <td colSpan="3">
                                                    <div className="example-details">
                                                        <div className="example-grid">
                                                            <div className="example-item">
                                                                <span className="example-label">Code:</span>
                                                                <code>{op.example.code}</code>
                                                            </div>
                                                            <div className="example-item">
                                                                <span className="example-label">Result:</span>
                                                                <span className="result-value">{op.example.result}</span>
                                                            </div>
                                                        </div>
                                                        <div className="example-translation">
                                                            <span className="viz-icon">💡</span>
                                                            <span className="translation-text">
                                                                <strong>Plain English:</strong> {op.example.translation}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
};

export default DocsOperations;
