# IDM Formula LLM Instruction Pack

Use this as the baseline rulebook for converting natural English or spreadsheet logic into IDM formulas.

## Core syntax
- Wrap formulas in `{{ ... }}`.
- Use prefix notation (`if condition true false`), no parentheses.
- Use canonical functions: `equals`, `length`, `startsWith` pattern via `substr`.
- Always include a fallback output in `if`.

## API references
- `GET /api/idm-spec` for machine-readable syntax/function/operator schema.
- `GET /api/idm-instructions` for full markdown instructions.
- `POST /api/idm-group-rules` to compile JSON/CSV rules into IDM formulas.

## JSON template
```json
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
```

## CSV template
```csv
priority,output,match,field_1,operator_1,value_1,field_2,operator_2,value_2
1,Group A,all,school_name,equals,A,student.sis_id,startsWith,2
```
