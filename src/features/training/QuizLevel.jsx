import React, { useState, useEffect } from 'react';
import { tokenize, parse } from '../../lib/parser';
import SyntaxHighlightedEditor from '../editor/SyntaxHighlightedEditor';
import { renderMarkdownText, evaluateAst } from '../../lib/quizUtils.jsx';
import './QuizLevel.css';


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
                        isCorrect = regex.test(String(computed));
                    } catch (err) {
                        console.error("Invalid regex in test case", err);
                        isCorrect = false;
                    }
                } else {
                    // Loose comparison to allow boolean computed vs string expected
                    isCorrect = String(computed) === String(testCase.expected);
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

                {/* Reference Data - ALWAYS Full Width Top */}
                {hasReferenceData && (
                    <div className="focus-reference-card" style={{ width: '100%', marginBottom: '1rem' }}>
                        <div className="card-header">
                            <span className="icon">🗂️</span>
                            <span>Reference Data (JSON)</span>
                        </div>
                        <pre className="json-content" style={{ maxHeight: '300px', overflow: 'auto' }}>
                            {JSON.stringify(selectedCase.data, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Workbench Area: Implied Grid via CSS 'training-layout-workbench' */}

                {/* Left Col: Editor */}
                <div className="focus-editor-section" style={{ marginTop: 0 }}>
                    <div className="editor-label-row">
                        <label>Formula Editor</label>
                        <div className="live-tag">Live Preview</div>
                    </div>
                    <SyntaxHighlightedEditor
                        value={formula}
                        onChange={(e) => setFormula(e.target.value)}
                        placeholder="{{ ... }}"
                    />
                    {level.hints && level.hints.length > 0 && (
                        <div className="focus-hints" style={{ marginTop: '1rem' }}>
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
                </div>

                {/* Right Col: Results */}
                <div className="focus-results" style={{ marginTop: 0 }}>
                    <div className="editor-label-row results-label-row">
                        <label>Output / Test Results</label>
                    </div>

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
                                        <span className="result-val" style={{ color: result.error ? 'var(--error)' : 'inherit' }}>
                                            {result.error ? String(result.error) : String(result.computed !== "" ? result.computed : '...')}
                                        </span>
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
