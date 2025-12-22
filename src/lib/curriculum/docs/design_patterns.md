# Curriculum Architect: Design Patterns & Learnings

Collected learnings from the implementation of **Chapter 4 (Data Cleaning)** and **Chapter 5 (Basic Logic)**. These patterns should be applied to future chapters.

## 1. Pedagogical Patterns

### The "Chain" Strategy
**Problem:** Binary functions (Arity 2) like `add`, `subtract`, `concat` are limited to 2 inputs.
**Solution:** Explicitly teach "Chaining" to handle $N$ inputs.
**Example:** `add 10 (add 20 30)`
**Guideline:** When introducing a binary math/logic function, always include a "Chain Challenge" step (e.g. "Add 5 numbers").

### "Glitch Data" Scenarios
**Problem:** Users can simply type literal answers instead of using data.
**Solution:** Force interaction by including "broken" data that *must* be processed.
**Example:** A field `glitch: "ten"` that requires `replace glitch "ten" "10"` to be usable in math.
**Guideline:** Use "dirty" data to force function usage.

### The "Data Janitor" Theme
**Concept:** Framing string manipulation as "cleaning" or "sanitizing" is highly effective.
**Progression:**
1.  **Inspector**: Check `len` or analyze the bad data.
2.  **Tools**: Introduce `trim`, `replace`, etc.
3.  **The Fix**: Combine tools to clean a specific field.

### "Boolean First" (Logic)
**Concept:** Before teaching `if`, you must teach the *input* to `if`.
**Guideline:**
1.  **Refresher**: Teach `equals` (or other comparator) first.
2.  **Explicit Naming**: Explicitly state that it returns a "Boolean" (`true`/`false`).
3.  **Concept**: Only then introduce `if` as a function that "eats a Boolean".

### The "Comparison Suite"
**Pattern:** When teaching comparators, teach them in pairs of Strict vs Inclusive.
1.  **Strict**: `greater` / `less` (Concept + Practice).
2.  **Inclusive**: `geq` / `leq`.
    *   **Illustration**: Show `{{ geq a b }}` is equivalent to `{{ greater a b }}`.

## 2. Technical & Layout Rules

### "Workbench" Layout
For chapters involving complex JSON data or debugging:
*   **Reference Data:** MUST be Full Width at the top (to show deep nesting).
*   **Editor & Results:** Side-by-side below.
*   **Why:** prevents scrolling up/down to compare Data vs Formula.

### Parser "Hungry Function" Explanation
**Concept:** IDM does not use parentheses.
**Explanation:** Functions are "Hungry" and eat exactly their Arity worth of tokens.
**Visual:** "Slots" that get filled. `replace [1] [2] [3]`.

### Arity Visibility
**Rule:** When introducing a new tool, **ALWAYS** state its Arity immediately in the description title.
*   **Good:** `**New Tool: geq** (Arity 2)`
*   **Bad:** `**New Tool: geq**`

### The "New Function" Checklist
**Rule:** If you add a function to `KnowledgeGraph.js` that doesn't exist in the app yet:
1.  **Update Parser**: Add it to `KEYWORDS` in `src/lib/parser.js` and set its Arity switch case.
2.  **Update Evaluator**: Add its logic to `evaluateAst` in `src/lib/quizUtils.jsx`.
3.  **Visual Check**: Verify it renders correctly.

## 3. Chapter Structure Template
A standard chapter should follow this ~10 step flow:
1.  **Refresher**: Easy win using a known concept (e.g. `len`, `equals`).
2.  **New Concept A** (Intro): Simple Arity 1/2 usage.
3.  **Practice A**: Applied usage.
4.  **New Concept B** (Intro).
5.  **Practice B**.
6.  **Combination/Nesting**: Combining A + B.
7.  **Reinforcement**: An old concept used in a new way.
8.  **The "Chain"** (if applicable): N-ary complexity.
73: 9.  **Master Challenge (Final Exam)**: All concepts, dirty data, multi-step solution.
74: 
75: ## 4. Learnings from Chapter 6 (Advanced Logic)
76: 
77: ### The Scaffolding Triad
78: **Problem:** Jumping straight to nested logic (e.g., `and (eq A B) (eq C D)`) is too hard.
79: **Solution:** Teach in 3 steps:
80: 1.  **Concept (Simple)**: `and true true` (Pure booleans, focus on structure).
81: 2.  **Concept (Mixed)**: `and (eq A B) true` (Bridge gap).
82: 3.  **Practice (Nested)**: `and (eq A B) (eq C D)` (Real usage).
83: 
84: ### The Assembly Line (Final Exam)
85: **Problem:** "Final Exams" that require writing 8+ functions from scratch cause panic.
86: **Solution:** Decompose the exam into "Unit Tests".
87: 1.  **Part A**: Build the first condition (e.g. `len > 8`).
88: 2.  **Part B**: Build the second condition.
89: 3.  **Merge**: Combine A + B.
90: 4.  **Final**: Wrap the merged logic in the final `if`.
9.  **Master Challenge (Final Exam)**: All concepts, dirty data, multi-step solution.

## 4. Learnings from Chapter 6 (Advanced Logic)

### The Scaffolding Triad
**Problem:** Jumping straight to nested logic (e.g., `and (eq A B) (eq C D)`) is too hard.
**Solution:** Teach in 3 steps:
1.  **Concept (Simple)**: `and true true` (Pure booleans, focus on structure).
2.  **Concept (Mixed)**: `and (eq A B) true` (Bridge gap).
3.  **Practice (Nested)**: `and (eq A B) (eq C D)` (Real usage).

### The Assembly Line (Final Exam)
**Problem:** "Final Exams" that require writing 8+ functions from scratch cause panic.
**Solution:** Decompose the exam into "Unit Tests".
1.  **Part A**: Build the first condition (e.g. `len > 8`).
2.  **Part B**: Build the second condition.
3.  **Merge**: Combine A + B.
4.  **Final**: Wrap the merged logic in the final `if`.

### Formatting: Unicode Lists
**Problem:** Standard Markdown lists (`*` or `-`) generally are not supported in the quiz description renderer.
**Solution:** Use **Unicode Bullets (•)** with hard line breaks for criteria lists.
```text
• Criteria A
• Criteria B
```

## 5. Critical Rules for Curriculum Maintenance

### ⚠️ NEVER MODIFY FINAL EXAMS
**CRITICAL:** Final exam questions are tied to the user's work curriculum and MUST remain stable.
- Do NOT change the goal, test cases, or expected outputs of any "Final Exam" step
- Do NOT change the step ID of final exam questions
- If you need to add content, add NEW steps BEFORE the final exam
- Final exams are sacred - they are the assessment checkpoints that must remain consistent

### Chapter 7 Pattern: Nested Logic
**Final Exam:** Three-way decision using nested `if` statements (Graduation Status: New/Former/Current Student)

**Required Skills:**
1. Nested If Statements (core skill)
2. Equals Comparisons
3. Dot Notation for nested data
4. Understanding check order matters

**Recommended Progression (8 steps before final):**
1. **Refresher**: Simple if/else review
2. **Concept**: Introduce else-if pattern structure
3. **Practice**: Three-way choice with booleans
4. **Practice**: Three-way choice with `equals`
5. **Concept**: Order matters demonstration
6. **Practice**: Numeric comparisons with nested if
7. **Practice**: Dot notation + nested logic
8. **Reinforcement**: Similar scenario for confidence
9. **Final Exam**: (unchanged)

**Key Insight:** Students need 8 solid practice steps to master nested logic before the final exam.
```
