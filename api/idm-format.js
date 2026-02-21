import { formatFormula } from '../api-lib/idmFormulaTools.js';

function usage() {
    return {
        description: 'Format IDM formulas and normalize canonical function aliases.',
        methods: {
            GET: 'Returns this schema.',
            POST: 'Accepts { formula, pretty=true, canonicalize=true }.'
        },
        request: {
            formula: '{{if equal school_name "A" "Group A" "uncategorized"}}',
            pretty: true,
            canonicalize: true
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

        const pretty = req.body?.pretty !== false;
        const canonicalize = req.body?.canonicalize !== false;

        const formatted = formatFormula(formula, { pretty, canonicalize });
        return res.status(200).json({
            success: true,
            formula: formatted,
            options: { pretty, canonicalize }
        });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Failed to format formula.' });
    }
}
