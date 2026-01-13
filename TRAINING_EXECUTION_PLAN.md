# Training TODO Execution Plan

How to carry out the training curriculum improvements.

---

## 🚀 Execution Strategy

### Phase 1: Quick Wins (Can parallelize)
Low-risk, isolated changes that don't affect each other.

| Task | File(s) | Est. Time | Agent |
|------|---------|-----------|-------|
| Ch3 intro fixes | `chapter3.js` | 5 min | A or B |
| Ch4 intro fixes | `chapter4.js` | 5 min | A or B |
| Ch5 title fixes | `chapter5.js` | 5 min | A or B |

### Phase 2: Chapter 6 Enhancement (Single agent)
Add `in` function - requires careful step renumbering.

| Task | File(s) | Est. Time |
|------|---------|-----------|
| Add `in` steps (S13-S14) | `chapter6.js` | 15 min |
| Renumber existing steps | `chapter6.js` | 10 min |

### Phase 3: Chapter 2 Restructure (Single agent - COMPLEX)
Major rewrite - should NOT be parallelized.

| Task | File(s) | Est. Time |
|------|---------|-----------|
| Backup original | Copy to `chapter2_original.js` | 1 min |
| Write new 18 steps | `chapter2.js` | 45 min |
| Test all steps | Browser | 15 min |

### Phase 4: Reinforcement Steps (Can parallelize after Ch2)
Add practice steps across chapters.

| Task | File(s) | Agent |
|------|---------|-------|
| Add `leq` practice | `chapter7.js` | A |
| Add `toLower` practice | `chapter4.js` | B |
| Add `less`/`geq` practice | `chapter6.js` | A |
| Add `initials` practice | `chapter10.js` | B |

### Phase 5: Chapter 11 (Single agent - NEW CHAPTER)
Create entirely new chapter.

| Task | File(s) | Est. Time |
|------|---------|-----------|
| Create `chapter11.js` | New file | 30 min |
| Register in curriculum index | `index.js` or similar | 5 min |
| Test all 15 steps | Browser | 20 min |

---

## 🔄 Restart Protocol

If the agent crashes, use this checklist to resume:

### Step 1: Check Progress
```
Open TRAINING_TODO.md and look for:
- [ ] Unchecked items = not started
- [/] In progress = may need review
- [x] Checked items = completed
```

### Step 2: Identify Last Completed Task
Ask the agent:
> "Look at TRAINING_TODO.md and tell me what's already done. Resume from where we left off."

### Step 3: Verify No Partial Edits
Before resuming, check the file that was being edited:
```
git diff src/lib/curriculum/chapter*.js
```

If there are uncommitted changes, review them before continuing.

---

## 🔀 Parallel Agent Strategy

### CAN Run in Parallel (Different Files)
- Agent A: Chapter 3 fixes
- Agent B: Chapter 5 fixes

### CANNOT Run in Parallel (Same File or Dependencies)
- Chapter 2 restructure (single file, complex)
- Chapter 6 `in` addition + reinforcement (same file)
- Chapter 11 creation (new file, but test dependencies)

### Recommended Split

**Agent A (Intro Fixes):**
1. Chapter 3 intro fixes
2. Chapter 4 intro fixes  
3. Chapter 5 title fixes

**Agent B (Content Additions):**
1. Chapter 7 `leq` reinforcement
2. Chapter 10 `initials` reinforcement

**Sequential (After both done):**
- Chapter 2 restructure (complex, needs focus)
- Chapter 6 `in` + reinforcement (step renumbering)
- Chapter 11 `forEach` (new chapter)

---

## ✅ Completion Checklist

Mark items as complete in `TRAINING_TODO.md` as you go:

```markdown
- [x] Ch3 intro fixes (initials, substr)
- [x] Ch4 intro fixes (trimLeft, alphanumeric)
- [x] Ch5 title fixes (greater, less, leq)
- [x] Ch6 add `in` function
- [x] Chapter 2 restructure (18 steps)
- [x] Reinforcement: leq in Ch7
- [x] Reinforcement: toLower in Ch4
- [x] Reinforcement: less/geq in Ch6
- [x] Reinforcement: initials in Ch10
- [x] Chapter 11: forEach
```

---

## 🎯 Prompt to Start

Give this to the agent:

> "Read TRAINING_TODO.md and TRAINING_EXECUTION_PLAN.md. Start with Phase 1 quick wins. Update the TODO with [x] marks as you complete each item. If you're unsure about anything, ask before proceeding."

---

## 🎯 Prompt to Resume After Crash

> "Read TRAINING_TODO.md and check which items are marked [x] complete. Resume from the first unchecked item. Verify the last edited file with `git diff` first."
