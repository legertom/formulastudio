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

function astToKey(node) {
    if (!node) return '';

    const stripRanges = (value) => {
        if (!value || typeof value !== 'object') return value;
        if (Array.isArray(value)) return value.map(stripRanges);

        const out = {};
        for (const [key, item] of Object.entries(value)) {
            if (key === 'range') continue;
            out[key] = stripRanges(item);
        }
        return out;
    };

    return JSON.stringify(stripRanges(node));
}

function conditionContains(conditionNode, targetNode) {
    if (!conditionNode || !targetNode) return false;
    if (astToKey(conditionNode) === astToKey(targetNode)) return true;

    if (conditionNode.type === 'CallExpression' && conditionNode.name === 'and') {
        return conditionNode.arguments?.some((arg) => conditionContains(arg, targetNode)) || false;
    }

    return false;
}

function collectIfChain(ast) {
    const branches = [];
    let current = ast;

    while (current && current.type === 'CallExpression' && current.name === 'if') {
        branches.push({
            condition: current.arguments?.[0],
            output: current.arguments?.[1],
            node: current
        });
        const fallback = current.arguments?.[2];
        if (fallback && fallback.type === 'CallExpression' && fallback.name === 'if') {
            current = fallback;
        } else {
            break;
        }
    }

    return branches;
}

export const LINT_RULES = [
    {
        id: 'L001',
        title: 'Non-canonical function alias',
        severity: 'info',
        message: 'Use canonical function names (for example: equals instead of equal).',
        guidance: 'Run /api/idm-format with canonicalize=true.'
    },
    {
        id: 'L002',
        title: 'Empty fallback output in if',
        severity: 'info',
        message: 'if fallback is an empty string. This is valid, but verify that dropping unmatched users is intentional.',
        guidance: 'Use an explicit fallback group if you want unmatched users to be categorized.'
    },
    {
        id: 'L003',
        title: 'Potentially unreachable branch (duplicate condition)',
        severity: 'warning',
        message: 'A later branch repeats an earlier condition in the same if-chain.',
        guidance: 'Remove duplicates or reorder logic so each branch can execute.'
    },
    {
        id: 'L004',
        title: 'Potentially unreachable branch (broader condition first)',
        severity: 'warning',
        message: 'An earlier condition appears broader than a later one (for example A before A AND B).',
        guidance: 'Place specific conditions before broader catch-all conditions.'
    },
    {
        id: 'L005',
        title: 'forEach arg3 may not be URL-encoded',
        severity: 'warning',
        message: 'forEach argument 3 should be URL-encoded logic (%7B%7B...%7D%7D).',
        guidance: 'Encode the inner logic before passing it as the 3rd argument.'
    },
    {
        id: 'L006',
        title: 'Deep nested if-chain',
        severity: 'info',
        message: 'Long if-chains are harder to maintain and debug.',
        guidance: 'Consider splitting logic into grouped rules or reviewing priority structure.'
    },
    {
        id: 'L007',
        title: 'Large in-list',
        severity: 'info',
        message: 'Large in-lists can be brittle and difficult to review.',
        guidance: 'Consider normalizing source data or splitting into smaller logical groups.'
    }
];

function lintMessage(ruleId, detail = '') {
    const rule = LINT_RULES.find((item) => item.id === ruleId);
    return {
        ruleId,
        severity: rule?.severity || 'info',
        title: rule?.title || 'Lint rule',
        message: detail || rule?.message || 'Lint finding.',
        guidance: rule?.guidance || ''
    };
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

        if (node.name === 'forEach') {
            const arg3 = node.arguments?.[2];
            if (!arg3 || arg3.type !== 'StringLiteral') {
                diagnostics.errors.push('forEach argument 3 must be a URL-encoded string literal.');
                return;
            }

            const raw = String(arg3.value || '');
            try {
                const decoded = decodeURIComponent(raw);
                if ((decoded.includes('{{') || decoded.includes('}}')) && (!raw.includes('%7B') && !raw.includes('%7D'))) {
                    diagnostics.errors.push('forEach argument 3 appears unencoded. Use URL-encoded logic (e.g. %7B%7B...%7D%7D).');
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

export function lintFormula(formula, options = {}) {
    const findings = [];
    const maxIfDepth = Number(options.maxIfDepth ?? 8);
    const maxInItems = Number(options.maxInItems ?? 25);

    let ast;
    try {
        const parsed = parseFormula(formula);
        ast = parsed.ast;
    } catch (error) {
        return {
            valid: false,
            findings: [
                {
                    ruleId: 'PARSE',
                    severity: 'error',
                    title: 'Invalid syntax',
                    message: error?.message || 'Invalid formula syntax.',
                    guidance: 'Fix parse errors first, then run lint again.'
                }
            ]
        };
    }

    traverse(ast, (node) => {
        if (node.type !== 'CallExpression') return;

        if (node.name === 'equal') {
            findings.push(lintMessage('L001'));
        }

        if (node.name === 'if') {
            const fallback = node.arguments?.[2];
            if (fallback?.type === 'StringLiteral' && fallback.value === '') {
                findings.push(lintMessage('L002'));
            }
        }

        if (node.name === 'forEach') {
            const arg3 = node.arguments?.[2];
            if (!arg3 || arg3.type !== 'StringLiteral') {
                findings.push(lintMessage('L005', 'forEach argument 3 should be a URL-encoded string literal.'));
            } else {
                const raw = String(arg3.value || '');
                try {
                    const decoded = decodeURIComponent(raw);
                    if ((decoded.includes('{{') || decoded.includes('}}')) && (!raw.includes('%7B') && !raw.includes('%7D'))) {
                        findings.push(lintMessage('L005'));
                    }
                } catch {
                    findings.push(lintMessage('L005', 'forEach argument 3 is not valid URL encoding.'));
                }
            }
        }

        if (node.name === 'in') {
            const listArg = node.arguments?.[1];
            if (listArg?.type === 'StringLiteral') {
                const itemCount = String(listArg.value || '').split(/\s+/).filter(Boolean).length;
                if (itemCount > maxInItems) {
                    findings.push(lintMessage('L007', `in-list has ${itemCount} items (threshold: ${maxInItems}).`));
                }
            }
        }
    });

    const branches = collectIfChain(ast);
    if (branches.length > maxIfDepth) {
        findings.push(lintMessage('L006', `if-chain depth is ${branches.length} (threshold: ${maxIfDepth}).`));
    }

    for (let i = 0; i < branches.length; i += 1) {
        for (let j = i + 1; j < branches.length; j += 1) {
            const earlier = branches[i].condition;
            const later = branches[j].condition;
            if (!earlier || !later) continue;

            if (astToKey(earlier) === astToKey(later)) {
                findings.push(lintMessage('L003', `branch ${j + 1} repeats condition from branch ${i + 1}.`));
            }

            if (conditionContains(later, earlier) && astToKey(earlier) !== astToKey(later)) {
                findings.push(lintMessage('L004', `branch ${i + 1} may shadow branch ${j + 1} (broader condition appears first).`));
            }
        }
    }

    const uniqueFindings = [];
    const seen = new Set();
    for (const finding of findings) {
        const key = `${finding.ruleId}|${finding.message}`;
        if (seen.has(key)) continue;
        seen.add(key);
        uniqueFindings.push(finding);
    }

    return {
        valid: true,
        findings: uniqueFindings,
        rules: LINT_RULES
    };
}
