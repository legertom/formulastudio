export const validateCurriculum = (curriculum) => {
    if (!Array.isArray(curriculum)) {
        throw new Error('Curriculum must be an array.');
    }

    const chapterIds = new Set();
    const stepIds = new Set();

    for (const chapter of curriculum) {
        if (!chapter || typeof chapter.id !== 'string') {
            throw new Error('Every chapter must have a string id.');
        }

        if (chapterIds.has(chapter.id)) {
            throw new Error(`Duplicate chapter id "${chapter.id}" found in curriculum.`);
        }
        chapterIds.add(chapter.id);

        if (!Array.isArray(chapter.steps)) {
            throw new Error(`Chapter "${chapter.id}" must include a steps array.`);
        }

        for (const step of chapter.steps) {
            if (!step || typeof step.id !== 'string') {
                throw new Error(`Chapter "${chapter.id}" has a step without a string id.`);
            }

            if (stepIds.has(step.id)) {
                throw new Error(
                    `Duplicate step id "${step.id}" found in curriculum. Step ids must be globally unique.`
                );
            }
            stepIds.add(step.id);
        }
    }
};
