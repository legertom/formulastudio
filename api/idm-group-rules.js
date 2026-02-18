import {
    normalizeRulesFromCsv,
    normalizeRulesFromJson,
    compileRuleList,
    compileNestedRules
} from '../api-lib/idmCompiler.js';

function usage() {
    return {
        description: 'Compile JSON or CSV group rules into IDM formulas.',
        methods: {
            GET: 'Returns this schema.',
            POST: 'Accepts either { rules: [...] } or { csv: "..." } and returns compiled formulas.'
        },
        jsonSchema: {
            defaultOutput: 'uncategorized',
            rules: [
                {
                    priority: 1,
                    output: 'Group A',
                    match: 'all',
                    conditions: [
                        { field: 'school_name', operator: 'equals', value: 'A' },
                        { field: 'student.sis_id', operator: 'startsWith', value: '2' }
                    ]
                }
            ]
        },
        csvSchema: 'priority,output,match,field_1,operator_1,value_1,field_2,operator_2,value_2'
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

        const defaultOutput = String(req.body?.defaultOutput ?? '');
        let rules = [];

        if (typeof req.body?.csv === 'string' && req.body.csv.trim()) {
            rules = normalizeRulesFromCsv(req.body.csv);
        } else if (Array.isArray(req.body?.rules)) {
            rules = normalizeRulesFromJson(req.body.rules);
        } else {
            return res.status(400).json({
                error: 'Provide either { rules: [...] } or { csv: "..." } in the request body.',
                usage: usage()
            });
        }

        const list = compileRuleList(rules);
        const nested = compileNestedRules(rules, defaultOutput);

        return res.status(200).json({
            success: true,
            count: rules.length,
            defaultOutput,
            rules,
            formulas: {
                list,
                nested
            }
        });
    } catch (error) {
        console.error('idm-group-rules error:', error);
        return res.status(400).json({
            error: error?.message || 'Failed to compile group rules.'
        });
    }
}
