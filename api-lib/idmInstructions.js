import { IDM_SPEC } from './idmSpec.js';

function renderFunctionLines() {
    return IDM_SPEC.functionCatalog
        .map((func) => {
            const aliases = Array.isArray(func.aliases) && func.aliases.length
                ? ` (aliases: ${func.aliases.join(', ')})`
                : '';
            return `- \`${func.name}\` (arity ${func.arity}): \`${func.signature}\`${aliases}`;
        })
        .join('\n');
}

function renderFieldHints() {
    return IDM_SPEC.fieldHints.map((field) => `- \`${field}\``).join('\n');
}

export function buildIdmInstructionsMarkdown() {
    return `# IDM Formula LLM Instruction Pack

## Goal
Convert natural English policy requirements and spreadsheet rule sets into valid IDM formulas.

## Canonical Rules
${IDM_SPEC.syntax.map((rule) => `- ${rule}`).join('\n')}
- Prefer canonical names: \`length\` (not \`len\`), \`equals\` (not \`equal\`).
- Always include an explicit fallback in \`if\` formulas.
- In \`forEach\`, argument 3 must be URL-encoded (example: \`%7B%7Bitem.name%7D%7D\`).
- String literals cannot contain raw double quotes.

## Supported Functions
${renderFunctionLines()}

## Field Hints
${renderFieldHints()}

## Natural Language -> IDM Workflow
1. Extract target behavior into structured JSON:
   - \`conditions\`: list of field/operator/value checks
   - \`match\`: \`all\` or \`any\`
   - \`output\`: literal output when matched
   - \`defaultOutput\`: fallback output
2. Normalize operators using aliases:
   - \`is\`/\`=\`/\`==\` -> \`equals\`
   - \`starts with\` -> \`startsWith\`
   - \`includes\` -> \`contains\`
3. Compile deterministically:
   - \`startsWith(field, "X")\` -> \`equals substr field 0 LEN "X"\`
   - multiple conditions -> nested \`and\` or \`or\`
   - rule chain -> nested \`if\`
4. Validate the output formula with parser + test data.

## CSV -> Group Rules Workflow
Use one row per rule with this schema:

\`\`\`csv
priority,output,match,field_1,operator_1,value_1,field_2,operator_2,value_2
1,Group A,all,school_name,equals,A,student.sis_id,startsWith,2
2,Group B,all,school_name,equals,B,,,
\`\`\`

Alternative compact format:

\`\`\`csv
priority,output,match,conditions
1,Group A,all,school_name|equals|A;student.sis_id|startsWith|2
\`\`\`

Validation limits:
- Max rules per request: 200
- Max conditions per rule: 100

## API Endpoints
- \`GET /api/idm-spec\`: machine-readable language + operator schema.
- \`GET /api/idm-instructions\`: this instruction pack as markdown.
- \`GET /api/idm-instructions?download=1\`: forces file download.
- \`POST /api/idm-group-rules\`: compile JSON rules or CSV into normalized rules + formulas.

## JSON Request Template (\`POST /api/idm-group-rules\`)
\`\`\`json
{
  "defaultOutput": "uncategorized",
  "rules": [
    {
      "priority": 1,
      "output": "Group A",
      "match": "all",
      "conditions": [
        { "field": "school_name", "operator": "equals", "value": "A" },
        { "field": "student.sis_id", "operator": "startsWith", "value": "2" }
      ]
    }
  ]
}
\`\`\`
`;
}
