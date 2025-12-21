
import React, { useState, useEffect } from 'react';
import { tokenize, parse } from '../../lib/parser';
import SyntaxHighlightedEditor from './SyntaxHighlightedEditor';


// Helper to render text with basic markdown (bold **text**, code `text`)
// plus a tiny amount of "IDM-ish" token highlighting for {{ and }}.
const renderMarkdownText = (text) => {
    if (!text) return null;

    const renderInlineTokens = (segment) => {
        if (typeof segment !== 'string' || segment.length === 0) return segment;
        return segment.split(/(\{\{|\}\})/g).map((piece, i) => {
            if (piece === '{{' || piece === '}}') {
                return <code key={i}>{piece}</code>;
            }
            return piece;
        });
    };

    // Helper for inline markdown (bold/code)
    const renderInlineMarkdown = (inlineText, baseKey) => {
        return inlineText.split('`').map((part, j) => {
            if (j % 2 === 1) {
                return <code key={`${baseKey}-${j}`}>{part}</code>;
            }
            return part.split('**').map((subPart, k) => {
                if (k % 2 === 1) {
                    return (
                        <strong key={`${baseKey}-${j}-${k}`} style={{ color: 'var(--primary)' }}>
                            {renderInlineTokens(subPart)}
                        </strong>
                    );
                }
                return <React.Fragment key={`${baseKey}-${j}-${k}`}>{renderInlineTokens(subPart)}</React.Fragment>;
            });
        });
    };

    // Helper to render a markdown table (matches docs diagram style)
    const renderTable = (tableText, tableKey) => {
        const lines = tableText.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return null;

        const parseRow = (row) => row.split('|').map(cell => cell.trim()).filter(cell => cell);
        const headerCells = parseRow(lines[0]);
        const bodyRows = lines.slice(2).map(parseRow); // Skip header and separator

        return (
            <table key={tableKey} style={{
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                margin: '1rem 0'
            }}>
                <thead>
                    <tr>
                        <td style={{
                            padding: '0.25rem 0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem'
                        }}>{headerCells[0]}:</td>
                        {headerCells.slice(1).map((cell, idx) => (
                            <td key={idx} style={{
                                padding: '0.25rem 0.75rem',
                                textAlign: 'center',
                                color: 'var(--accent-secondary)',
                                fontWeight: 600
                            }}>{cell}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bodyRows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            <td style={{
                                padding: '0.25rem 0.5rem',
                                color: 'var(--text-muted)',
                                fontSize: '0.7rem'
                            }}>{row[0]}:</td>
                            {row.slice(1).map((cell, cellIdx) => (
                                <td key={cellIdx} style={{
                                    padding: '0.5rem 0.75rem',
                                    textAlign: 'center',
                                    background: 'var(--bg-tertiary)',
                                    border: '1px solid var(--glass-border)',
                                    fontWeight: 600
                                }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Check if text contains a markdown table
    const isMarkdownTable = (text) => {
        const lines = text.trim().split('\n');
        return lines.length >= 2 && lines[1].match(/^\|?[\s-:|]+\|?$/);
    };

    // 1. Split by triple backticks for code blocks
    return text.split('```').map((block, i) => {
        if (i % 2 === 1) {
            // CODE BLOCK
            return (
                <pre key={`block-${i}`} style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    border: '1px solid var(--glass-border)',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    color: 'var(--text-secondary)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    margin: '1.5rem 0'
                }}>
                    {block.trim()}
                </pre>
            );
        }

        // TEXT BLOCK:
        // 1. Trim leading/trailing whitespace from the block (removes the newlines that border the code block)
        // 2. Split by double-newlines to find distinct paragraphs
        const cleanBlock = block.trim();
        if (!cleanBlock) return null;

        return cleanBlock.split(/\n\s*\n/).map((para, paraIdx) => {
            // Check if this paragraph is a table
            if (isMarkdownTable(para)) {
                return renderTable(para, `table-${i}-${paraIdx}`);
            }
            return (
                <p key={`text-${i}-${paraIdx}`} style={{ lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                    {renderInlineMarkdown(para, `inline-${i}-${paraIdx}`)}
                </p>
            );
        });
    });
};

// Helper to evaluate AST against data (Simplified)
const evaluateAst = (ast, data) => {
    if (!ast) return "";

    // Recursive evaluator
    const evalNode = (node) => {
        if (!node) return "";

        if (node.type === 'CallExpression') {
            const args = node.arguments.map(evalNode);
            switch (node.name) {
                case 'concat': return args.join('');
                case 'if': return args[0] ? args[1] : args[2];
                case 'equals': return args[0] === args[1];
                case 'greater': return Number(args[0]) > Number(args[1]);
                case 'len': return String(String(args[0]).length);
                case 'substr':
                    const str = String(args[0]);
                    const start = parseInt(args[1], 10);
                    const len = parseInt(args[2], 10);
                    return str.substr(start, len);
                case 'replace':
                    return String(args[0]).replaceAll(args[1], args[2]);
                case 'ignoreIfNull':
                    return (args[0] === null || args[0] === undefined) ? "" : args[0];

                // New String Functions
                case 'toUpper': return String(args[0]).toUpperCase();
                case 'toLower': return String(args[0]).toLowerCase();
                case 'trimLeft': return String(args[0]).trimStart();
                case 'alphanumeric': return String(args[0]).replace(/[^a-z0-9]/gi, '');
                case 'initials':
                    return String(args[0]).split(/[\s-]+/).map(w => w[0] || '').join('').toUpperCase();
                case 'delimiterCapitalize':
                    return String(args[0]).replace(/(?:^|[\s-])\w/g, (match) => match.toUpperCase());

                // Text Extraction
                case 'textBefore': {
                    const s = String(args[0]);
                    const idx = s.indexOf(args[1]);
                    return idx === -1 ? s : s.substring(0, idx);
                }
                case 'textAfter': {
                    const s = String(args[0]);
                    const idx = s.indexOf(args[1]);
                    return idx === -1 ? s : s.substring(idx + String(args[1]).length);
                }
                case 'textAfterLast': {
                    const s = String(args[0]);
                    const idx = s.lastIndexOf(args[1]);
                    return idx === -1 ? s : s.substring(idx + String(args[1]).length);
                }

                // Math/Date
                case 'add': return String(Number(args[0]) + Number(args[1]));
                case 'subtract': return String(Number(args[0]) - Number(args[1]));
                case 'formatDate': {
                    const date = new Date(args[0]);
                    if (isNaN(date.getTime())) return args[0]; // Invalid date fallback
                    const format = args[1];
                    // Very basic formatter
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    return format
                        .replace('YYYY', yyyy)
                        .replace('MM', mm)
                        .replace('DD', dd);
                }
                // Logic
                case 'and': return args[0] && args[1];
                case 'or': return args[0] || args[1];
                case 'not': return !args[0];
                case 'contains': return String(args[0]).includes(args[1]);
                case 'in': return String(args[1]).split(' ').includes(String(args[0]));
                default: return "";
            }
        }

        if (node.type === 'Identifier') {
            return node.value.split('.').reduce((obj, key) => obj?.[key], data) ?? "";
        }

        if (node.type === 'StringLiteral') {
            return node.value;
        }

        if (Array.isArray(node)) {
            return node.map(evalNode).join('');
        }

        return "";
    };

    if (Array.isArray(ast)) {
        return ast.map(evalNode).join('');
    }
    return evalNode(ast);
};


const UI_STYLE = 'minimal';
const LAYOUT = 'workbench';

const QuizLevel = ({ level, onComplete, onNext, onPrev, isLastStep, isFirstStep }) => {
    const [formula, setFormula] = useState('');
    const [results, setResults] = useState([]);
    const [visibleHints, setVisibleHints] = useState(0);
    const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

    // Initialize/Reset
    useEffect(() => {
        // Use ?? instead of || so empty string prefills work
        setFormula(level.prefill ?? '');
        setResults([]);
        setVisibleHints(0);
        setSelectedCaseIndex(0);
    }, [level]);

    // Challenge Logic
    useEffect(() => {
        if (level.type !== 'challenge') return;

        if (!formula.trim()) {
            setResults(level.testCases.map(() => ({ computed: '', isCorrect: false, error: null })));
            return;
        }

        const newResults = level.testCases.map(testCase => {
            try {
                const tokens = tokenize(formula);
                const ast = parse(tokens);
                const computed = evaluateAst(ast, testCase.data);

                let isCorrect = false;
                if (testCase.matchRegex) {
                    try {
                        const regex = new RegExp(testCase.matchRegex);
                        isCorrect = regex.test(computed);
                    } catch (err) {
                        console.error("Invalid regex in test case", err);
                        isCorrect = false;
                    }
                } else {
                    isCorrect = computed === testCase.expected;
                }

                return {
                    computed,
                    isCorrect,
                    error: null
                };
            } catch (e) {
                return {
                    computed: '',
                    isCorrect: false,
                    error: e.message
                };
            }
        });

        setResults(newResults);

        const allCorrect = newResults.every(r => r.isCorrect);
        if (allCorrect) {
            onComplete();
        }
    }, [formula, level]);

    // ---- RENDER LESSON ----
    if (level.type === 'lesson') {
        return (
            <div className={`quiz-level lesson-mode training-style-${UI_STYLE} training-layout-${LAYOUT}`}>
                <div className="quiz-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="nav-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            className="btn-secondary"
                            onClick={onPrev}
                            disabled={isFirstStep}
                            style={{ opacity: isFirstStep ? 0.5 : 1, padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                        >
                            ← Back
                        </button>
                    </div>
                    <h2>{level.title}</h2>
                    <div className="lesson-content" style={{ fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '800px', marginBottom: '2rem' }}>
                        {level.content.split('\n').map((para, i) => (
                            <p key={i} style={{ marginBottom: '1rem' }}>
                                {renderMarkdownText(para)}
                            </p>
                        ))}
                    </div>

                    {level.example && (
                        <div className="example-block" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', maxWidth: '600px' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>EXAMPLE</h4>
                            <div style={{ marginBottom: '0.5rem' }}><strong>Formula:</strong> <code style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{level.example.formula}</code></div>
                            <div><strong>Result:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--success)' }}>{level.example.result}</span></div>
                        </div>
                    )}
                </div>

                <div className="lesson-actions" style={{ marginTop: '3rem' }}>
                    <button className="btn-next" style={{ width: 'auto', padding: '0.8rem 2rem', fontSize: '1.1rem' }} onClick={() => {
                        onComplete();
                        onNext();
                    }}>
                        Continue →
                    </button>
                </div>
            </div>
        );
    }

    // ---- RENDER CHALLENGE (FOCUS FLOW - GLOBAL) ----
    const isAllCorrect = results.length > 0 && results.every(r => r.isCorrect);

    const selectedCase = level.testCases?.[selectedCaseIndex];
    const hasReferenceData = Boolean(
        selectedCase &&
        selectedCase.data &&
        typeof selectedCase.data === 'object' &&
        Object.keys(selectedCase.data).length > 0
    );

    const referenceDataPlacement = level.referenceDataPlacement || 'side';

    return (
        <div className={`quiz-level layout-focus training-style-${UI_STYLE} training-layout-${LAYOUT}`}>
            <div className="focus-container">
                <div className="focus-header">
                    <button className="btn-back-simple" onClick={onPrev} disabled={isFirstStep}>← Back</button>
                    <div className="focus-breadcrumbs">{level.title}</div>
                </div>

                <h1 className="focus-title">{level.title}</h1>

                <div className="focus-content">
                    {renderMarkdownText(level.description)}
                </div>

                <div className="focus-goal-card">
                    <div className="card-label">YOUR GOAL</div>
                    <div className="card-text">{renderMarkdownText(level.goal)}</div>
                </div>

                {hasReferenceData && referenceDataPlacement === 'top' && (
                    <div className="focus-reference-card">
                        <div className="card-header">
                            <span className="icon">🗂️</span>
                            <span>Reference Data (JSON)</span>
                        </div>
                        <pre className="json-content">
                            {JSON.stringify(selectedCase.data, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="focus-editor-section">
                    <div className="editor-label-row">
                        <label>Formula Editor</label>
                        <div className="live-tag">Live Preview</div>
                    </div>
                    <SyntaxHighlightedEditor
                        value={formula}
                        onChange={(e) => setFormula(e.target.value)}
                        placeholder="{{ ... }}"
                    />
                </div>

                {level.hints && level.hints.length > 0 && (
                    <div className="focus-hints">
                        {level.hints.slice(0, visibleHints).map((h, i) => (
                            <div key={i} className="hint-text" style={{ marginBottom: '0.5rem' }}>
                                {renderMarkdownText(h)}
                            </div>
                        ))}

                        {visibleHints < level.hints.length && (
                            <button className="btn-hint-link" onClick={() => setVisibleHints(prev => prev + 1)}>
                                {visibleHints === 0 ? "Need a hint?" : "Show next hint"}
                            </button>
                        )}
                    </div>
                )}

                {/* Results / Validation - Always visible in flow */}
                <div className="focus-results">
                    {LAYOUT === 'workbench' && (
                        <div className="editor-label-row results-label-row">
                            <label>Output</label>
                        </div>
                    )}

                    {hasReferenceData && referenceDataPlacement !== 'top' && (
                        <div className="focus-reference-card">
                            <div className="card-header">
                                <span className="icon">🗂️</span>
                                <span>Reference Data (JSON)</span>
                            </div>
                            <pre className="json-content">
                                {JSON.stringify(selectedCase.data, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="focus-validation-list">
                        <div style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 0.5rem'
                        }}>
                            <span>Test Results</span>
                            <span style={{ opacity: 0.7 }}>Click row to view details</span>
                        </div>
                        {level.testCases.map((testCase, idx) => {
                            const result = results[idx] || { computed: '', isCorrect: false };
                            const isSelected = idx === selectedCaseIndex;
                            return (
                                <div
                                    key={idx}
                                    className={`focus-test-item ${result.isCorrect ? 'pass' : 'fail'} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedCaseIndex(idx)}
                                >
                                    <div className="item-lhs">
                                        <span className="case-name">{testCase.name} {isSelected && <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', marginLeft: '0.5rem' }}>(VIEWING)</span>}</span>
                                        <span className="case-exp">Expects: {testCase.expected || '""'}</span>
                                    </div>
                                    <div className="item-rhs">
                                        {result.isCorrect ? <span className="icon-check">✓</span> : <span className="icon-cross">×</span>}
                                        <span className="result-val">{String(result.computed || '...')}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="focus-actions">
                    {isAllCorrect ? (
                        <button className="btn-focus-continue" onClick={onNext}>Continue →</button>
                    ) : (
                        <button className="btn-focus-skip" onClick={onNext}>Skip Step</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizLevel;
