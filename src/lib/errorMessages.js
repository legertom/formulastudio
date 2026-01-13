/**
 * Friendly Error Messages - Translates technical errors to user-friendly explanations
 */

const errorPatterns = [
    // Missing closing brackets/parens
    {
        pattern: /unexpected.*end of input|unexpected token.*EOF/i,
        icon: '🔧',
        title: 'Incomplete Formula',
        message: 'Your formula seems to be missing something at the end.',
        suggestions: [
            'Check that all {{ }} brackets are properly closed',
            'Make sure all parentheses () are balanced',
            'Verify all quotes are closed'
        ]
    },
    // Missing closing parenthesis
    {
        pattern: /expected.*\)|unclosed.*\(|missing.*\)/i,
        icon: '🔧',
        title: 'Missing Parenthesis',
        message: 'A function is missing its closing parenthesis.',
        suggestions: [
            'Every ( needs a matching )',
            'Count your parentheses - they should be equal',
            'Check nested functions for missing closers'
        ]
    },
    // Unexpected token
    {
        pattern: /unexpected token ['"]/i,
        icon: '📝',
        title: 'Quote Issue',
        message: 'There seems to be a problem with quotes in your formula.',
        suggestions: [
            'Make sure all strings are wrapped in matching quotes',
            'Check for unescaped quotes inside strings',
            'Verify commas between function arguments'
        ]
    },
    // Unexpected comma
    {
        pattern: /unexpected.*,|expected.*got.*,/i,
        icon: '📝',
        title: 'Comma Placement',
        message: 'There\'s an unexpected comma in your formula.',
        suggestions: [
            'Commas separate function arguments',
            'Remove any trailing commas before )',
            'Check for double commas'
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
            'Most functions need at least one argument',
            'Check syntax: functionName(arg1, arg2)',
            'Empty parentheses () are usually invalid'
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
            'Look carefully at the characters near the indicated position',
            'Check for missing commas between arguments',
            'Verify function syntax: name(arg1, arg2)'
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
        'Verify function syntax: name(arg1, arg2)',
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
