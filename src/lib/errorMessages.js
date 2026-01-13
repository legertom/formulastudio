/**
 * Friendly Error Messages - Translates technical errors to user-friendly explanations
 */

const errorPatterns = [
    // Unterminated string - very specific match for the parser's error
    {
        pattern: /unterminated string/i,
        icon: '💬',
        title: 'Missing Closing Quote',
        message: 'A string is missing its closing quote mark ( " ).',
        suggestions: [
            'Find the string that\'s missing its ending "',
            'Each piece of text needs quotes on BOTH sides: "text"',
            'Look for: "text here  ← needs a " at the end'
        ]
    },
    // Unknown character - like stray parentheses or other symbols
    {
        pattern: /unknown character/i,
        icon: '🚫',
        title: 'Unexpected Character',
        message: 'Your formula contains a character that isn\'t used in IDM syntax.',
        suggestions: [
            'IDM formulas don\'t use ( ) parentheses',
            'Just use spaces between function name and arguments',
            'Example: concat "A" "B" (not concat("A", "B"))'
        ]
    },
    // Missing closing brackets/parens
    {
        pattern: /unexpected.*end of input|unexpected token.*EOF/i,
        icon: '🔧',
        title: 'Incomplete Formula',
        message: 'Your formula seems to be missing something at the end.',
        suggestions: [
            'Check that all {{ }} brackets are properly closed',
            'Verify all quotes are closed (each " needs a matching ")',
            'Make sure strings look like "text" or "1 2 3"'
        ]
    },
    // Missing closing quote
    {
        pattern: /expected.*\)|unclosed.*\(|missing.*\)/i,
        icon: '🔧',
        title: 'Missing Quote',
        message: 'A string is missing its closing quote mark.',
        suggestions: [
            'Every " needs a matching " at the end',
            'Example: "hello" not "hello',
            'Check the highlighted area in the editor'
        ]
    },
    // Unexpected token
    {
        pattern: /unexpected token ['"]/i,
        icon: '📝',
        title: 'Quote Issue',
        message: 'There seems to be a problem with quotes in your formula.',
        suggestions: [
            'Make sure all text strings have quotes on both sides: "text"',
            'Check for a missing opening or closing quote mark',
            'Example: in list "a b c" (not "a b c or a b c")'
        ]
    },
    // Unexpected comma
    {
        pattern: /unexpected.*,|expected.*got.*,/i,
        icon: '📝',
        title: 'Comma Placement',
        message: 'There\'s an unexpected comma in your formula.',
        suggestions: [
            'IDM syntax uses spaces, not commas, between arguments',
            'Example: concat "A" "B" (not concat "A", "B")',
            'Remove any commas between values'
        ]
    },
    // Unknown function
    {
        pattern: /unknown function|undefined.*is not a function|is not defined/i,
        icon: '❓',
        title: 'Unknown Function',
        message: 'This function name isn\'t recognized.',
        suggestions: [
            'Check the spelling of your function',
            'Use Quick Reference to see available functions',
            'Function names are case-insensitive'
        ]
    },
    // Expected expression
    {
        pattern: /expected expression|expected argument/i,
        icon: '📝',
        title: 'Missing Argument',
        message: 'A function is missing required arguments.',
        suggestions: [
            'Most functions need at least one argument after the name',
            'Example: upper "text" or concat "a" "b"',
            'Use Quick Reference to see what each function needs'
        ]
    },
    // Generic bracket error
    {
        pattern: /expected.*\{|unexpected.*\}/i,
        icon: '🔧',
        title: 'Bracket Issue',
        message: 'There\'s a problem with the {{ }} brackets.',
        suggestions: [
            'Formulas must start with {{ and end with }}',
            'Check for nested brackets - they should be balanced',
            'Make sure you\'re not missing the opening or closing pair'
        ]
    },
    // Position-based errors
    {
        pattern: /at position (\d+)/i,
        icon: '📍',
        title: 'Syntax Error',
        message: 'There\'s a syntax issue in your formula.',
        suggestions: [
            'Look for missing or mismatched quote marks',
            'Check that {{ }} brackets are balanced',
            'Example syntax: functionName argument1 argument2'
        ]
    }
];

// Default fallback
const defaultError = {
    icon: '⚠️',
    title: 'Formula Error',
    message: 'Something isn\'t quite right with your formula.',
    suggestions: [
        'Check that {{ }} brackets are balanced',
        'Make sure all quotes are closed: "text"',
        'Use Quick Reference for function examples'
    ]
};

/**
 * Translate a technical error to a friendly format
 * @param {Error} error - The error object
 * @returns {Object} Friendly error with icon, title, message, suggestions, and original
 */
export function translateError(error) {
    const errorMessage = error?.message || String(error);

    for (const pattern of errorPatterns) {
        if (pattern.pattern.test(errorMessage)) {
            return {
                icon: pattern.icon,
                title: pattern.title,
                message: pattern.message,
                suggestions: pattern.suggestions,
                original: errorMessage
            };
        }
    }

    return {
        ...defaultError,
        original: errorMessage
    };
}

export default translateError;
