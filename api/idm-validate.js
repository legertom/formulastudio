import { validateFormula, lintFormula, LINT_RULES } from '../api-lib/idmFormulaTools.js';

function usage() {
    return {
        description: 'Validate IDM formula syntax/guardrails and optionally run linter rules.',
        methods: {
            GET: 'Returns this schema + lint rule catalog.',
            POST: 'Accepts { formula: "{{...}}", mode?: "validate"|"lint", options?: {...} }.'
        },
        request: {
            formula: '{{if equals school_name "A" "Group A" "uncategorized"}}',
            mode: 'validate',
            options: {
                maxIfDepth: 8,
                maxInItems: 25
            }
        },
        lintRules: LINT_RULES
    };
}

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            return res.status(200).json(usage());
        }
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const formula = String(req.body?.formula || '');
        if (!formula.trim()) {
            return res.status(400).json({ error: 'formula is required.', usage: usage() });
        }

        const mode = String(req.body?.mode || 'validate').toLowerCase();

        if (mode === 'lint') {
            const lintResult = lintFormula(formula, req.body?.options || {});
            return res.status(200).json({ success: true, mode: 'lint', ...lintResult });
        }

        const result = validateFormula(formula);
        return res.status(200).json({ success: true, mode: 'validate', ...result });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Failed to validate formula.' });
    }
}
