import { validateFormula } from '../api-lib/idmFormulaTools.js';

function usage() {
    return {
        description: 'Validate IDM formula syntax and guardrails.',
        methods: {
            GET: 'Returns this schema.',
            POST: 'Accepts { formula: "{{...}}" } and returns validation results.'
        },
        request: {
            formula: '{{if equals school_name "A" "Group A" "uncategorized"}}'
        }
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

        const result = validateFormula(formula);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Failed to validate formula.' });
    }
}
