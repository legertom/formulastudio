# Chapter 6 Briefing: Advanced Logic

**Current Status:**
*   **Chapter 5 (Basic Logic)** is complete. It covers `if`, `equals`, `greater`, `less`, `geq`, `leq`.
*   **Next Step:** Chapter 6 should cover **Advanced Logic** (`and`, `or`, `not`, `contains`).

## Required Reading
The following document contains critical pedagogical and technical rules that **MUST** be followed:
*   [Curriculum Design Patterns](design_patterns.md)
    *   *Pay attention to:* "Boolean First", "Arity Visibility", and "Parser Checks".

## Goal
Implement a ~10-step curriculum for **Chapter 6: Advanced Logic**.

## Required Patterns (from Design Patterns)

### 1. The "Logic Gate" Progression
Since we are dealing with Boolean Logic:
*   **Refresher**: Start with `if` (from Ch 5).
*   **Concept**: Introduce `and` / `or` as ways to combine Booleans.
*   **Practice**: Use "Complex Access Control" (e.g. Admin AND Active).

### 2. Explicit Arity
*   **Rule**: Every time you introduce a tool, write `**New Tool: name** (Arity X)`.
*   `and` = Arity 2
*   `or` = Arity 2
*   `not` = Arity 1

### 3. The "Golden Template"
*   **Rule**: Use **Chapter 5** as your structural guide. It correctly implements:
    *   Explicit Arity in Titles.
    *   Step Flow (Refresher -> Concept -> Practice).
    *   Test Case formatting.
*   **Reference File**: `src/lib/curriculum/chapter5.js`

### 4. The "New Function" Protocol
*   **CRITICAL**: Before writing the chapter, check if `and`, `or`, `not`, `contains` are in `KEYWORDS` in `src/lib/parser.js`.
*   **CRITICAL**: Check if their logic is in `evaluateAst` in `src/lib/quizUtils.jsx`.
*   (Note: I believe `and`/`or`/`not` are partially there, but double check `contains`).

## Proposed Flow (Template)
1.  **Refresher**: `if` (Basic check).
2.  **Concept**: `and` (Checking two things).
3.  **Practice**: Access Control (Role AND Status).
4.  **Concept**: `or` (Multiple valid options).
5.  **Practice**: Flexible Entry (Ticket OR Pass).
6.  **Concept**: `not` (Negation).
7.  **Practice**: Exclusion Lists.
8.  **Advanced**: `contains` (Checking substrings - creates a Boolean!).
9.  **The Chain**: Nested `and`/`or` (e.g. `(A and B) or C`).
10. **Final Exam**: Complex Validation (e.g. Password rules: Long enough AND contains special char).

## Key Files
*   `src/lib/parser.js`: **CHECK THIS FIRST** for keywords.
*   `src/lib/quizUtils.jsx`: **CHECK THIS SECOND** for evaluation logic.
*   `src/lib/curriculum/chapter6.js`: The file you will create.
*   `src/lib/curriculum/index.js`: Don't forget to import/export the new chapter! (It might be there already).

Good luck, Agent!
