/**
 * Example Loader
 * 
 * Uses Vite's import.meta.glob to load all markdown files in src/examples.
 */

// Import raw content of all .md files in the examples directory
const exampleFiles = import.meta.glob('../examples/*.md', { query: '?raw', eager: true });

/**
 * Extracts the formula from a markdown string.
 * Assumes the formula is everything between the first {{ and the last }}.
 * 
 * @param {string} content 
 * @returns {string}
 */
function extractFormula(content) {
  const startMatch = content.indexOf('{{');
  const endMatch = content.lastIndexOf('}}');

  if (startMatch !== -1 && endMatch !== -1 && endMatch > startMatch) {
    return content.substring(startMatch, endMatch + 2);
  }

  return '';
}

/**
 * Returns an array of available examples with their names and raw formulas.
 * 
 * @returns {Array<{name: string, formula: string}>}
 */
export function getExamples() {
  return Object.entries(exampleFiles).map(([path, module]) => {
    // Extract name from path (e.g., ../examples/1.md -> 1)
    const name = path.split('/').pop().replace('.md', '');
    const content = module.default || module;
    const formula = extractFormula(content);

    // Infer type based on formula content
    // If it starts with {{forEach (ignoring whitespace), it's Group Logic
    const cleanFormula = formula.replace(/\s/g, '');
    const type = cleanFormula.startsWith('{{forEach') ? 'GROUP' : 'OU';

    return { name, formula, type };
  });
}
