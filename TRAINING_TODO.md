# Training Program - Open Issues & TODO

A brainstorming space for training curriculum improvements and open issues.

---

## 🔴 Function Introduction Consistency Issues

### The "Gold Standard" Pattern (from Ch4 S4 - `replace`)
When introducing a new function, the ideal pattern includes:
1. **Title prefix**: `"Concept: ..."` or `"New Tool: ..."`
2. **New Tool label**: `**New Tool: \`functionName\`** (Arity N)`
3. **Syntax shown**: `` `{{ function arg1 arg2 }}` ``
4. **Arity mentioned**: Explicitly state the arity
5. **Analogy/metaphor**: Help learner connect to familiar concepts
6. **Challenge marker**: `**Challenge:**` before the task

### ❌ Chapter 2 Needs Fixes (First 4 functions)

These are the first functions introduced, before the pattern was established:

#### Ch2 S1: `toUpper` - PROPOSED FIX
**Current:**
> Functions are the **Verbs** of code...
> Use the `toUpper` function (verb) to turn the text "hello" (data) into "HELLO".

**Proposed:**
> Functions are the **Verbs** of code. There are only about 30 of them, and each one does a specific, unique job.
>
> **New Tool: `toUpper`** (Arity 1)
>
> `{{ toUpper text }}`
>
> Converts all letters to UPPERCASE. Think of it like the CAPS LOCK key on a keyboard.
>
> **Challenge:**
> Use `toUpper` to turn the text "hello" into "HELLO".

---

#### Ch2 S2: `length` - PROPOSED FIX
**Current:**
> The input you give to the magic word (Function) is called an **Argument**...
> The `length` function takes one Argument. Use it to count the letters.

**Proposed:**
> The input you give to a function is called an **Argument**.
>
> **New Tool: `length`** (Arity 1)
>
> `{{ length text }}`
>
> Counts the number of characters in text. Like counting letters on a Scrabble board.
>
> **Challenge:**
> Use `length` to count the letters in the word "argument".

---

#### Ch2 S3: `toLower` - PROPOSED FIX
**Current:**
> Arguments don't have to be just strings... The `toLower` function takes **1 Argument**.
> Use the `toLower` function on the `name.first` variable.

**Proposed:**
> Arguments can also be **Variables** (Fields from your data).
>
> **New Tool: `toLower`** (Arity 1)
>
> `{{ toLower text }}`
>
> Converts all letters to lowercase. The opposite of `toUpper`.
>
> **Challenge:**
> Use `toLower` on the `name.first` variable to lowercase the first name.

---

#### Ch2 S4: `concat` - PROPOSED FIX
**Current:**
> Some functions need more than one argument.
> The `concat` (concatenate) function joins two things together.
> `{{ concat arg1 arg2 }}`

**Proposed:**
> Some functions need more than one argument.
>
> **New Tool: `concat`** (Arity 2)
>
> `{{ concat text1 text2 }}`
>
> Short for "concatenate" - it glues two pieces of text together. Like taping two pieces of paper end-to-end.
>
> **Challenge:**
> Use `concat` to join "Super" and "Man" together.

---

### ⚠️ Chapter 3 Needs Minor Fixes

These have "New Tool:" titles but are **missing the bold label and arity in the description body**:

#### Ch3 S3: `initials` - ADD TO DESCRIPTION
```
**New Tool: `initials`** (Arity 1)

`{{ initials text }}`
```

#### Ch3 S5: `substr` - ADD TO DESCRIPTION  
```
**New Tool: `substr`** (Arity 3)

`{{ substr text start length }}`
```

---

### ⚠️ Chapter 4 Needs Minor Fixes

These have bold labels but are **missing syntax and/or arity**:

#### Ch4 S2: `trimLeft` - ADD SYNTAX + ARITY
```
**New Tool: `trimLeft`** (Arity 1)

`{{ trimLeft text }}`
```

#### Ch4 S3: `alphanumeric` - ADD SYNTAX + ARITY
```
**New Tool: `alphanumeric`** (Arity 1)

`{{ alphanumeric text }}`
```

---

### ⚠️ Chapter 5 Title Fixes

These steps introduce NEW functions but use misleading "Practice:" prefixes:

| Step | Current Title | Proposed Title |
|------|---------------|----------------|
| Ch5 S5 | "Practice: Strict Comparisons" | "Concept: Greater Than" |
| Ch5 S7 | "Practice: Short Text" | "Concept: Less Than" |
| Ch5 S8 | "Practice: Character Limit" | "Concept: Less or Equal" |

**Rule:** When introducing a NEW function, title should start with "Concept:" or "New Tool:", not "Practice:" or "Refresher:".

---

## 🔴 Missing Functions - Placement Proposals

### `in` - Add to Chapter 6 (Easy Win)

**What it does:** `{{in student.grade "09 10 11 12"}}` → checks if value is in a space-separated list

**Proposed location:** Chapter 6, after `contains` (currently S12)

**Insert as S13-S14 (shift existing steps):**

| Step | Title | Type | Description |
|------|-------|------|-------------|
| S13 | "Concept: List Membership" | NEW TOOL | Introduce `in` - checks if value is in a list |
| S14 | "Practice: Grade Bands" | PRACTICE | Check if student is in High School grades |

**Example data:**
```javascript
{
  "student": { "grade": "11", "department": "Math", "status": "Active" }
}
```

**Teaching angle:**
- `contains` checks if text is INSIDE another text ("@" in email)
- `in` checks if a value MATCHES one of several options
- "Is this student in High School?" → `{{in student.grade "09 10 11 12"}}`

---

### `forEach` - New Chapter 11: Working with Lists

**Why a new chapter?** 
- Current training has ZERO array data
- Need to teach what arrays ARE before using them
- URL-encoding for nested braces is complex
- Loops are a fundamentally new concept

**Chapter 11: Working with Lists** (15 steps)

#### Part 1: Understanding Lists (Steps 1-4)

| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S1 | "Meet the List" | OBSERVE | Show data with an array, explain what `[]` means |
| S2 | "Lists vs Objects" | CONCEPT | Compare `schools: [...]` vs `school: {...}` |
| S3 | "What's Inside?" | OBSERVE | Show how list items have their own properties |
| S4 | "The Problem" | CONCEPT | "What if we need to output EACH school's name?" |

**Example data for Part 1:**
```javascript
{
  "student": {
    "name": "Jean-Luc",
    "schools": [
      { "name": "Starfleet Academy", "year": "2023" },
      { "name": "Command School", "year": "2024" }
    ]
  }
}
```

#### Part 2: Meet forEach (Steps 5-10)

| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S5 | "The Loop Concept" | CONCEPT | Explain: "Do THIS for EACH item in the list" |
| S6 | "Meet forEach" | NEW TOOL | Introduce `{{forEach "item" list "logic"}}` |
| S7 | "The Variable Name" | CONCEPT | Explain first arg creates a temp variable |
| S8 | "The List" | CONCEPT | Explain second arg is the list to loop over |
| S9 | "The Logic" | CONCEPT | Explain third arg is what to do with each item |
| S10 | "URL Encoding" | CONCEPT | Explain why we need `%7B%7B` instead of `{{` |

**First example (pre-filled, just run):**
```
{{forEach "s" student.schools "%7B%7Bs.name%7D%7D"}}
```
→ Outputs: "Starfleet Academy", "Command School"

#### Part 3: Practice forEach (Steps 11-15)

| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S11 | "Your First Loop" | MODIFY | Change pre-filled to output `s.year` instead |
| S12 | "Write a Loop" | WRITE | Write forEach from scratch for course names |
| S13 | "Combining Fields" | PRACTICE | Output "name (year)" for each school |
| S14 | "Loop with Functions" | PRACTICE | Use `toUpper` inside the loop logic |
| S15 | "Chapter 11 Final Exam" | EXAM | Complex loop with formatting |

**Additional example data for Part 3:**
```javascript
{
  "student": {
    "name": "Jean-Luc",
    "schools": [
      { "name": "Starfleet Academy", "year": "2023" },
      { "name": "Command School", "year": "2024" }
    ],
    "courses": ["Navigation", "Tactics", "Diplomacy"]
  }
}
```

---

**Total Chapter 11 Steps:** 15
**Prerequisites:** Chapters 1-6 minimum (data access, functions, logic)
**Difficulty:** HIGH - Brand new concepts, URL encoding, temp variables

---

## 🟡 Open Questions

- Should we add training for `in` and `forEach`, or keep them as "advanced reference only"?
- Is Chapter 2 trying to do too much? Currently introduces 4 functions in 4 steps before any reinforcement.

---

## 🟢 Ideas for Improvement

### Prefix Notation: Teach the Concept, Not the Jargon

**Problem:** The term "Prefix Notation" is used extensively in `/docs/*` but is NEVER mentioned in training (Chapters 1-10). Learners who finish training and read docs may be confused.

**Recommendation:** Two-phase approach:

**Phase 1 - Early Chapter 2:** Introduce the CONCEPT without the jargon:
> "In IDM formulas, we always write: **function first, then what it works on.**
> 
> `{{ toUpper "hello" }}`
> 
> Think of it like giving a command: 'SHOUT this!' not 'this! SHOUT'"

**Phase 2 - Later (Chapter 3 or when nesting gets complex):** Name it:
> "💡 *Fun fact: This 'function first' style has a name: **Prefix Notation**. You'll see this term in the Documentation.*"

---

### Chapter 2 Restructure Proposal

**Problem:** Chapter 2 introduces 4 new functions in 4 consecutive steps before ANY reinforcement practice. This is cognitively overwhelming for non-coders.

**Solution:** Use a "soft intro → modify → write → practice" pattern for each function. Don't be afraid to add steps!

#### Proposed New Step Structure:

**`toUpper` Block (Steps 1-4)**
| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S1 | "Meet Your First Function" | OBSERVE | Pre-filled `{{ toUpper "hello" }}` - just hit Run |
| S2 | "Change the Input" | MODIFY | Change "hello" to "world" in pre-filled code |
| S3 | "Write It Yourself" | WRITE | Write `{{ toUpper "goodbye" }}` from scratch |
| S4 | "Functions on Variables" | PRACTICE | Use `toUpper` on `name.first` |

**`toLower` Block (Steps 5-7)**
| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S5 | "The Opposite: toLower" | NEW TOOL | Introduce toLower, write one |
| S6 | "Practice: toLower" | PRACTICE | Use on a variable |
| S7 | "toUpper vs toLower" | PRACTICE | Choose the right one for a scenario |

**`length` Block (Steps 8-10)**
| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S8 | "Counting Characters" | NEW TOOL | Introduce length concept |
| S9 | "Practice: length" | PRACTICE | Count chars in a name |
| S10 | "Why Length Matters" | PRACTICE | Real-world use case (validation) |

**`concat` Block (Steps 11-15)**
| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S11 | "Joining Text" | NEW TOOL | Intro concat (Arity 2) |
| S12 | "Variable Concatenation" | PRACTICE | Join first + last |
| S13 | "The Space Problem" | PRACTICE | Add space between words |
| S14 | "Mixed Arguments" | PRACTICE | String + Variable |
| S15 | "Final Exam: Full Name" | EXAM | First + " " + Last |

**Nesting (Steps 16-18)** - Move to Chapter 3 OR...
| Step | Title | Type | What Happens |
|------|-------|------|--------------|
| S16 | "Functions Inside Functions" | CONCEPT | Intro nesting |
| S17 | "Inner Nesting Practice" | PRACTICE | `toUpper` inside `concat` |
| S18 | "Chapter 2 Final Exam" | EXAM | Combined challenge |

---

**Total Steps:** ~18 (currently 10)
**Trade-off:** More steps, but learners will actually understand each function before moving on.

**Alternative:** If 18 steps feels too long, move Nesting (S16-18) to become the START of Chapter 3.



---

## 📊 Current Coverage

| Category | Functions | Covered in Training |
|----------|-----------|---------------------|
| Logic | 11 | 10 (missing: `in`) |
| Text Transform | 7 | 7 ✅ |
| Math/Date | 3 | 3 ✅ |
| Utility | 4 | 3 (missing: `forEach`) |
| Text Extraction | 3 | 3 ✅ |
| Search/Replace | 1 | 1 ✅ |
| **Total** | **29** | **27** |

---

## 📝 Notes

<!-- General notes and observations -->

