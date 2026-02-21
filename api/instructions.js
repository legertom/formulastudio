const BASE_URL = 'https://formulastudio.net';

function htmlEscape(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function buildPageHtml() {
    const endpoints = [
        {
            method: 'GET',
            path: '/api/instructions',
            purpose: 'This human-readable guide.'
        },
        {
            method: 'GET',
            path: '/api/idm-spec',
            purpose: 'Machine-readable JSON spec for IDM syntax, functions, aliases, and CSV schema.'
        },
        {
            method: 'GET',
            path: '/api/idm-instructions',
            purpose: 'Markdown instructions for LLM/agent integration.'
        },
        {
            method: 'GET',
            path: '/api/idm-instructions?download=1',
            purpose: 'Downloads the markdown instruction pack.'
        },
        {
            method: 'GET',
            path: '/api/idm-group-rules',
            purpose: 'Returns usage schema for the group-rule compiler API.'
        },
        {
            method: 'POST',
            path: '/api/idm-group-rules',
            purpose: 'Compiles JSON or CSV group rules into normalized IDM formulas.'
        },
        {
            method: 'POST',
            path: '/api/idm-validate',
            purpose: 'Validates formula syntax + guardrails and returns errors/warnings.'
        },
        {
            method: 'POST',
            path: '/api/idm-format',
            purpose: 'Formats formulas and canonicalizes aliases (ex: equal -> equals).'
        },
        {
            method: 'POST',
            path: '/api/idm-test',
            purpose: 'Runs formula against test cases and returns pass/fail output.'
        }
    ];

    const endpointRows = endpoints
        .map((endpoint) => {
            const href = `${BASE_URL}${endpoint.path}`;
            return `<tr>
    <td><code>${htmlEscape(endpoint.method)}</code></td>
    <td><a href="${htmlEscape(href)}">${htmlEscape(endpoint.path)}</a></td>
    <td>${htmlEscape(endpoint.purpose)}</td>
  </tr>`;
        })
        .join('\n');

    const jsonExample = `{
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
}`;

    const csvExample = `priority,output,match,field_1,operator_1,value_1,field_2,operator_2,value_2
1,Group A,all,school_name,equals,A,student.sis_id,startsWith,2
2,Group B,all,school_name,equals,B,,,`;

    const curlJson = `curl -X POST "${BASE_URL}/api/idm-group-rules" \\
  -H "Content-Type: application/json" \\
  -d '${jsonExample}'`;

    const curlCsv = `curl -X POST "${BASE_URL}/api/idm-group-rules" \\
  -H "Content-Type: application/json" \\
  -d '{
  "defaultOutput": "uncategorized",
  "csv": "${csvExample.replaceAll('\n', '\\n')}"
}'`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Formula Studio API Instructions</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --card: #ffffff;
      --text: #172033;
      --muted: #5f6b84;
      --line: #dbe1ef;
      --link: #0f5be6;
      --code-bg: #0f172a;
      --code-text: #e2e8f0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "IBM Plex Sans", "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .wrap {
      max-width: 1040px;
      margin: 0 auto;
      padding: 2rem 1rem 3rem;
    }
    .hero {
      background: linear-gradient(130deg, #ffffff 0%, #eef4ff 100%);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 1.2rem 1.2rem 1rem;
      margin-bottom: 1rem;
    }
    h1 { margin: 0 0 0.4rem; font-size: 1.6rem; }
    h2 { margin: 1.6rem 0 0.5rem; font-size: 1.15rem; }
    p { margin: 0.3rem 0 0.8rem; color: var(--muted); }
    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 1rem;
      margin: 0.8rem 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.4rem;
    }
    th, td {
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
      padding: 0.6rem 0.5rem;
      font-size: 0.95rem;
    }
    th { color: #30405f; background: #f8faff; }
    code, pre {
      font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
      font-size: 0.88rem;
    }
    pre {
      margin: 0.5rem 0 0;
      background: var(--code-bg);
      color: var(--code-text);
      padding: 0.9rem;
      border-radius: 10px;
      overflow-x: auto;
      border: 1px solid #0b1222;
    }
    a { color: var(--link); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul {
      margin: 0.3rem 0 0.8rem 1.1rem;
      padding: 0;
      color: var(--muted);
    }
    li { margin: 0.2rem 0; }
    .tiny { font-size: 0.86rem; color: var(--muted); }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <h1>Formula Studio API Instructions</h1>
      <p>This page is for humans and robots. Humans can read and copy examples. Robots can use the endpoint list and schemas directly.</p>
      <p><strong>Base URL:</strong> <a href="${BASE_URL}">${BASE_URL}</a></p>
      <p class="tiny"><strong>Auth:</strong> none currently required.</p>
    </section>

    <section class="card">
      <h2>Available Endpoints</h2>
      <table>
        <thead>
          <tr>
            <th style="width:110px;">Method</th>
            <th style="width:310px;">Path</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
${endpointRows}
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>Quick Start (recommended 4-call flow)</h2>
      <ol>
        <li><strong>Format</strong> with <code>POST /api/idm-format</code> (canonicalize aliases + normalize layout).</li>
        <li><strong>Validate</strong> with <code>POST /api/idm-validate</code> (syntax + guardrails).</li>
        <li><strong>Lint</strong> with <code>POST /api/idm-validate</code> and <code>{"mode":"lint"}</code> (logic-risk checks).</li>
        <li><strong>Test</strong> with <code>POST /api/idm-test</code> using sample records.</li>
      </ol>
      <p class="tiny">For group rules from structured inputs, use <code>POST /api/idm-group-rules</code> before step 1.</p>
    </section>

    <section class="card">
      <h2>Feature Modes (open-ended)</h2>
      <ul>
        <li><strong>Set A: Deterministic CSV Compiler</strong> — use the standard group-rule CSV schema and compile with zero AI interpretation.</li>
        <li><strong>Set B: Group Rule Builder</strong> — convert JSON/CSV rules into per-rule and nested IDM formulas.</li>
        <li><strong>Set C: OU Logic Builder</strong> — write and format OU-focused IDM formulas with validation.</li>
        <li><strong>Set D: Validation + Debug</strong> — run format/validate/lint/test before production use.</li>
      </ul>
      <p class="tiny">These are capabilities, not rigid scripts — users and agents can compose them as needed.</p>
    </section>

    <section class="card">
      <h2>Validation Result Types</h2>
      <table>
        <thead>
          <tr><th style="width:120px;">Type</th><th>Meaning</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr><td><code>error</code></td><td>Invalid formula or broken guardrail.</td><td>Must fix before use.</td></tr>
          <tr><td><code>warning</code></td><td>Likely risky logic pattern.</td><td>Review intent before use.</td></tr>
          <tr><td><code>info</code></td><td>Style/maintainability guidance.</td><td>Optional cleanup.</td></tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h2>Important Constraints</h2>
      <ul>
        <li><code>forEach</code> argument 3 must be URL-encoded (example: <code>%7B%7Bs.name%7D%7D</code>).</li>
        <li>String literals cannot contain raw double quotes.</li>
        <li>Nested <code>if</code> formulas should include an explicit fallback output.</li>
        <li>Group rule request limits: max 200 rules per request; max 100 conditions per rule.</li>
      </ul>
    </section>

    <section class="card">
      <h2>POST JSON Example</h2>
      <pre><code>${htmlEscape(curlJson)}</code></pre>
    </section>

    <section class="card">
      <h2>POST CSV Example</h2>
      <pre><code>${htmlEscape(curlCsv)}</code></pre>
    </section>

    <section class="card">
      <h2>CSV Input Contract (strict schema)</h2>
      <p><strong>Required columns:</strong> <code>priority</code>, <code>output</code>, <code>match</code>.</p>
      <p><strong>Allowed match values:</strong> <code>all</code> or <code>any</code>.</p>
      <p><strong>Condition column styles:</strong></p>
      <ul>
        <li><strong>Wide columns:</strong> <code>field_1,operator_1,value_1,field_2,operator_2,value_2,...</code></li>
        <li><strong>Compact conditions:</strong> single <code>conditions</code> column as <code>field|operator|value;field|operator|value</code></li>
      </ul>
      <p class="tiny">No AI interpretation is applied in deterministic CSV mode. CSV must match schema.</p>
    </section>

    <section class="card">
      <h2>CSV Example</h2>
      <pre><code>${htmlEscape(csvExample)}</code></pre>
    </section>

    <section class="card">
      <h2>Common CSV Errors</h2>
      <ul>
        <li>Missing one of the required columns: <code>priority</code>, <code>output</code>, <code>match</code>.</li>
        <li>Unsupported <code>match</code> value (must be <code>all</code> or <code>any</code>).</li>
        <li>No valid conditions found on a row.</li>
        <li>Unsupported operator in a condition.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Data Structures (for humans + robots)</h2>
      <p><strong>Group rule object:</strong></p>
      <pre><code>${htmlEscape(`{
  "priority": 1,
  "output": "Group A",
  "match": "all",
  "conditions": [
    { "field": "school_name", "operator": "equals", "value": "A" },
    { "field": "student.sis_id", "operator": "startsWith", "value": "2" }
  ]
}`)}</code></pre>

      <p><strong>/api/idm-group-rules response shape:</strong></p>
      <pre><code>${htmlEscape(`{
  "success": true,
  "count": 2,
  "defaultOutput": "uncategorized",
  "rules": [ ...normalized rules... ],
  "formulas": {
    "list": [
      {
        "priority": 1,
        "output": "Group A",
        "condition": "{{and equals school_name \"A\" equals substr student.sis_id 0 1 \"2\"}}",
        "formula": "{{if and equals school_name \"A\" equals substr student.sis_id 0 1 \"2\" \"Group A\" \"\"}}"
      }
    ],
    "nested": "{{if and equals school_name \"A\" equals substr student.sis_id 0 1 \"2\" \"Group A\" \"uncategorized\"}}"
  }
}`)}</code></pre>

      <p><strong>/api/idm-format response shape:</strong></p>
      <pre><code>${htmlEscape(`{
  "success": true,
  "formula": "{{if\n  equals school_name \"A\"\n  \"Group A\"\n  \"uncategorized\"}}",
  "options": { "pretty": true, "canonicalize": true }
}`)}</code></pre>

      <p><strong>/api/idm-validate response shape:</strong></p>
      <pre><code>${htmlEscape(`{
  "success": true,
  "valid": true,
  "errors": [],
  "warnings": ["if expression has an empty fallback output."]
}`)}</code></pre>

      <p><strong>/api/idm-test response shape:</strong></p>
      <pre><code>${htmlEscape(`{
  "success": true,
  "count": 2,
  "compared": 2,
  "passCount": 2,
  "failCount": 0,
  "results": [
    { "name": "row 1", "output": "Group A", "expected": "Group A", "passed": true }
  ]
}`)}</code></pre>

      <p><strong>/api/idm-validate response shape (lint mode):</strong></p>
      <pre><code>${htmlEscape(`{
  "success": true,
  "mode": "lint",
  "valid": true,
  "findings": [
    {
      "ruleId": "L004",
      "severity": "warning",
      "title": "Potentially unreachable branch (broader condition first)",
      "message": "branch 1 may shadow branch 2 (broader condition appears first).",
      "guidance": "Place specific conditions before broader catch-all conditions."
    }
  ]
}`)}</code></pre>
    </section>

    <section class="card">
      <h2>Agent Prompt Starter (Cursor / Claude Code)</h2>
      <pre><code>${htmlEscape(`Visit https://formulastudio.net/api/instructions and follow the Quick Start flow.
Use deterministic CSV mode only when the CSV matches the documented schema exactly.
If input is ambiguous or non-standard, convert it to structured rules first, then call /api/idm-group-rules.
Always run validate + lint + test before final output.`)}</code></pre>
    </section>

    <section class="card">
      <h2>Linter Rule Documentation</h2>
      <ul>
        <li><strong>L001</strong> — Non-canonical function alias. Example: <code>equal</code> instead of <code>equals</code>.</li>
        <li><strong>L002</strong> — Empty fallback output in <code>if</code>. Valid but easy to misuse if you expected explicit catch-all grouping.</li>
        <li><strong>L003</strong> — Potentially unreachable branch (duplicate condition). A later branch repeats an earlier branch condition.</li>
        <li><strong>L004</strong> — Potentially unreachable branch (broader condition first). Example: <code>A</code> before <code>A AND B</code>.</li>
        <li><strong>L005</strong> — <code>forEach</code> arg3 may not be URL-encoded.</li>
        <li><strong>L006</strong> — Deep nested if-chain. Harder to maintain/debug past configured depth threshold.</li>
        <li><strong>L007</strong> — Large <code>in</code>-list. Valid but brittle if the token list grows too large.</li>
      </ul>
      <p class="tiny">Use <code>GET /api/idm-validate</code> for machine-readable rule metadata (id, severity, message, guidance), and <code>POST /api/idm-validate</code> with <code>{"mode":"lint"}</code> to run linting.</p>
    </section>
  </main>
</body>
</html>`;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const pageHtml = buildPageHtml();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(pageHtml);
}
