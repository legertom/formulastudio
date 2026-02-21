import { describe, it, expect } from 'vitest';
import {
    normalizeRulesFromJson,
    normalizeRulesFromCsv,
    compileCondition,
    compileConditionGroup,
    compileRuleList,
    compileNestedRules
} from './idmCompiler.js';

describe('idmCompiler', () => {
    it('compiles startsWith using substr', () => {
        const expression = compileCondition({
            field: 'student.sis_id',
            operator: 'startsWith',
            value: '2'
        });

        expect(expression).toBe('equals substr student.sis_id 0 1 "2"');
    });

    it('compiles condition groups with AND', () => {
        const expression = compileConditionGroup(
            [
                { field: 'school_name', operator: 'equals', value: 'A' },
                { field: 'student.sis_id', operator: 'startsWith', value: '2' }
            ],
            'all'
        );

        expect(expression).toBe('and equals school_name "A" equals substr student.sis_id 0 1 "2"');
    });

    it('normalizes JSON rules and emits a nested formula', () => {
        const rules = normalizeRulesFromJson([
            {
                priority: 1,
                output: 'Group A',
                match: 'all',
                conditions: [
                    { field: 'school_name', operator: 'equals', value: 'A' },
                    { field: 'student.sis_id', operator: 'startsWith', value: '2' }
                ]
            },
            {
                priority: 2,
                output: 'Group B',
                conditions: [{ field: 'school_name', operator: 'equals', value: 'B' }]
            }
        ]);

        expect(rules).toHaveLength(2);

        const nested = compileNestedRules(rules, 'uncategorized');
        expect(nested).toBe('{{if and equals school_name "A" equals substr student.sis_id 0 1 "2" "Group A" if equals school_name "B" "Group B" "uncategorized"}}');
    });

    it('parses CSV rules and returns list formulas', () => {
        const csv = `priority,output,match,field_1,operator_1,value_1,field_2,operator_2,value_2
1,Group A,all,school_name,equals,A,student.sis_id,startsWith,2
2,Group B,all,school_name,equals,B,,,
`;

        const rules = normalizeRulesFromCsv(csv);
        const list = compileRuleList(rules);

        expect(rules).toHaveLength(2);
        expect(list[0].formula).toBe('{{if and equals school_name "A" equals substr student.sis_id 0 1 "2" "Group A" ""}}');
        expect(list[1].formula).toBe('{{if equals school_name "B" "Group B" ""}}');
    });

    it('parses compact conditions CSV column', () => {
        const csv = `priority,output,match,conditions
1,Group A,all,school_name|equals|A;student.sis_id|startsWith|2
`;

        const rules = normalizeRulesFromCsv(csv);
        expect(rules).toHaveLength(1);
        expect(rules[0].conditions).toHaveLength(2);
    });

    it('rejects payloads above max rule limit', () => {
        const rules = Array.from({ length: 201 }).map((_, index) => ({
            priority: index + 1,
            output: `Group ${index + 1}`,
            match: 'all',
            conditions: [{ field: 'school_name', operator: 'equals', value: 'A' }]
        }));

        expect(() => normalizeRulesFromJson(rules)).toThrow(/max allowed/i);
    });

});
