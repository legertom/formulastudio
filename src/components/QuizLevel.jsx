
import React, { useState, useEffect } from 'react';
import { tokenize, parse } from '../lib/parser';


// Helper to render text with basic markdown (bold **text**, code `text`)
const renderMarkdownText = (text) => {
    if (!text) return null;
    return text.split('`').map((part, j) => {
        if (j % 2 === 1) {
            // Code block
            return <code key={j} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2em 0.4em', borderRadius: '4px', fontFamily: 'monospace' }}>{part}</code>;
        } else {
            // Regular text, check for bold
            return part.split('**').map((subPart, k) => (
                k % 2 === 1 ? <strong key={`${j}-${k}`} style={{ color: 'var(--primary)' }}>{subPart}</strong> : subPart
            ));
        }
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
                case 'len': return String(args[0]).length;
                case 'substr':
                    const str = String(args[0]);
                    const start = parseInt(args[1], 10);
                    const len = parseInt(args[2], 10);
                    return str.substr(start, len);
                case 'replace':
                    return String(args[0]).replaceAll(args[1], args[2]);
                case 'ignoreIfNull':
                    return (args[0] === null || args[0] === undefined) ? "" : args[0];
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


const QuizLevel = ({ level, onComplete, onNext, onPrev, isLastStep, isFirstStep }) => {
    const [formula, setFormula] = useState('{{}}');
    const [results, setResults] = useState([]);
    const [visibleHints, setVisibleHints] = useState(0);
    const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

    // Initialize/Reset
    useEffect(() => {
        // Use ?? instead of || so empty string prefills work
        setFormula(level.prefill ?? '{{}}');
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
                return {
                    computed,
                    isCorrect: computed === testCase.expected,
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
            <div className="quiz-level lesson-mode">
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

    return (
        <div className="quiz-level layout-focus">
            <div className="focus-container">
                <div className="focus-header">
                    <button className="btn-back-simple" onClick={onPrev} disabled={isFirstStep}>← Back</button>
                    <div className="focus-breadcrumbs">{level.title}</div>
                </div>

                <h1 className="focus-title">{level.title}</h1>

                <div className="focus-content">
                    {level.description.split('\n').map((para, i) => (
                        <p key={i} style={{ lineHeight: '1.6' }}>{renderMarkdownText(para)}</p>
                    ))}
                </div>

                <div className="focus-goal-card">
                    <div className="card-label">YOUR GOAL</div>
                    <div className="card-text">{level.goal}</div>
                </div>

                <div className="focus-editor-section">
                    <div className="editor-label-row">
                        <label>Formula Editor</label>
                        <div className="live-tag">Live Preview</div>
                    </div>
                    <div className="editor-wrapper">
                        <textarea
                            className="focus-editor"
                            value={formula}
                            onChange={(e) => setFormula(e.target.value)}
                            spellCheck="false"
                            placeholder="{{ ... }}"
                        />
                    </div>
                </div>

                {level.hints && level.hints.length > 0 && (
                    <div className="focus-hints">
                        {visibleHints < level.hints.length ? (
                            <button className="btn-hint-link" onClick={() => setVisibleHints(prev => prev + 1)}>
                                Need a hint?
                            </button>
                        ) : (
                            level.hints.map((h, i) => <div key={i} className="hint-text">{h}</div>)
                        )}
                    </div>
                )}

                {/* Results / Validation - Always visible in flow */}
                <div className="focus-results">
                    {Object.keys(level.testCases[selectedCaseIndex].data).length > 0 && (
                        <div className="focus-reference-card">
                            <div className="card-header">
                                <span className="icon">🗂️</span>
                                <span>Reference Data (JSON)</span>
                            </div>
                            <pre className="json-content">
                                {JSON.stringify(level.testCases[selectedCaseIndex].data, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="focus-validation-list">
                        {level.testCases.map((testCase, idx) => {
                            const result = results[idx] || { computed: '', isCorrect: false };
                            return (
                                <div key={idx} className={`focus-test-item ${result.isCorrect ? 'pass' : 'fail'}`}>
                                    <div className="item-lhs">
                                        <span className="case-name">{testCase.name}</span>
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
