/**
 * IDM Formula Parser
 * 
 * Syntax:
 * - Wrapper: {{ ... }}
 * - Functions: if, equals, and, or
 * - Literals: "string"
 * - Identifiers: staff.title, school.name, etc.
 * 
 * AST Nodes:
 * - { type: 'Call', name: 'if'|'equals'|..., args: [...] }
 * - { type: 'String', value: '...' }
 * - { type: 'Identifier', value: '...' }
 */

// Token Types
export const TokenType = {
    OPEN_BRACE: 'OPEN_BRACE',   // {{
    CLOSE_BRACE: 'CLOSE_BRACE', // }}
    KEYWORD: 'KEYWORD',         // if, equals, etc.
    STRING: 'STRING',           // "..."
    NUMBER: 'NUMBER',           // 123, 2025 (bare numbers)
    IDENTIFIER: 'IDENTIFIER',   // staff.title
    UNKNOWN: 'UNKNOWN'
};

const KEYWORDS = new Set([
    'if', 'equals', 'equal', 'and', 'or', 'contains', 'not', 'greater', 'less', 'geq', 'leq', 'concat', 'substr', 'replace', 'length', 'ignoreIfNull', 'forEach', 'in',
    'toUpper', 'toLower', 'initials', 'alphanumeric', 'trimLeft', 'delimiterCapitalize',
    'textBefore', 'textAfter', 'textAfterLast',
    'add', 'subtract', 'formatDate'
]);

/**
 * Tokenizes the input formula string.
 * @param {string} input 
 * @returns {Array<{type: string, value: string, index: number}>}
 */
export function tokenize(input) {
    let current = 0;
    const tokens = [];

    // Heuristic: If we see '{{', assume everything outside is garbage.
    const startBrace = input.indexOf('{{');
    const endBrace = input.lastIndexOf('}}');

    if (startBrace !== -1 && endBrace !== -1 && endBrace > startBrace) {
        // Slice the input to just the formula part, keeping the braces
        // We set current relative to the slice, but we want to track indices?
        // Actually, let's just create a substring. The indices will be relative to substring, 
        // which might be slightly off for the original file, but fine for now.
        // OR: just advance `current` to `startBrace` and stop at `endBrace + 2`.
        current = startBrace;
        // We also want to stop tokenizing after we hit the matching close brace?
        // Actually, let's just rely on the loop. 
        // BUT, we need to ignore the stuff *before* startBrace.
    }

    // Capture the valid range to tokenize
    const endLimit = (startBrace !== -1 && endBrace !== -1) ? endBrace + 2 : input.length;

    while (current < endLimit) {
        let char = input[current];

        // Whitespace
        if (/\s/.test(char)) {
            current++;
            continue;
        }

        // Double Braces {{
        if (char === '{' && input[current + 1] === '{') {
            tokens.push({ type: TokenType.OPEN_BRACE, value: '{{', index: current });
            current += 2;
            continue;
        }

        // Double Braces }}
        if (char === '}' && input[current + 1] === '}') {
            tokens.push({ type: TokenType.CLOSE_BRACE, value: '}}', index: current });
            current += 2;
            continue;
        }

        // Strings "..."
        if (char === '"') {
            let value = '';
            let start = current;
            char = input[++current]; // Skip opening quote

            while (char !== '"' && current < input.length) {
                value += char;
                char = input[++current];
            }

            if (char === '"') {
                current++; // Skip closing quote
                tokens.push({ type: TokenType.STRING, value, index: start });
                continue;
            } else {
                throw new Error(`Unterminated string at index ${start}`);
            }
        }

        // Numbers (bare digits without quotes)
        if (/[0-9]/.test(char)) {
            let value = '';
            let start = current;

            while (/[0-9]/.test(char) && current < input.length) {
                value += char;
                char = input[++current];
            }

            tokens.push({ type: TokenType.NUMBER, value, index: start });
            continue;
        }

        // Identifiers and Keywords
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            let start = current;

            // Allow [a-zA-Z0-9_.-] plus bracket notation like [0], [12] etc.
            while (current < input.length) {
                char = input[current];
                if (/[a-zA-Z0-9_.-]/.test(char)) {
                    value += char;
                    current++;
                } else if (char === '[') {
                    // Start of array index - consume [number]
                    value += char;
                    current++;
                    // Consume digits
                    while (current < input.length && /[0-9]/.test(input[current])) {
                        value += input[current];
                        current++;
                    }
                    // Expect closing bracket
                    if (current < input.length && input[current] === ']') {
                        value += input[current];
                        current++;
                    }
                } else {
                    break;
                }
            }

            const type = KEYWORDS.has(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
            tokens.push({ type, value, index: start });
            continue;
        }

        // Unknown
        throw new Error(`Unknown character '${char}' at index ${current}`);
    }

    return tokens;
}

/**
 * Parses IDM formula tokens into an AST.
 * @param {Array} tokens 
 */
export function parse(tokens) {
    let current = 0;

    // Helper to peek current token
    function peek() {
        return tokens[current];
    }

    // Helper to consume current token
    function advance() {
        if (current < tokens.length) {
            return tokens[current++];
        }
        return tokens[tokens.length - 1]; // EOF equivalent
    }

    // Check if we start with {{
    if (peek().type === TokenType.OPEN_BRACE) {
        advance();

        // Handle empty braces {{}}
        if (peek().type === TokenType.CLOSE_BRACE) {
            advance();
            return null;
        }
    } else {
        // We might allow parsing fragments without {{ }}
    }

    function parseExpression() {
        const token = peek();

        if (!token || token.type === TokenType.CLOSE_BRACE) {
            // Implicit empty string at end of formula for missing arguments
            // We don't have a real token here, so range is ambiguous.
            // Let's use the current token's index if available.
            const idx = token ? token.index : 0;
            return { type: 'StringLiteral', value: '', range: [idx, idx] };
        }

        advance(); // Consume the token we peeked

        if (token.type === TokenType.STRING) {
            // String literal length: value.length + 2 quotes
            const end = token.index + token.value.length + 2;
            return { type: 'StringLiteral', value: token.value, range: [token.index, end] };
        }

        // Bare numbers are treated as string literals (IDM treats numbers as text)
        if (token.type === TokenType.NUMBER) {
            const end = token.index + token.value.length;
            return { type: 'StringLiteral', value: token.value, range: [token.index, end] };
        }

        if (token.type === TokenType.IDENTIFIER) {
            const end = token.index + token.value.length;
            return { type: 'Identifier', value: token.value, range: [token.index, end] };
        }

        if (token.type === TokenType.KEYWORD) {
            const name = token.value;
            let args = [];
            let arity = 0;

            switch (name) {
                case 'if': arity = 3; break;
                case 'equals': arity = 2; break;
                case 'equal': arity = 2; break;
                case 'and': arity = 2; break;
                case 'or': arity = 2; break;
                case 'contains': arity = 2; break;
                case 'not': arity = 1; break;
                case 'greater': arity = 2; break;
                case 'less': arity = 2; break;
                case 'geq': arity = 2; break;
                case 'leq': arity = 2; break;
                case 'concat': arity = 2; break;
                case 'substr': arity = 3; break;
                case 'replace': arity = 3; break;
                case 'length': arity = 1; break;
                case 'ignoreIfNull': arity = 1; break;
                case 'forEach': arity = 3; break;
                case 'in': arity = 2; break;
                case 'toUpper': arity = 1; break;
                case 'toLower': arity = 1; break;
                case 'initials': arity = 1; break;
                case 'alphanumeric': arity = 1; break;
                case 'trimLeft': arity = 1; break;
                case 'delimiterCapitalize': arity = 1; break;
                case 'textBefore': arity = 2; break;
                case 'textAfter': arity = 2; break;
                case 'textAfterLast': arity = 2; break;
                case 'add': arity = 2; break;
                case 'subtract': arity = 2; break;
                case 'formatDate': arity = 2; break;
                default: throw new Error(`Unknown function '${name}'`);
            }

            for (let i = 0; i < arity; i++) {
                args.push(parseExpression());
            }

            // Determine end of function call
            // It ends where the last argument ends.
            // If no arguments (arity 0 - not possible here but theoretically), ends at keyword end.
            const start = token.index;
            let end = start + name.length;

            if (args.length > 0) {
                const lastArg = args[args.length - 1];
                if (lastArg.range) {
                    end = lastArg.range[1];
                }
            }

            return {
                type: 'CallExpression',
                name,
                arguments: args,
                range: [start, end]
            };
        }

        if (token.type === TokenType.CLOSE_BRACE) {
            // Should be handled by the check at top of function
            return { type: 'StringLiteral', value: '', range: [token.index, token.index] };
        }

        throw new Error(`Unexpected token type: ${token.type} value: ${token.value}`);
    }

    const ast = parseExpression();

    // Check for trailing }}
    if (current < tokens.length && tokens[current].type === TokenType.CLOSE_BRACE) {
        advance();
    }

    return ast;
}

/**
 * Converts AST back to IDM formula string.
 * @param {Object} ast 
 * @returns {string}
 */
export function stringify(ast) {
    if (!ast) return '';

    if (ast.type === 'StringLiteral') {
        return `"${ast.value}"`;
    }

    if (ast.type === 'Identifier') {
        return ast.value;
    }

    if (ast.type === 'CallExpression') {
        const args = ast.arguments.map(stringify).join(' ');
        // Wrap top-level in {{ }} if it's the root? 
        // The parser strips {{, so we likely want to add it back only at the very top level.
        // However, this function is recursive. 
        // We'll handle the wrapper outside or assume this returns the inner content.
        // But wait, the inner content is `if ...`.
        // The prefix notation is `func arg1 arg2`.
        // So: `name arg1 arg2 ...`
        return `${ast.name} ${args}`;
    }

    throw new Error(`Unknown AST type: ${ast.type}`);
}

/**
 * Pretty-prints AST to IDM formula string with indentation.
 * @param {Object} ast 
 * @param {number} indentLevel 
 * @returns {string}
 */
export function prettyStringify(ast, indentLevel = 0) {
    if (!ast) return '';
    const indent = '  '.repeat(indentLevel);

    if (ast.type === 'StringLiteral') {
        return `"${ast.value}"`;
    }

    if (ast.type === 'Identifier') {
        return ast.value;
    }

    if (ast.type === 'CallExpression') {
        // Check if any argument is a CallExpression (nested)
        const hasNestedCall = ast.arguments.some(arg => arg.type === 'CallExpression');

        // If it's a simple call (no nested calls), keep it on one line? 
        // Or strictly indent everything?
        // Let's try a hybrid: if arguments are short/simple, one line.
        // Actually, for "if" statements in IDM, they get long fast.
        // Let's force newline if there are nested calls OR if it's an "if" 

        if (hasNestedCall || ast.name === 'if') {
            const args = ast.arguments.map(arg => {
                const argStr = prettyStringify(arg, indentLevel + 1);
                // If the argument itself was multiline, it already has indentation.
                // But we need to make sure we don't double indent the first line?
                // No, prettyStringify returns the string. We need to prepend the newline + indent.
                return `\n${'  '.repeat(indentLevel + 1)}${argStr}`;
            }).join('');

            return `${ast.name}${args}`;
        } else {
            // Simple one-liner: name arg1 arg2
            return `${ast.name} ${ast.arguments.map(a => prettyStringify(a, 0)).join(' ')}`;
        }
    }

    throw new Error(`Unknown AST type: ${ast.type}`);
}
