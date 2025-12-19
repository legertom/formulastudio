import React, { useState } from 'react';
import { CURRICULUM } from '../lib/quizData';
import QuizLevel from './QuizLevel';

const TrainingCenter = () => {
    // Default to Chapter 1, Step 0
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    // Track completed step IDs (e.g., ["c1-s1", "c1-s2"])
    const [completedSteps, setCompletedSteps] = useState([]);

    const activeChapter = CURRICULUM[activeChapterIndex];
    const activeStep = activeChapter.steps[activeStepIndex];

    const handleStepComplete = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId]);
        }
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

    // Check if the overall chapter is locked (previous chapter not finished)
    // Simple logic: Chapter N is locked if Chapter N-1's last step is not complete.
    const isChapterLocked = (index) => {
        if (index === 0) return false;
        const prevChapter = CURRICULUM[index - 1];
        const lastStepId = prevChapter.steps[prevChapter.steps.length - 1].id;
        return !completedSteps.includes(lastStepId);
    };

    return (
        <div className="training-workspace">
            <div className="training-sidebar">
                <div className="sidebar-header">
                    <h2>Curriculum</h2>
                    <span className="progress-text">
                        {completedSteps.length} Steps Completed
                    </span>
                </div>
                <div className="level-list">
                    {CURRICULUM.map((chapter, index) => {
                        const isLocked = isChapterLocked(index);
                        const isActive = index === activeChapterIndex;
                        // Calculate chapter progress
                        const totalSteps = chapter.steps.length;
                        const completedInChapter = chapter.steps.filter(s => completedSteps.includes(s.id)).length;
                        const isChapterComplete = completedInChapter === totalSteps;

                        return (
                            <button
                                key={chapter.id}
                                className={`level-item chapter-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={() => !isLocked && setActiveChapterIndex(index)}
                                disabled={isLocked}
                            >
                                <div className="level-status">
                                    {isChapterComplete ? '✓' : (index + 1)}
                                </div>
                                <div className="level-info">
                                    <span className="level-title">{chapter.title}</span>
                                    <div className="chapter-progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(completedInChapter / totalSteps) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="training-main" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="breadcrumbs" style={{ color: 'var(--text-muted)' }}>
                        {activeChapter.title} <span style={{ margin: '0 0.5rem' }}>/</span> Step {activeStepIndex + 1} of {activeChapter.steps.length}
                    </div>
                </div>

                <QuizLevel
                    key={activeStep.id}
                    level={activeStep} // Rename prop to generic 'level' or 'step'
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
