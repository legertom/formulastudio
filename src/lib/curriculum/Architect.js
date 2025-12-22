import { conceptGraph } from './KnowledgeGraph.js';

/**
 * The Curriculum Architect
 * 
 * Analyzes gaps between student knowledge and target goals.
 */
export const Architect = {

    /**
     * Analyzes the gap between what a student knows and what they need to know.
     * 
     * @param {string[]} completedConcepts - Array of concept IDs the student has mastered.
     * @param {string} targetConcept - The ID of the concept required for the final exam.
     * @returns {Object} - { path: string[], missing: string[], reinforcement: string[] }
     */
    analyzeGap: (completedConcepts, targetConcept) => {
        const completedSet = new Set(completedConcepts);
        const path = [];
        const visited = new Set();

        // 1. Recursive Dependency Resolution
        const resolve = (conceptId) => {
            if (visited.has(conceptId)) return;
            visited.add(conceptId);

            const concept = conceptGraph[conceptId];
            if (!concept) {
                console.warn(`Architect: Unknown concept '${conceptId}'`);
                return;
            }

            // If already mastered, we don't need to teach it, BUT 
            // we might want to check for reinforcement (staleness).
            if (completedSet.has(conceptId)) {
                return;
            }

            // Resolve dependencies first
            concept.dependencies.forEach(dep => resolve(dep));

            // Add to learning path
            path.push(conceptId);
        };

        resolve(targetConcept);

        // 2. Reinforcement Logic
        // Find concepts that are mastered but haven't been practiced recently?
        // For this prototype, we'll just check if 'len' is in completed but not in the active path,
        // and randomly suggest it if the path is short.
        const reinforcement = [];
        if (completedSet.has('len') && !path.includes('len') && Math.random() > 0.5) {
            reinforcement.push('len');
        }

        return {
            path,
            reinforcement
        };
    },

    /**
     * Generates a step proposal for a concept.
     * This is a stub that would eventually use AI text generation.
     */
    proposeStep: (conceptId, type = 'intro') => {
        const info = conceptGraph[conceptId];
        if (!info) return null;

        return {
            id: `gen-${conceptId}-${Date.now()}`,
            title: type === 'intro' ? `Learn: ${info.title}` : `Practice: ${info.title}`,
            goal: `Master the ${info.title} concept`,
            description: info.description,
            conceptId: conceptId
        };
    }
};
