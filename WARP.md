# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Install dependencies

- `npm install`

### Run the app (Vite dev server)

- `npm run dev`
  - Starts the Vite development server with hot reload (default port 5173).

### Build & preview

- `npm run build`
  - Builds the production bundle using Vite.
- `npm run preview`
  - Serves the built app locally for a production-like preview.

### Linting

- `npm run lint`
  - Runs ESLint using the flat config in `eslint.config.js` over all `*.js`/`*.jsx` files.
  - `dist/` is globally ignored via `globalIgnores`.

### Tests (Vitest)

- `npm run test`
  - Runs the Vitest suite once (`vitest run`).
- `npx vitest`
  - Runs Vitest in watch/interactive mode.
- `npx vitest src/lib/parser.test.js`
  - Runs only the parser tests.
- `npx vitest src/lib/parser.test.js -t "parses a simple if-equals statement"`
  - Runs a single test case by name within the parser test file.

## Architecture

### High-level structure

- Single-page React application built with Vite.
- Three primary workspaces, controlled by `currentView` state in `src/App.jsx`:
  - `editor` – core formula editor and live visualizer.
  - `training` – guided curriculum with interactive challenges.
  - `docs` – full documentation browser.
- Entry point: `src/main.jsx` mounts `<App />` into `#root` and applies global styles from `src/index.css` and `src/App.css`.

### Core language engine (`src/lib`)

- `src/lib/parser.js`:
  - Exports `tokenize`, `parse`, `stringify`, `prettyStringify`, and `TokenType` for the IDM formula language.
  - Tokenizer:
    - Searches for the first `{{` and last `}}` and tokenizes only that inner region.
    - Recognizes token types: `OPEN_BRACE`, `CLOSE_BRACE`, `KEYWORD`, `STRING`, `NUMBER`, `IDENTIFIER`, `UNKNOWN`.
    - Keyword set: `if`, `equals`, `and`, `or`, `contains`, `not`, `greater`, `concat`, `substr`, `replace`, `len`, `ignoreIfNull`, `forEach`, `in`.
  - Parser (recursive descent):
    - Consumes the token stream in prefix notation and produces an AST with three node shapes:
      - `CallExpression` – `{ type: 'CallExpression', name, arguments, range }`.
      - `StringLiteral` – `{ type: 'StringLiteral', value, range }`.
      - `Identifier` – `{ type: 'Identifier', value, range }`.
    - Each node tracks a `range: [start, end]` (indices into the input string) for fine-grained highlighting and mapping back to the source formula.
    - Handles empty wrappers (`{{}}`) by returning `null`.
  - Stringifiers:
    - `stringify(ast)` converts the AST back to a single-line prefix expression (no surrounding `{{ }}`).
    - `prettyStringify(ast)` formats nested calls with indentation, always expanding `if` expressions and any call that contains nested calls onto multiple lines.

- `src/lib/parser.test.js`:
  - Vitest suite validating the parser and stringifiers:
    - Simple and nested `if`/`equals` expressions.
    - Logical composition with `and`/`or`.
    - Extended functions like `ignoreIfNull`, `greater`, `len`.
    - Pretty-printing structure (newline and indentation expectations).
    - Range tracking for literals, identifiers, and nested call expressions.

- `src/lib/examples.js`:
  - Uses `import.meta.glob('../examples/*.md', { query: '?raw', eager: true })` to import all example markdown files at build time.
  - `getExamples()`:
    - Derives an example `name` from the filename (e.g., `../examples/1.md` → `"1"`).
    - Extracts the formula as the substring between the first `{{` and the last `}}` in each markdown file.
    - Classifies the example as:
      - `type: 'GROUP'` if the whitespace-stripped formula starts with `{{forEach`.
      - Otherwise `type: 'OU'`.

- `src/lib/quizData.js`:
  - Defines the IDM training curriculum consumed by the Training Center.
  - Organized as `CURRICULUM: Chapter[]`, where each chapter has:
    - `id`, `title`, `description`.
    - `steps: Step[]` where each step is a `lesson` or `challenge`.
  - Challenge steps specify:
    - `goal`, `description`, `prefill`, `hints`.
    - `testCases: [{ name, data, expected }]` which are used to automatically grade user formulas.

### UI composition (`src`)

- `src/App.jsx`:
  - Top-level React component that owns application-wide view and editor state.
  - View switching:
    - `currentView` in `{ 'editor', 'training', 'docs' }` is controlled by `NavBar` and determines which workspace is rendered.
  - Editor state:
    - `logicMode` in `{ 'OU', 'GROUP' }` selects between OU-style logic and group/forEach logic and filters available examples accordingly.
    - `formula` holds the raw IDM formula string shown in the editor textarea.
    - `selectedExample` tracks the name of the loaded example, cleared whenever the user edits the formula manually.
    - `showQuickDocs` toggles the inline reference overlay (`DocsLayout`).
  - Parsing pipeline (via `useMemo` on `formula`):
    - Tokenizes and parses the current formula with `tokenize` and `parse`.
    - Produces `{ ast, error, stats }` where `stats` includes `chars` and `lines`.
    - Any tokenizer/parser exception is caught and exposed via `error`, while `stats` are still computed.
  - Editor actions:
    - `Format` button:
      - Calls `prettyStringify(ast)` and wraps the result with `{{` / `}}`, replacing the current `formula`.
    - `New Formula` button:
      - Resets the editor to `{{}}` and clears `selectedExample`.
    - Example dropdown:
      - Uses `getExamples()` to populate options, filtered by `logicMode`.
      - Selecting an example sets `formula`, `selectedExample`, and `logicMode` based on the example metadata.
    - Mode toggle (`OU Logic` / `Group Logic`):
      - Changes `logicMode`, clears the editor to `{{}}`, and resets `selectedExample`.
  - Layout when `currentView === 'editor'`:
    - Left panel: raw formula textarea with stats and example loader.
    - Right panel: `<FormulaVisualizer ast={ast} error={error} mode={logicMode} />`.
    - Optional `DocsLayout` overlay for quick reference.
  - When `currentView === 'training'` renders `<TrainingCenter />`.
  - When `currentView === 'docs'` renders `<RefactoredDocs />`.

- `src/main.jsx`:
  - Standard React bootstrap calling `createRoot(...).render(<App />)` inside `React.StrictMode`.

- Styling:
  - `src/index.css` and `src/App.css` define layout, colors, and typography for the editor, visualizer, training workspace, and docs UI.

### Visualization system (`src/components/FormulaVisualizer.jsx`)

- Responsible for translating the parser AST into rich visual representations of IDM logic for both OU and Group modes.

- Helpers and core algorithms:
  - `flattenConcat(node)`:
    - Flattens nested `concat` calls so the visualizer can treat them as a single linear "string-building" stream.
  - `expandLogicPaths(node)`:
    - Expands a node into all possible execution paths (scenarios), returning an array of `{ valueParts: Node[], conditions: Node[] }`.
    - For literals/identifiers: produces a single path with that node as the only `valuePart`.
    - For `concat`: computes the cartesian product of paths for each argument so each scenario shows the full concatenated output.
    - For `if`:
      - True-branch scenarios are tagged with the condition node.
      - False-branch scenarios are tagged with either:
        - Nested `if` conditions (if the else branch is another `if`), or
        - A synthetic `{ type: 'Default', value: 'Start' }` condition to indicate a catch-all else leaf.
  - `hasNestedLogic(node)`:
    - Detects whether a subtree contains any `if` calls (used to decide between simple and scenario views).
  - `segmentLogicChain(node)`:
    - Treats a top-level `if`/`else if` chain as a sequence of rows.
    - Groups rows that share a simple `equals` condition on the same identifier (e.g., multiple checks on `staff.title`) into table-like segments.
    - Emits an array of segments:
      - `{ type: 'table', rows, commonField }` for mapping-table friendly chains.
      - `{ type: 'tree', node }` for arbitrary or mixed-condition logic.

- Key components:
  - `LogicScenariosView`:
    - Uses `expandLogicPaths` to render scenario cards, each showing:
      - A "Group Name Pattern" (the flattened `valueParts`).
      - A "Requires" list built from `conditions`, including catch-all cases.
  - `ConditionView`:
    - Renders conditions with domain-specific formatting:
      - `and` – flattened into a stacked "All Required" block.
      - `or` – flattened into a "Matches One Of" tag list.
      - `equals` – shown inline as `Field = Value` with `CleanValue` rendering for literals.
      - `in` / `contains` – shown as `Field IN Value` with truncation.
      - `Default` – displayed as a "Catch All" / fallback condition.
  - `CleanValue`:
    - Renders empty strings as an explicit `(Empty)` marker and otherwise delegates to `NodeView` for non-literals.
  - `SmartSegment`:
    - For table-style segments:
      - Renders a two-column table: "If {commonField} is..." → target result (e.g., OU or group name).
    - For complex segments:
      - Renders `RuleCard` components listing each rule's target value and its conditions.

- Modes:
  - OU mode (default):
    - `FormulaVisualizer` calls `segmentLogicChain(ast)` and renders each segment via `SmartSegment` inside a `view-mode-container`.
  - GROUP mode:
    - Handled by `GroupLogicView`.
    - Expects a top-level `forEach` call with arguments `[varNameNode, listNode, logicNode]`.
    - Uses `FormulaContext` to highlight identifiers corresponding to the loop variable in nested expressions.
    - If `logicNode` is a `StringLiteral`, it is URL-decoded and re-parsed with `tokenize` + `parse` to produce an inner AST.
    - Inner AST segments are rendered via the same `SmartSegment` infrastructure with target label "Target Group".

### Training system (`src/components/TrainingCenter.jsx`, `src/components/QuizLevel.jsx`)

- `src/components/TrainingCenter.jsx`:
  - Hosts the IDM curriculum UI.
  - Tracks `activeChapterIndex`, `activeStepIndex`, and `completedSteps`.
  - Locks chapter N until the last step of chapter N−1 is complete (based on step IDs in `CURRICULUM`).
  - Sidebar:
    - Lists chapters with number/"✓" indicators and a per-chapter progress bar derived from completed steps.
  - Main area:
    - Shows breadcrumbs and renders the active step via `<QuizLevel>`.

- `src/components/QuizLevel.jsx`:
  - Step types:
    - `lesson` – static content pages with simple markdown-like formatting (bold and inline code) plus optional example blocks.
    - `challenge` – interactive exercises where users type formulas and receive immediate feedback.
  - Evaluation flow for challenges:
    - Maintains `formula`, `results`, `visibleHints`, and `selectedCaseIndex`.
    - On initialization, uses `level.prefill` (if provided) or `"{{}}"` as the starting formula.
    - On formula change:
      - Tokenizes and parses the formula.
      - Evaluates the resulting AST against each `testCase.data` using a local `evaluateAst` helper.
      - Compares the computed value to `testCase.expected` and records `isCorrect` / `error` per test case.
    - `evaluateAst` implements a subset of the language for training:
      - `concat`, `if`, `equals`, `greater`, `len`, `substr`, `replace`, `ignoreIfNull`.
      - Identifiers resolve via dot notation into the provided JSON `data`.
    - When all test cases for a step are correct, calls `onComplete()`; navigation buttons handle Next/Back/Skip.
  - UI:
    - Editor textarea for the formula, hints reveal, JSON reference data panel, and per-test result list.

### Documentation system (`src/components/RefactoredDocs.jsx`, `src/components/DocsLayout.jsx`, `src/components/docs/*`)

- `src/components/RefactoredDocs.jsx` ("Full Docs" view):
  - Activated when `currentView === 'docs'` in `App.jsx`.
  - Uses `NAV_STRUCTURE` to organize documentation into sections:
    - Getting Started, Core Concepts, Functions, forEach, Reference, Learn, Help.
  - Renders individual doc pages from `src/components/docs/*`:
    - `DocsIntro`, `DocsSyntax`, `DocsVariables`, `DocsLiterals`, `DocsFunctions`, `DocsArity`, `DocsNesting`, `DocsFields`, `DocsTextTransform`, `DocsTextExtraction`, `DocsSearchReplace`, `DocsMathDates`, `DocsLogic`, `DocsUtilities`, `DocsExamples`, `DocsForEachOverview`, `DocsForEachEncoder`, `DocsForEachAdvanced`, `DocsTroubleshooting`, `DocsComplex`.
  - Integrates `functionData.js`:
    - Categories like `TEXT_TRANSFORM_OPS`, `TEXT_EXTRACTION_OPS`, `SEARCH_REPLACE_OPS`, `MATH_DATE_OPS`, `LOGIC_OPS`, `UTILITY_OPS` drive sidebar sub-items and in-page anchors.
    - Clicking a function name in the sidebar sets the relevant doc as active and scrolls to the function's section by `id`.

- `src/components/DocsLayout.jsx` ("Quick Reference" overlay):
  - Shown from the Editor via the "Quick Reference" button.
  - Modal overlay with its own sidebar, focusing on a smaller subset of topics:
    - Introduction, Syntax Guide, Supported Fields, Common Operations, Complex Mods.

- `src/components/docs/functionData.js`:
  - Central function metadata used by multiple docs pages.
  - Defines function names, syntax, arity, descriptions, and illustrative examples.
  - Includes higher-level functions such as `toLower`, `toUpper`, `alphanumeric`, `initials`, etc.
  - At present, some of these functions exist only in documentation: they are **not** yet included in the parser's `KEYWORDS` set or the training evaluator's `evaluateAst` implementation. Any work that adds these functions to the language should update all three of:
    - `KEYWORDS` and arity handling in `src/lib/parser.js`.
    - Evaluation logic in `src/components/QuizLevel.jsx`.
    - Docs metadata in `src/components/docs/functionData.js` (if syntax/behavior changes).

### Navigation and shared components

- `src/components/NavBar.jsx`:
  - Top navigation bar that displays branding and toggles between `editor`, `training`, and `docs` views via `onViewChange`.

- `src/components/LogicEditor.jsx`:
  - Optional alternative to the plain `<textarea>` editor.
  - Implements a two-layer editor (text area + backdrop) with synchronized scroll and an optional `highlightRange` overlay, matching text segments to AST ranges from `parser.js`.
  - Accepts `value`, `onChange`, `highlightRange`, and `placeholder` props.

### Examples and sample content

- `src/examples/*.md`:
  - Markdown files that contain sample IDM formulas and contextual text.
  - `getExamples()` assumes the canonical formula is everything between the first `{{` and the last `}}` in each file; edits to these examples should preserve that structure.
  - Filenames (without `.md`) become example `name`s and are used in the editor's example dropdown.

- `src/assets/react.svg` and CSS files in `src/App.css` / `src/index.css`:
  - Provide branding and layout for the IDE-like experience and do not affect the core language semantics.

### License

- The project uses the **Léger Equity & Attribution License (LEAL) v1.0**, as documented in `README.md`.
- Any substantial use must attribute **Tom Léger**, and the license includes additional employer-specific compensation/title clauses; refer to the README's License section for the authoritative text.
