const SYNTAX_RULES = [
    'Wrap every formula in double braces: {{ ... }}.',
    'Use prefix notation only: functionName arg1 arg2.',
    'Do not use parentheses or commas.',
    'Use double quotes for all string literals.',
    'Use dot notation for fields (example: student.sis_id).',
    'Functions are fixed-arity; every function must receive the exact number of arguments.'
];

const FUNCTION_CATALOG = [
    { name: 'if', arity: 3, category: 'logic', signature: 'if condition trueValue falseValue' },
    { name: 'equals', arity: 2, category: 'logic', signature: 'equals left right', aliases: ['equal'] },
    { name: 'and', arity: 2, category: 'logic', signature: 'and cond1 cond2' },
    { name: 'or', arity: 2, category: 'logic', signature: 'or cond1 cond2' },
    { name: 'not', arity: 1, category: 'logic', signature: 'not cond' },
    { name: 'contains', arity: 2, category: 'logic', signature: 'contains text needle' },
    { name: 'greater', arity: 2, category: 'comparison', signature: 'greater left right' },
    { name: 'less', arity: 2, category: 'comparison', signature: 'less left right' },
    { name: 'geq', arity: 2, category: 'comparison', signature: 'geq left right' },
    { name: 'leq', arity: 2, category: 'comparison', signature: 'leq left right' },
    { name: 'in', arity: 2, category: 'logic', signature: 'in value "item1 item2 item3"' },
    { name: 'concat', arity: 2, category: 'string', signature: 'concat part1 part2' },
    { name: 'substr', arity: 3, category: 'string', signature: 'substr text start length' },
    { name: 'replace', arity: 3, category: 'string', signature: 'replace text find replacement' },
    { name: 'length', arity: 1, category: 'string', signature: 'length text' },
    { name: 'ignoreIfNull', arity: 1, category: 'utility', signature: 'ignoreIfNull field' },
    { name: 'forEach', arity: 3, category: 'utility', signature: 'forEach "item" list expression' },
    { name: 'toUpper', arity: 1, category: 'string', signature: 'toUpper text' },
    { name: 'toLower', arity: 1, category: 'string', signature: 'toLower text' },
    { name: 'initials', arity: 1, category: 'string', signature: 'initials text' },
    { name: 'alphanumeric', arity: 1, category: 'string', signature: 'alphanumeric text' },
    { name: 'trimLeft', arity: 1, category: 'string', signature: 'trimLeft text' },
    { name: 'delimiterCapitalize', arity: 1, category: 'string', signature: 'delimiterCapitalize text' },
    { name: 'textBefore', arity: 2, category: 'string', signature: 'textBefore text delimiter' },
    { name: 'textAfter', arity: 2, category: 'string', signature: 'textAfter text delimiter' },
    { name: 'textAfterLast', arity: 2, category: 'string', signature: 'textAfterLast text delimiter' },
    { name: 'add', arity: 2, category: 'math', signature: 'add left right' },
    { name: 'subtract', arity: 2, category: 'math', signature: 'subtract left right' },
    { name: 'formatDate', arity: 2, category: 'date', signature: 'formatDate date format' }
];

const FIELD_HINTS = [
    'name.first',
    'name.last',
    'name.middle',
    'student.sis_id',
    'student.student_number',
    'student.grade',
    'student.graduation_year',
    'school_name',
    'school.name',
    'school.sis_id',
    'email'
];

const OPERATOR_ALIASES = {
    '=': 'equals',
    '==': 'equals',
    equals: 'equals',
    equal: 'equals',
    is: 'equals',
    contains: 'contains',
    includes: 'contains',
    startswith: 'startsWith',
    starts_with: 'startsWith',
    'starts with': 'startsWith',
    beginswith: 'startsWith',
    'begins with': 'startsWith',
    in: 'in',
    greater: 'greater',
    '>': 'greater',
    less: 'less',
    '<': 'less',
    geq: 'geq',
    '>=': 'geq',
    leq: 'leq',
    '<=': 'leq',
    notcontains: 'notContains',
    'not contains': 'notContains'
};

const GROUP_RULES_CSV_SCHEMA = {
    requiredColumns: ['priority', 'output', 'match'],
    supportedMatchValues: ['all', 'any'],
    conditionColumns: [
        { field: 'field', operator: 'operator', value: 'value' },
        { field: 'field_1', operator: 'operator_1', value: 'value_1' },
        { field: 'field_2', operator: 'operator_2', value: 'value_2' },
        { field: 'field_3', operator: 'operator_3', value: 'value_3' }
    ],
    alternateOutputColumns: ['group_name', 'group', 'result'],
    alternateConditionsColumn: 'conditions',
    conditionsFormat: 'field|operator|value;field|operator|value'
};

export function buildIdmSpec() {
    return {
        name: 'IDM Formula Language',
        version: '2026-02-18',
        syntax: SYNTAX_RULES,
        functionCatalog: FUNCTION_CATALOG,
        fieldHints: FIELD_HINTS,
        operatorAliases: OPERATOR_ALIASES,
        groupRulesCsvSchema: GROUP_RULES_CSV_SCHEMA,
        generationPolicy: {
            canonicalFunctionNames: ['length', 'equals'],
            avoidAliases: ['len', 'trim'],
            fallbackOutputRequired: true
        }
    };
}

export const IDM_SPEC = buildIdmSpec();
