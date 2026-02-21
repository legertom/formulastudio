# Formula Studio

**Formula Studio** is a specialized Integrated Development Environment (IDE) designed for crafting, debugging, and visualizing **IDM (Identity Management) logic**. It provides a robust workspace for writing complex, nested filtering logic used in identity data systems.

## Overview

Identity management systems often require complex logic to filter and route user data (e.g., determining access roles based on job titles). Writing this logic in raw text can be error-prone, especially when dealing with deeply nested conditions.

Formula Studio solves this by providing:
-   **Real-time Parsing**: Instantly validates syntax as you type.
-   **Visual Feedback**: Renders the abstract logic into a visual node graph.
-   **Safety**: Catches syntax errors (unbalanced braces, invalid keywords) before deployment.

## How It Works

Formula Studio is built on a custom language processing engine tailored for the IDM logic syntax.

### The Parser
At the core of the application is a recursive descent parser. The IDM syntax follows a **Polish notation** (prefix notation) structure, wrapped in double braces.

Example:
```handlebars
{{if equals staff.title "Teacher" "Access Granted" "Access Denied"}}
```

The parser breaks this down into tokens (`OPEN_BRACE`, `KEYWORD`, `IDENTIFIER`, `STRING`, etc.) and constructs a hierarchical tree.

### The Abstract Syntax Tree (AST)
The parser transforms the flat string into an **Abstract Syntax Tree (AST)**. This tree structure represents the logical flow of the formula.
-   **Root**: The entry point of the formula.
-   **Nodes**: Represent functions (`if`, `equals`, `or`, `and`, `contains`).
-   **Leaves**: Represent values (Strings) or variables (Identifiers like `staff.title`).

### The Visualizer
The AST allows the application to render a **Visual Node Graph**. Instead of just reading code, users can see the logic flow:
-   `if` statements branch into paths.
-   `equals` comparisons show inputs and expected matches.
-   This makes "spaghetti code" instantly readable and debuggable.

## Features

-   **Interactive Training Curriculum**: A gamified, 11-chapter learning path to take users from "Zero to Hero" in formula writing.
-   **Live Syntax Validation**: Errors are highlighted immediately if you miss a quote or a parenthesis.
-   **One-Click Formatting**: Automatically indents and structures your code for maximum readability.
-   **Integrated Documentation**: Instant access to definitions and examples for every supported function.
-   **Example Library**: A built-in collection of common logic patterns to learn from and adapt.
-   **Stats**: Real-time character and line counts to keep your formulas concise.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Run the test suite:

```bash
npm run test
```

## IDM Export/API Toolkit

Formula Studio now includes endpoints you can use to distribute IDM generation rules as a download or API.

### 1) Downloadable instruction pack

- `GET /api/idm-instructions` returns markdown instructions for LLM integration.
- `GET /api/idm-instructions?download=1` forces a file download (`idm-llm-instructions.md`).

### 2) Machine-readable IDM spec

- `GET /api/idm-spec` returns JSON with:
  - syntax rules
  - function catalog (name + arity + signature)
  - operator aliases
  - CSV schema for group rules

### 3) Group rule compiler API

- `GET /api/idm-group-rules` returns request schema + examples.
- `POST /api/idm-group-rules` accepts either:
  - JSON rules: `{ "rules": [ ... ], "defaultOutput": "uncategorized" }`
  - CSV text: `{ "csv": "priority,output,match,...", "defaultOutput": "uncategorized" }`

### 4) Validation, formatting, and testing APIs

- `POST /api/idm-validate` validates syntax + rule guardrails and returns `errors` + `warnings`.
- `POST /api/idm-format` formats formulas and canonicalizes aliases.
- `POST /api/idm-test` runs formulas against sample test cases and returns pass/fail results.
- `POST /api/idm-lint` flags maintainability and logic-risk patterns with rule IDs and guidance.

Response includes:
- normalized rules
- per-rule formulas
- one nested master IDM formula

Validation + generation guardrails:
- `forEach` argument 3 should be URL-encoded logic (`%7B%7B...%7D%7D`).
- String literals do not support raw double quotes.
- Explicit fallback output is required for nested `if` chains.
- Limits: max 200 rules per request, max 100 conditions per rule.

#### Example JSON request

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

## Architecture

Formula Studio is architected as a static **Single Page Application (SPA)**. This design choice highlights a commitment to security, speed, and reliability.

### 1. Zero-Latency Execution
Logic is parsed and evaluated entirely within the client's browser using a custom recursive descent parser. There are no server round-trips for syntax checking. This ensures that visual feedback is instantaneous—key to a "flow state" developer experience. 

### 2. "Air-Gapped" Security
Because the application requires no active backend, it is effectively air-gapped from the perspective of data storage. 
- **No Database**: There is no central database to breach.
- **No Data Exfiltration**: User data (formulas and test inputs) never leaves the browser session.
- **Enterprise Ready**: This "static asset" model is the gold standard for secure internal tooling, as it eliminates entire classes of server-side vulnerabilities.

### 3. Distributed Computing
By offloading the computational work of traversing ASTs (Abstract Syntax Trees) to the client, the application scales effortlessly. Whether one user or ten thousand users are debugging complex formulas simultaneously, performance remains constant and degradation-free.

## License

### MIT License

Copyright (c) 2026 Tom Léger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
