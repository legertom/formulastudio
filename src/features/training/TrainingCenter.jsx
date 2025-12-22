import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CURRICULUM } from '../../lib/curriculum';
import './TrainingLayout.css';
import './TrainingSidebar.css';
import QuizLevel from './QuizLevel';

const TRAINING_SIDEBAR_COLLAPSED_KEY = 'fs_training_sidebar_collapsed';

const TrainingCenter = () => {
    const { chapterIndex, stepIndex } = useParams();
    const navigate = useNavigate();

    // Parse URL params (1-based from URL -> 0-based for internal use)
    const rawChapter = parseInt(chapterIndex, 10);
    const rawStep = parseInt(stepIndex, 10);

    const activeChapterIndex = isNaN(rawChapter) ? -1 : rawChapter - 1;
    const activeStepIndex = isNaN(rawStep) ? -1 : rawStep - 1;

    // Validation
    const isValid = activeChapterIndex >= 0 &&
        activeStepIndex >= 0 &&
        CURRICULUM[activeChapterIndex] &&
        CURRICULUM[activeChapterIndex].steps[activeStepIndex];

    // Redirect if invalid
    useEffect(() => {
        if (!isValid) {
            navigate('/training/1/1', { replace: true });
        }
    }, [isValid, navigate]);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return window.localStorage.getItem(TRAINING_SIDEBAR_COLLAPSED_KEY) === '1';
        } catch {
            return false;
        }
    });

    // Track completed step IDs (e.g., ["c1-s1", "c1-s2"])
    const [completedSteps, setCompletedSteps] = useState([]);

    // Track which chapters are collapsed (by chapter index)
    const [collapsedChapters, setCollapsedChapters] = useState(new Set());

    useEffect(() => {
        try {
            window.localStorage.setItem(
                TRAINING_SIDEBAR_COLLAPSED_KEY,
                sidebarCollapsed ? '1' : '0'
            );
        } catch {
            // Ignore
        }
    }, [sidebarCollapsed]);

    // If invalid, render nothing while redirecting (or render loading)
    if (!isValid) return null;

    const activeChapter = CURRICULUM[activeChapterIndex];
    const activeStep = activeChapter.steps[activeStepIndex];

    const handleStepComplete = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId]);
        }
    };

    const toggleChapterCollapse = (chapterIndex) => {
        setCollapsedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterIndex)) {
                newSet.delete(chapterIndex);
            } else {
                newSet.add(chapterIndex);
            }
            return newSet;
        });
    };

    const jumpTo = (cIdx, sIdx) => {
        navigate(`/training/${cIdx + 1}/${sIdx + 1}`);
    };

    const handleNext = () => {
        // Is there a next step in this chapter?
        if (activeStepIndex < activeChapter.steps.length - 1) {
            navigate(`/training/${activeChapterIndex + 1}/${activeStepIndex + 1 + 1}`);
        } else {
            // Move to next chapter
            if (activeChapterIndex < CURRICULUM.length - 1) {
                navigate(`/training/${activeChapterIndex + 1 + 1}/1`);
            }
        }
    };

    const handlePrev = () => {
        if (activeStepIndex > 0) {
            navigate(`/training/${activeChapterIndex + 1}/${activeStepIndex - 1 + 1}`);
        } else if (activeChapterIndex > 0) {
            // Go to last step of previous chapter
            const prevChapter = CURRICULUM[activeChapterIndex - 1];
            navigate(`/training/${activeChapterIndex - 1 + 1}/${prevChapter.steps.length}`);
        }
    };

    return (
        <div className={`training-workspace ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className={`training-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-header-row">
                        <h2>Curriculum</h2>
                        <button
                            type="button"
                            className="sidebar-toggle"
                            onClick={() => setSidebarCollapsed(prev => !prev)}
                            aria-label={sidebarCollapsed ? 'Expand curriculum sidebar' : 'Collapse curriculum sidebar'}
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {sidebarCollapsed ? '→' : '←'}
                        </button>
                    </div>
                    <span className="progress-text">
                        {completedSteps.length} Steps Completed
                    </span>
                </div>

                <div className="level-list" aria-label="Training curriculum">
                    {CURRICULUM.map((chapter, chapterIndex) => {
                        const isActiveChapter = chapterIndex === activeChapterIndex;
                        const isCollapsed = collapsedChapters.has(chapterIndex);

                        const totalSteps = chapter.steps.length;
                        const completedInChapter = chapter.steps.filter(s => completedSteps.includes(s.id)).length;
                        const isChapterComplete = completedInChapter === totalSteps;

                        return (
                            <div key={chapter.id} className="chapter-block">
                                <button
                                    type="button"
                                    className={`level-item chapter-item ${isActiveChapter ? 'active' : ''} ${isChapterComplete ? 'completed' : ''}`}
                                    onClick={() => toggleChapterCollapse(chapterIndex)}
                                    title={chapter.title}
                                    aria-current={isActiveChapter ? 'true' : undefined}
                                    aria-expanded={!isCollapsed}
                                >
                                    <div className="level-status">
                                        {isChapterComplete ? '✓' : (chapterIndex + 1)}
                                    </div>

                                    {!sidebarCollapsed && (
                                        <div className="level-info">
                                            <span className="level-title">{chapter.title}</span>
                                            <div className="chapter-progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(completedInChapter / totalSteps) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!sidebarCollapsed && (
                                        <div className="chapter-chevron" style={{
                                            marginLeft: 'auto',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            transition: 'color 0.2s ease'
                                        }}>
                                            {isCollapsed ? '▼' : '▲'}
                                        </div>
                                    )}

                                    {sidebarCollapsed && isActiveChapter && (
                                        <div className="rail-step-indicator" aria-label={`Step ${activeStepIndex + 1}`}>
                                            S{activeStepIndex + 1}
                                        </div>
                                    )}
                                </button>

                                {!isCollapsed && !sidebarCollapsed && (
                                    <div className="step-subnav" aria-label={`${chapter.title} steps`}>
                                        {chapter.steps.map((step, stepIndex) => {
                                            const isActiveStep = stepIndex === activeStepIndex && isActiveChapter;
                                            const isStepComplete = completedSteps.includes(step.id);

                                            return (
                                                <button
                                                    key={step.id}
                                                    type="button"
                                                    className={`level-item step-item ${isActiveStep ? 'active' : ''} ${isStepComplete ? 'completed' : ''}`}
                                                    onClick={() => jumpTo(chapterIndex, stepIndex)}
                                                    title={step.title}
                                                    aria-current={isActiveStep ? 'step' : undefined}
                                                >
                                                    <div className="level-status">
                                                        {isStepComplete ? '✓' : (stepIndex + 1)}
                                                    </div>
                                                    <div className="level-info">
                                                        <span className="level-title">{step.title}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="training-main" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="breadcrumbs" style={{ color: 'var(--text-muted)' }}>
                        {activeChapter.title} <span style={{ margin: '0 0.5rem' }}>/</span> Step {activeStepIndex + 1} of {activeChapter.steps.length}
                    </div>
                </div>

                <QuizLevel
                    key={activeStep.id}
                    level={activeStep}
                    onComplete={() => handleStepComplete(activeStep.id)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    isFirstStep={activeStepIndex === 0 && activeChapterIndex === 0}
                    isLastStep={activeStepIndex === activeChapter.steps.length - 1 && activeChapterIndex === CURRICULUM.length - 1}
                />
            </div>
        </div>
    );
};

export default TrainingCenter;
