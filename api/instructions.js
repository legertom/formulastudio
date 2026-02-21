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
      <h2>Common Workflow</h2>
      <ul>
        <li>Call <code>/api/idm-spec</code> to fetch machine-readable syntax and operator aliases.</li>
        <li>Call <code>/api/idm-group-rules</code> (GET) to read request schema.</li>
        <li>Post JSON rules or CSV rules to <code>/api/idm-group-rules</code> (POST).</li>
        <li>Use <code>formulas.list</code> for one-rule-per-formula output, or <code>formulas.nested</code> for one master formula.</li>
      </ul>
    </section>

    <section class="card">
      <h2>Important Constraints</h2>
      <ul>
        <li><code>forEach</code> argument 3 must be URL-encoded (example: <code>%7B%7Bs.name%7D%7D</code>).</li>
        <li>String literals cannot contain raw double quotes.</li>
        <li>Nested <code>if</code> formulas should always include an explicit fallback output.</li>
        <li>Request limits: max 200 rules per request; max 100 conditions per rule.</li>
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
      <h2>CSV Formats Accepted</h2>
      <p><strong>Wide columns:</strong></p>
      <pre><code>${htmlEscape(csvExample)}</code></pre>
      <p><strong>Compact conditions:</strong> Use a single <code>conditions</code> column in this format:<br />
      <code>field|operator|value;field|operator|value</code></p>
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
