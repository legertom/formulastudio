import React, { useState, useEffect } from 'react';
import { tokenize, parse } from '../../lib/parser';
import SyntaxHighlightedEditor from '../editor/SyntaxHighlightedEditor';
import { renderMarkdownText, evaluateAst } from '../../lib/quizUtils.jsx';
import CoachMark from '../../components/CoachMark';
import './QuizLevel.css';


const UI_STYLE = 'minimal';
const LAYOUT = 'workbench';

const QuizLevel = ({ level, onComplete, onNext, onPrev, isLastStep, isFirstStep }) => {
    const [formula, setFormula] = useState('');
    const [results, setResults] = useState([]);
    const [visibleHints, setVisibleHints] = useState(0);
    const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerStatus, setAnswerStatus] = useState(null); // null, 'correct', 'incorrect'

    // Initialize/Reset
    useEffect(() => {
        // Use ?? instead of || so empty string prefills work
        setFormula(level.prefill ?? '');
        setResults([]);
        setVisibleHints(0);
        setSelectedCaseIndex(0);
        setSelectedAnswer(null);
        setAnswerStatus(null);
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
                const isExpectedError = testCase.expectedError && e.message.includes(testCase.expectedError);
                return {
                    computed: '',
                    isCorrect: !!isExpectedError,
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

    // ---- RENDER MULTIPLE CHOICE ----
    if (level.type === 'multiple-choice') {
        const handleOptionClick = (option) => {
            setSelectedAnswer(option);
            if (option === level.correctAnswer) {
                setAnswerStatus('correct');
                onComplete();
            } else {
                setAnswerStatus('incorrect');
            }
        };

        const isCorrect = answerStatus === 'correct';

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

                    {/* Reference Data for context */}
                    {level.referenceData && (
                        <div className="focus-reference-card" style={{ width: '100%', marginBottom: '1.5rem' }}>
                            <div className="card-header" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className="icon">🗂️</span>
                                <span>Reference Data (JSON)</span>
                            </div>
                            <pre className="json-content" style={{ maxHeight: '200px', overflow: 'auto' }}>
                                {JSON.stringify(level.referenceData, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Question */}
                    <div className="focus-goal-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="card-label">QUESTION</div>
                        <div className="card-text" style={{ fontSize: '1.1rem' }}>{renderMarkdownText(level.question)}</div>
                    </div>

                    {/* Options */}
                    <div className="mc-options" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        marginBottom: '2rem'
                    }}>
                        {level.options.map((option, idx) => {
                            const letter = String.fromCharCode(65 + idx); // A, B, C, D
                            const isSelected = selectedAnswer === option;
                            const isThisCorrect = option === level.correctAnswer;

                            let bgColor = 'var(--bg-secondary)';
                            let borderColor = 'var(--glass-border)';
                            let textColor = 'var(--text-primary)';

                            if (isSelected) {
                                if (isThisCorrect) {
                                    bgColor = 'rgba(76, 175, 80, 0.15)';
                                    borderColor = 'var(--success)';
                                    textColor = 'var(--success)';
                                } else {
                                    bgColor = 'rgba(244, 67, 54, 0.15)';
                                    borderColor = 'var(--error)';
                                    textColor = 'var(--error)';
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={isCorrect}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem 1.25rem',
                                        background: bgColor,
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '8px',
                                        cursor: isCorrect ? 'default' : 'pointer',
                                        textAlign: 'left',
                                        fontSize: '1rem',
                                        color: textColor,
                                        transition: 'all 0.2s ease',
                                        opacity: isCorrect && !isSelected ? 0.5 : 1
                                    }}
                                >
                                    <span style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: isSelected ? borderColor : 'var(--bg-tertiary)',
                                        color: isSelected ? '#fff' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        flexShrink: 0
                                    }}>
                                        {isSelected && isThisCorrect ? '✓' : letter}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Hints */}
                    {level.hints && level.hints.length > 0 && !isCorrect && (
                        <div className="focus-hints" style={{ marginBottom: '1.5rem' }}>
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

                    {/* Success banner */}
                    {isCorrect && (
                        <div className="success-banner-fixed">
                            <div className="success-icon">🎉</div>
                            <div className="success-message">
                                <strong>Correct!</strong> Great observation.
                            </div>
                        </div>
                    )}

                    <div className="focus-actions">
                        {isCorrect ? (
                            <button className="btn-focus-continue" onClick={onNext}>✓ Continue →</button>
                        ) : (
                            <button className="btn-focus-skip" onClick={onNext}>Skip →</button>
                        )}
                    </div>

                    {level.coachMark && (
                        <CoachMark
                            targetSelector={level.coachMark.target}
                            message={level.coachMark.text}
                            placement={level.coachMark.placement || 'top'}
                        />
                    )}
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
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className="icon">🗂️</span>
                                <span>Reference Data (JSON)</span>
                            </div>
                            {level.testCases.length > 1 && (
                                <div className="ref-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {level.testCases.map((tc, idx) => (
                                        <button
                                            key={idx}
                                            className={`ref-avatar-${idx}`}
                                            onClick={() => setSelectedCaseIndex(idx)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: idx === selectedCaseIndex ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                                background: idx === selectedCaseIndex ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                                color: idx === selectedCaseIndex ? '#fff' : 'var(--text-muted)',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 0,
                                                opacity: idx === selectedCaseIndex ? 1 : 0.6,
                                                transition: 'all 0.2s'
                                            }}
                                            title={`Switch to ${tc.name} data`}
                                        >
                                            {tc.name.charAt(0)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <pre className="json-content" style={{ maxHeight: '300px', overflow: 'auto' }}>
                            {JSON.stringify(selectedCase.data, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Workbench Area: Implied Grid via CSS 'training-layout-workbench' */}

                {/* Left Col: Editor */}
                <div className={`focus-editor-section ${isAllCorrect ? 'success' : ''}`} style={{ marginTop: 0 }}>
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
                        <label>Live Evaluation</label>
                        <div className="results-hint">Click row to switch inputs</div>
                    </div>

                    <div className="focus-validation-list">
                        {level.testCases.map((testCase, idx) => {
                            const result = results[idx] || { computed: '', isCorrect: false };
                            const isSelected = idx === selectedCaseIndex;
                            return (
                                <div
                                    key={idx}
                                    className={`focus-test-item ${result.isCorrect ? 'pass' : 'fail'} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedCaseIndex(idx)}
                                >
                                    <div className="evaluation-row">
                                        <span className="label-tiny">INPUT</span>
                                        <span className="case-name">
                                            {testCase.name} {isSelected && <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', marginLeft: '0.5rem' }}>(VIEWING)</span>}
                                        </span>
                                    </div>
                                    <div className="evaluation-row">
                                        <span className="label-tiny">TARGET</span>
                                        <span className="case-exp">{testCase.expected || '""'}</span>
                                    </div>
                                    <div className="evaluation-row evaluation-actual">
                                        <span className="label-tiny">OUTPUT</span>
                                        <div className="actual-row">
                                            {result.isCorrect ? <span className="icon-check">✓</span> : <span className="icon-cross">×</span>}
                                            <span className="result-val" style={{ color: result.error ? 'var(--error)' : 'inherit' }}>
                                                {result.error ? String(result.error) : String(result.computed !== "" ? result.computed : '...')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Fixed success banner at top of screen */}
                {isAllCorrect && (
                    <div className="success-banner-fixed">
                        <div className="success-icon">🎉</div>
                        <div className="success-message">
                            <strong>Great job!</strong> Your formula is correct.
                        </div>
                    </div>
                )}

                <div className="focus-actions">
                    {isAllCorrect ? (
                        <button className="btn-focus-continue" onClick={onNext}>✓ Continue →</button>
                    ) : (
                        <button className="btn-focus-skip" onClick={onNext}>Skip →</button>
                    )}
                </div>

                {level.coachMark && (
                    <CoachMark
                        targetSelector={level.coachMark.target}
                        message={level.coachMark.text}
                        placement={level.coachMark.placement || 'top'}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizLevel;
