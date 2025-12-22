# Mission Briefing: Chapter 7 (Advanced Parsing & Dates)

## 1. Objectives
Create **Chapter 7** of the curriculum, focusing on **Text Extraction** and **Date Formatting**.
These functions exist in the engine (`quizUtils.jsx`) but are not yet taught.

## 2. New Functions to Teach
You must first register these in `KnowledgeGraph.js` if missing.
*   `textBefore` (Arity 2)
*   `textAfter` (Arity 2)
*   `textAfterLast` (Arity 2)
*   `formatDate` (Arity 2)
*   `subtract` (Arity 2) - *Math refresher*

## 3. Design Requirements (Mandatory)

### A. The Scaffolding Triad
For each new complex function (especially the text extractors), use the scaffold approach:
1.  **Simple**: Extract from a simple literal string.
2.  **Mixed**: Extract from a variable.
3.  **Nested**: Extract, then `trim` or `toUpper`.

### B. The Assembly Line (Final Exam)
The Final Exam should be a complex "Data Parsing Pipeline" (e.g., extracting a name + date from a log file log line).
**Do NOT** ask the user to write the final formula in one step.
**DO** break it down:
1.  **Step X-3**: Extract the Date part.
2.  **Step X-2**: Format the Date part.
3.  **Step X-1**: Extract the Name part.
4.  **Step X**: Combine them into a final report string.

### C. Formatting
Use **Unicode Bullets (•)** for all criteria lists in descriptions.

## 4. Implementation Checklist
1.  [ ] Update `KnowledgeGraph.js` to include the new functions.
2.  [ ] Create `src/lib/curriculum/chapter7.js`.
3.  [ ] Register chapter in `src/lib/curriculum/index.js`.
4.  [ ] Verify all steps in the app.
