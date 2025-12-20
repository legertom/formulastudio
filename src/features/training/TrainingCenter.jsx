import React, { useEffect, useState } from 'react';
import { CURRICULUM } from '../../lib/quizData';
import './Training.css';
import QuizLevel from './QuizLevel';

const TRAINING_SIDEBAR_COLLAPSED_KEY = 'fs_training_sidebar_collapsed';

const TrainingCenter = () => {
    // Default to Chapter 1, Step 0
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return window.localStorage.getItem(TRAINING_SIDEBAR_COLLAPSED_KEY) === '1';
        } catch {
            return false;
        }
    });

    // Track completed step IDs (e.g., ["c1-s1", "c1-s2"])
    const [completedSteps, setCompletedSteps] = useState([]);

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

    const activeChapter = CURRICULUM[activeChapterIndex];
    const activeStep = activeChapter.steps[activeStepIndex];

    const handleStepComplete = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId]);
        }
    };

    const jumpTo = (chapterIndex, stepIndex) => {
        setActiveChapterIndex(chapterIndex);
        setActiveStepIndex(stepIndex);
    };

    const handleNext = () => {
        // Is there a next step in this chapter?
        if (activeStepIndex < activeChapter.steps.length - 1) {
            setActiveStepIndex(activeStepIndex + 1);
        } else {
            // Move to next chapter
            if (activeChapterIndex < CURRICULUM.length - 1) {
                setActiveChapterIndex(activeChapterIndex + 1);
                setActiveStepIndex(0);
            }
        }
    };

    const handlePrev = () => {
        if (activeStepIndex > 0) {
            setActiveStepIndex(activeStepIndex - 1);
        } else if (activeChapterIndex > 0) {
            // Go to last step of previous chapter
            const prevChapter = CURRICULUM[activeChapterIndex - 1];
            setActiveChapterIndex(activeChapterIndex - 1);
            setActiveStepIndex(prevChapter.steps.length - 1);
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

                        const totalSteps = chapter.steps.length;
                        const completedInChapter = chapter.steps.filter(s => completedSteps.includes(s.id)).length;
                        const isChapterComplete = completedInChapter === totalSteps;

                        return (
                            <div key={chapter.id} className="chapter-block">
                                <button
                                    type="button"
                                    className={`level-item chapter-item ${isActiveChapter ? 'active' : ''} ${isChapterComplete ? 'completed' : ''}`}
                                    onClick={() => jumpTo(chapterIndex, 0)}
                                    title={chapter.title}
                                    aria-current={isActiveChapter ? 'true' : undefined}
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

                                    {sidebarCollapsed && isActiveChapter && (
                                        <div className="rail-step-indicator" aria-label={`Step ${activeStepIndex + 1}`}>
                                            S{activeStepIndex + 1}
                                        </div>
                                    )}
                                </button>

                                {isActiveChapter && !sidebarCollapsed && (
                                    <div className="step-subnav" aria-label={`${chapter.title} steps`}>
                                        {chapter.steps.map((step, stepIndex) => {
                                            const isActiveStep = stepIndex === activeStepIndex;
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
