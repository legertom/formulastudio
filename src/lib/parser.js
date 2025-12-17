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
    IDENTIFIER: 'IDENTIFIER',   // staff.title
    UNKNOWN: 'UNKNOWN'
};

const KEYWORDS = new Set(['if', 'equals', 'and', 'or', 'contains']); // Added contains just in case

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

        // Identifiers and Keywords
        if (/[a-zA-Z0-9_.-]/.test(char)) {
            let value = '';
            let start = current;

            while (/[a-zA-Z0-9_.-]/.test(char) && current < input.length) {
                value += char;
                char = input[++current];
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
    } else {
        // We might allow parsing fragments without {{ }}
    }

    function parseExpression() {
        const token = advance();

        if (token.type === TokenType.STRING) {
            return { type: 'StringLiteral', value: token.value };
        }

        if (token.type === TokenType.IDENTIFIER) {
            return { type: 'Identifier', value: token.value };
        }

        if (token.type === TokenType.KEYWORD) {
            const name = token.value;
            let args = [];
            let arity = 0;

            switch (name) {
                case 'if': arity = 3; break;
                case 'equals': arity = 2; break;
                case 'and': arity = 2; break;
                case 'or': arity = 2; break; // Binary OR. 'or or A B C' is nested: or(or(A, B), C) ? No, 'or A B' is standard.
                // Wait, the formula has 'or or or A B C D'.
                // Polish notation: 'or A B' is one expr.
                // 'or or A B C' -> 'or (or A B) C'
                // So standard arity 2 works if it's strictly binary prefix.
                case 'contains': arity = 2; break;
                default: throw new Error(`Unknown function '${name}'`);
            }

            for (let i = 0; i < arity; i++) {
                args.push(parseExpression());
            }

            return { type: 'CallExpression', name, arguments: args };
        }

        if (token.type === TokenType.CLOSE_BRACE) {
            // Should not happen if strictly parsing exprs, handled by caller or top level
            throw new Error("Unexpected close brace");
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
