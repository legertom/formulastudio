import { lintFormula, LINT_RULES } from '../api-lib/idmFormulaTools.js';

function usage() {
    return {
        description: 'Lint IDM formulas for maintainability and logic-risk patterns.',
        methods: {
            GET: 'Returns schema + lint rule catalog.',
            POST: 'Accepts { formula, options? } and returns lint findings.'
        },
        request: {
            formula: '{{if equals school_name "A" "Group A" ""}}',
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

        const result = lintFormula(formula, req.body?.options || {});
        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Failed to lint formula.' });
    }
}
