import React, { useState } from 'react';
import {
    TEXT_TRANSFORM_OPS,
    TEXT_EXTRACTION_OPS,
    SEARCH_REPLACE_OPS,
    MATH_DATE_OPS,
    LOGIC_OPS,
    UTILITY_OPS
} from '../data';

const OPERATIONS_DATA = [
    {
        category: "Text Transformation",
        description: "Basic operations to change casing or extract parts of a string.",
        ops: TEXT_TRANSFORM_OPS
    },
    {
        category: "Text Extraction",
        description: "Functions to pull specific parts of a string based on delimiters.",
        ops: TEXT_EXTRACTION_OPS
    },
    {
        category: "Search & Replace",
        description: "Find and modify specific content within a field.",
        ops: SEARCH_REPLACE_OPS
    },
    {
        category: "Math & Dates",
        description: "Perform calculations or reformat dates.",
        ops: MATH_DATE_OPS
    },
    {
        category: "Logic & Comparison",
        description: "Operators for conditional logic and booleans.",
        ops: LOGIC_OPS
    },
    {
        category: "Utilities",
        description: "Combine fields or handle empty data.",
        ops: UTILITY_OPS
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
                                // Use the first example (Basic) for the quick reference
                                const example = op.examples ? op.examples[0] : null;

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
                                                {example && (
                                                    <button
                                                        className={`btn-show-example ${isExpanded ? 'active' : ''}`}
                                                        onClick={() => toggleExpand(id)}
                                                    >
                                                        {isExpanded ? 'Hide Example' : 'Show Example'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && example && (
                                            <tr className="example-row">
                                                <td colSpan="3">
                                                    <div className="example-details">
                                                        <div className="example-grid">
                                                            <div className="example-item">
                                                                <span className="example-label">Code:</span>
                                                                <code>{example.code}</code>
                                                            </div>
                                                            <div className="example-item">
                                                                <span className="example-label">Result:</span>
                                                                <span className="result-value">{example.result}</span>
                                                            </div>
                                                        </div>
                                                        {(example.humanEnglish || example.translation) && (
                                                            <div className="example-translation">
                                                                <span className="viz-icon">💡</span>
                                                                <span className="translation-text">
                                                                    <strong>Plain English:</strong> {example.humanEnglish || example.translation}
                                                                </span>
                                                            </div>
                                                        )}
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
