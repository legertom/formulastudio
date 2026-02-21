import { tokenize, parse, prettyStringify, stringify } from '../src/lib/parser.js';

function traverse(node, visitor) {
    if (!node || typeof node !== 'object') return;
    visitor(node);
    if (node.type === 'CallExpression' && Array.isArray(node.arguments)) {
        node.arguments.forEach((arg) => traverse(arg, visitor));
    }
}

function cloneAst(ast) {
    return ast ? JSON.parse(JSON.stringify(ast)) : ast;
}

function canonicalizeAst(ast) {
    const copy = cloneAst(ast);
    traverse(copy, (node) => {
        if (node.type === 'CallExpression' && node.name === 'equal') {
            node.name = 'equals';
        }
    });
    return copy;
}

export function parseFormula(formula) {
    const tokens = tokenize(String(formula || ''));
    const ast = parse(tokens);
    return { tokens, ast };
}

export function formatFormula(formula, options = {}) {
    const { ast } = parseFormula(formula);
    const canonicalAst = options.canonicalize === false ? ast : canonicalizeAst(ast);
    const inner = options.pretty ? prettyStringify(canonicalAst) : stringify(canonicalAst);
    const normalizedInner = String(inner || '').trim();
    return `{{${normalizedInner}}}`;
}

export function validateFormula(formula) {
    const diagnostics = { errors: [], warnings: [] };

    let ast;
    try {
        const parsed = parseFormula(formula);
        ast = parsed.ast;
    } catch (error) {
        diagnostics.errors.push(error?.message || 'Invalid formula syntax.');
        return {
            valid: false,
            ...diagnostics
        };
    }

    traverse(ast, (node) => {
        if (node.type !== 'CallExpression') return;

        if (node.name === 'if') {
            const fallback = node.arguments?.[2];
            if (!fallback || (fallback.type === 'StringLiteral' && fallback.value === '')) {
                diagnostics.warnings.push('if expression has an empty fallback output.');
            }
        }

        if (node.name === 'forEach') {
            const arg3 = node.arguments?.[2];
            if (!arg3 || arg3.type !== 'StringLiteral') {
                diagnostics.errors.push('forEach argument 3 must be a URL-encoded string literal.');
                return;
            }

            const raw = String(arg3.value || '');
            try {
                const decoded = decodeURIComponent(raw);
                if (decoded.includes('{{') || decoded.includes('}}')) {
                    if (!raw.includes('%7B') && !raw.includes('%7D')) {
                        diagnostics.errors.push('forEach argument 3 appears unencoded. Use URL-encoded logic (e.g. %7B%7B...%7D%7D).');
                    }
                }
            } catch {
                diagnostics.errors.push('forEach argument 3 is not valid URL encoding.');
            }
        }
    });

    return {
        valid: diagnostics.errors.length === 0,
        ...diagnostics
    };
}
