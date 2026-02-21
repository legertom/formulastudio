import { parseFormula } from '../api-lib/idmFormulaTools.js';
import { evaluateAndTrace } from '../src/lib/interpreter.js';

function usage() {
    return {
        description: 'Run an IDM formula against sample records and return outputs.',
        methods: {
            GET: 'Returns this schema.',
            POST: 'Accepts { formula, cases: [{ data, expected? }] }.'
        },
        request: {
            formula: '{{if equals school_name "A" "Group A" "uncategorized"}}',
            cases: [
                { name: 'row 1', data: { school_name: 'A' }, expected: 'Group A' },
                { name: 'row 2', data: { school_name: 'B' }, expected: 'uncategorized' }
            ]
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
        const cases = Array.isArray(req.body?.cases) ? req.body.cases : [];

        if (!formula.trim()) {
            return res.status(400).json({ error: 'formula is required.', usage: usage() });
        }
        if (!cases.length) {
            return res.status(400).json({ error: 'cases must be a non-empty array.', usage: usage() });
        }

        const { ast } = parseFormula(formula);
        const results = cases.map((testCase, index) => {
            const data = testCase?.data && typeof testCase.data === 'object' ? testCase.data : {};
            const expected = testCase?.expected;
            const name = String(testCase?.name || `case ${index + 1}`);
            const output = evaluateAndTrace(ast, structuredClone(data)).result;
            const passed = expected === undefined ? null : String(output) === String(expected);

            return {
                name,
                output,
                expected,
                passed
            };
        });

        const compared = results.filter((r) => r.passed !== null);
        const passCount = compared.filter((r) => r.passed).length;

        return res.status(200).json({
            success: true,
            count: results.length,
            compared: compared.length,
            passCount,
            failCount: compared.length - passCount,
            results
        });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Failed to run tests.' });
    }
}
