import { IDM_SPEC } from './idmSpec.js';

const OPERATOR_ALIASES = IDM_SPEC.operatorAliases || {};
const MAX_RULES = IDM_SPEC.validationLimits?.maxRules ?? 200;
const MAX_CONDITIONS_PER_RULE = IDM_SPEC.validationLimits?.maxConditionsPerRule ?? 100;

function normalizeWhitespace(value) {
    return String(value || '').trim();
}

function normalizeMatch(value) {
    const normalized = normalizeWhitespace(value).toLowerCase();
    if (!normalized) return 'all';
    if (normalized === 'all' || normalized === 'and') return 'all';
    if (normalized === 'any' || normalized === 'or') return 'any';
    throw new Error(`Unsupported match type "${value}". Use "all" or "any".`);
}

export function normalizeOperator(value) {
    const key = normalizeWhitespace(value).toLowerCase();
    if (!key) {
        throw new Error('Condition operator is required.');
    }
    return OPERATOR_ALIASES[key] || key;
}

function quoteString(value) {
    const stringValue = value === null || value === undefined ? '' : String(value);
    if (stringValue.includes('"')) {
        throw new Error(`String literal cannot contain double quotes in IDM syntax: ${stringValue}`);
    }
    return `"${stringValue}"`;
}

function ensureValue(condition, rowLabel) {
    if (condition.value === undefined || condition.value === null) {
        throw new Error(`${rowLabel}: condition "${condition.field}" is missing a value.`);
    }
}

function conditionValueToExpression(condition, rowLabel) {
    if (condition.operator === 'in') {
        if (Array.isArray(condition.value)) {
            return quoteString(condition.value.map((item) => String(item).trim()).filter(Boolean).join(' '));
        }
        return quoteString(String(condition.value));
    }
    ensureValue(condition, rowLabel);
    return quoteString(condition.value);
}

export function compileCondition(condition, rowLabel = 'rule') {
    const field = normalizeWhitespace(condition.field);
    if (!field) {
        throw new Error(`${rowLabel}: condition field is required.`);
    }

    const operator = normalizeOperator(condition.operator);
    const normalizedCondition = { field, operator, value: condition.value };

    switch (operator) {
        case 'equals':
            return `equals ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'contains':
            return `contains ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'notContains':
            return `not contains ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'startsWith': {
            ensureValue(normalizedCondition, rowLabel);
            const prefix = String(normalizedCondition.value);
            if (!prefix.length) {
                throw new Error(`${rowLabel}: startsWith value cannot be empty.`);
            }
            return `equals substr ${field} 0 ${prefix.length} ${quoteString(prefix)}`;
        }
        case 'in':
            return `in ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'greater':
            return `greater ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'less':
            return `less ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'geq':
            return `geq ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'leq':
            return `leq ${field} ${conditionValueToExpression(normalizedCondition, rowLabel)}`;
        case 'exists':
            return `ignoreIfNull ${field}`;
        case 'notExists':
            return `not ignoreIfNull ${field}`;
        default:
            throw new Error(`${rowLabel}: unsupported operator "${condition.operator}".`);
    }
}

function chainExpressions(operator, expressions) {
    if (!expressions.length) {
        throw new Error('Cannot chain an empty list of expressions.');
    }
    if (expressions.length === 1) {
        return expressions[0];
    }
    return expressions.slice(1).reduce((acc, current) => `${operator} ${acc} ${current}`, expressions[0]);
}

export function compileConditionGroup(conditions, match = 'all', rowLabel = 'rule') {
    if (!Array.isArray(conditions) || !conditions.length) {
        throw new Error(`${rowLabel}: at least one condition is required.`);
    }
    const op = normalizeMatch(match) === 'all' ? 'and' : 'or';
    const expressions = conditions.map((condition) => compileCondition(condition, rowLabel));
    return chainExpressions(op, expressions);
}

function normalizeCondition(condition, rowLabel) {
    if (!condition || typeof condition !== 'object') {
        throw new Error(`${rowLabel}: each condition must be an object.`);
    }
    return {
        field: normalizeWhitespace(condition.field),
        operator: normalizeOperator(condition.operator),
        value: condition.value
    };
}

function enforceConditionLimit(conditions, rowLabel) {
    if (conditions.length > MAX_CONDITIONS_PER_RULE) {
        throw new Error(`${rowLabel}: too many conditions (${conditions.length}). Max allowed is ${MAX_CONDITIONS_PER_RULE}.`);
    }
}

function getRuleOutput(rawRule) {
    const output = rawRule.output ?? rawRule.group_name ?? rawRule.group ?? rawRule.result;
    if (output === undefined || output === null || String(output).trim() === '') {
        throw new Error('Rule output/group_name is required.');
    }
    return String(output);
}

function getRuleConditions(rawRule, rowLabel) {
    if (Array.isArray(rawRule.conditions) && rawRule.conditions.length) {
        return {
            match: normalizeMatch(rawRule.match ?? rawRule.logic ?? 'all'),
            conditions: rawRule.conditions.map((condition) => normalizeCondition(condition, rowLabel))
        };
    }

    if (Array.isArray(rawRule.all) && rawRule.all.length) {
        return {
            match: 'all',
            conditions: rawRule.all.map((condition) => normalizeCondition(condition, rowLabel))
        };
    }

    if (Array.isArray(rawRule.any) && rawRule.any.length) {
        return {
            match: 'any',
            conditions: rawRule.any.map((condition) => normalizeCondition(condition, rowLabel))
        };
    }

    if (rawRule.field && rawRule.operator) {
        return {
            match: normalizeMatch(rawRule.match ?? rawRule.logic ?? 'all'),
            conditions: [normalizeCondition(rawRule, rowLabel)]
        };
    }

    throw new Error(`${rowLabel}: no valid conditions were found.`);
}

function parsePriority(priorityValue, fallback) {
    if (priorityValue === undefined || priorityValue === null || priorityValue === '') {
        return fallback;
    }
    const parsed = Number(priorityValue);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid priority "${priorityValue}".`);
    }
    return parsed;
}

export function normalizeRulesFromJson(rawRules) {
    if (!Array.isArray(rawRules) || !rawRules.length) {
        throw new Error('rules must be a non-empty array.');
    }
    if (rawRules.length > MAX_RULES) {
        throw new Error(`rules exceeds max allowed (${MAX_RULES}).`);
    }

    return rawRules.map((rawRule, index) => {
        const rowLabel = `rule ${index + 1}`;
        const { match, conditions } = getRuleConditions(rawRule, rowLabel);
        enforceConditionLimit(conditions, rowLabel);
        return {
            priority: parsePriority(rawRule.priority, index + 1),
            output: getRuleOutput(rawRule),
            match,
            conditions
        };
    });
}

export function parseCsv(csvText) {
    if (typeof csvText !== 'string' || !csvText.trim()) {
        throw new Error('CSV content is empty.');
    }

    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    const input = `${csvText}\n`;

    for (let index = 0; index < input.length; index += 1) {
        const char = input[index];
        const nextChar = input[index + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                cell += '"';
                index += 1;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                cell += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
            continue;
        }

        if (char === ',') {
            row.push(cell);
            cell = '';
            continue;
        }

        if (char === '\n') {
            row.push(cell);
            cell = '';
            const normalizedRow = row.map((value) => value.replace(/\r/g, '').trim());
            const hasContent = normalizedRow.some((value) => value.length > 0);
            if (hasContent) {
                rows.push(normalizedRow);
            }
            row = [];
            continue;
        }

        cell += char;
    }

    if (!rows.length) {
        throw new Error('CSV must include at least a header row.');
    }

    return rows;
}

function getConditionTriples(rowObject) {
    const triples = [];

    if (rowObject.field && rowObject.operator) {
        triples.push({
            field: rowObject.field,
            operator: rowObject.operator,
            value: rowObject.value
        });
    }

    let slot = 1;
    while (slot < 100) {
        const field = rowObject[`field_${slot}`];
        const operator = rowObject[`operator_${slot}`];
        const value = rowObject[`value_${slot}`];
        if (!field && !operator && value === undefined) {
            break;
        }
        if (field && operator) {
            triples.push({ field, operator, value });
        }
        slot += 1;
    }

    if (triples.length) {
        return triples;
    }

    if (!rowObject.conditions) {
        return [];
    }

    return String(rowObject.conditions)
        .split(';')
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const parts = chunk.split('|').map((value) => value.trim());
            if (parts.length !== 3) {
                throw new Error(`Invalid conditions cell segment "${chunk}". Expected field|operator|value.`);
            }
            return { field: parts[0], operator: parts[1], value: parts[2] };
        });
}

export function normalizeRulesFromCsv(csvText) {
    const rows = parseCsv(csvText);
    const header = rows[0].map((item) => item.trim());
    const dataRows = rows.slice(1);

    if (!dataRows.length) {
        throw new Error('CSV must include at least one data row.');
    }
    if (dataRows.length > MAX_RULES) {
        throw new Error(`CSV exceeds max allowed rows (${MAX_RULES}).`);
    }

    return dataRows.map((values, index) => {
        const rowNumber = index + 2;
        const rowObject = {};
        header.forEach((column, columnIndex) => {
            rowObject[column] = values[columnIndex] ?? '';
        });

        const output = rowObject.output || rowObject.group_name || rowObject.group || rowObject.result;
        if (!output) {
            throw new Error(`row ${rowNumber}: output/group_name is required.`);
        }

        const conditions = getConditionTriples(rowObject).map((condition) => normalizeCondition(condition, `row ${rowNumber}`));
        if (!conditions.length) {
            throw new Error(`row ${rowNumber}: no conditions were found.`);
        }
        enforceConditionLimit(conditions, `row ${rowNumber}`);

        return {
            priority: parsePriority(rowObject.priority, index + 1),
            output: String(output),
            match: normalizeMatch(rowObject.match || rowObject.logic || 'all'),
            conditions
        };
    });
}

function sortRules(rules) {
    return [...rules].sort((left, right) => {
        if (left.priority === right.priority) return 0;
        return left.priority < right.priority ? -1 : 1;
    });
}

export function compileRuleList(rules) {
    return sortRules(rules).map((rule, index) => {
        const rowLabel = `rule ${index + 1}`;
        const conditionExpression = compileConditionGroup(rule.conditions, rule.match, rowLabel);
        return {
            priority: rule.priority,
            output: rule.output,
            condition: `{{${conditionExpression}}}`,
            formula: `{{if ${conditionExpression} ${quoteString(rule.output)} ""}}`
        };
    });
}

export function compileNestedRules(rules, defaultOutput = '') {
    const sortedRules = sortRules(rules);
    let expression = quoteString(defaultOutput);

    for (let index = sortedRules.length - 1; index >= 0; index -= 1) {
        const rule = sortedRules[index];
        const rowLabel = `rule ${index + 1}`;
        const conditionExpression = compileConditionGroup(rule.conditions, rule.match, rowLabel);
        expression = `if ${conditionExpression} ${quoteString(rule.output)} ${expression}`;
    }

    return `{{${expression}}}`;
}
