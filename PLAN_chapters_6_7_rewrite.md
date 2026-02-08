# Plan: Rewrite Chapters 6 & 7

## Guiding Principles (from Curriculum_guidance.md)
- One new concept per step
- Immediate visible results
- Scaffolded complexity (no big leaps)
- Pattern recognition over memorization
- Concrete before abstract
- Frequent wins, short feedback loops
- **NEVER use parentheses in formulas** — IDM formulas don't support them

## Pedagogical Flow: I Do / We Do / You Do (Interactive)
Every section introducing a new tool follows this progression:
- **I Do (Interactive):** Student runs, predicts, or fixes a provided formula. NOT passive reading. Could be:
  - Multiple-choice prediction ("what will this return?")
  - Bug-fix challenge (prefilled formula with a specific error + instructions to fix it)
  - "Run it and observe" with a fully prefilled formula
- **We Do:** Student writes a formula, but with heavy scaffolding — partial prefill, explicit toolbox, one new thing at a time.
- **You Do:** Student writes from a blank `{{}}` with only the toolbox and hints for support.

## Convention: The 🧰 Toolbox
Every step that requires previously-learned functions includes a Toolbox line listing all functions needed:
> 🧰 **Toolbox:** `and` (new!), `equals` (Ch.5), `if` (Ch.5)

## Convention: Prefill Strategy
- **I Do steps:** Prefill with a COMPLETE formula (possibly broken) — student fixes or runs it
- **We Do steps:** Prefill with a PARTIAL formula — student fills in the blank
- **You Do steps:** Prefill with empty `{{}}`

---

# Chapter 6: Advanced Logic

**Functions covered:** `and`, `or`, `not`
**Prerequisite knowledge:** `if`, `equals`, `greater`, `less`, `geq`, `leq` (Ch.5)
**Estimated steps:** ~22

---

## Section A: Warm-Up & Boolean Foundation (Steps 1-4)

Goal: Refresh `if`+`equals`, absorb best nested-if practice from old Ch.7, and solidify what Booleans are.

### Step 1 — Refresher: The If Check
- **Phase:** Warm-up
- **Type:** challenge
- **Goal:** Check if role is "Manager"
- **Description:** Warm up with a standard check. Toolbox: `if`, `equals`
- **Formula:** `{{ if equals role "Manager" "Approved" "Pending" }}`
- **Prefill:** `{{}}`
- **Test cases:** Manager → "Approved", Staff → "Pending"

### Step 2 — What Did Equals Return? ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Goal:** Understand that `equals` returns a Boolean
- **Description:** "In the last step, you wrote `{{ if equals role "Manager" ... }}`. The `equals` function did its job BEFORE `if` made its decision. Let's make sure we understand what `equals` actually produced."
- **Question:** "When the role IS 'Manager', what does `equals role "Manager"` return?"
- **Options:** `"Manager"`, `true`, `"Approved"`, `equals`
- **Correct:** `true`
- **Post-answer context in description:** "That `true`/`false` value is called a **Boolean**. Think of it as a Yes/No answer. Every `if` needs a Boolean to decide which path to take — it's the traffic light."

### Step 3 — Refresher: Three-Way Choice
- **Phase:** Warm-up / We Do
- **Type:** challenge
- **Goal:** Nested `if` with string checks (absorbed from old Ch.7)
- **Description:** "What if there are 3 options instead of 2? You can put an `if` inside the else slot of another `if`." Toolbox: `if`, `equals`
- **Formula:** `{{ if equals tier "Gold" "VIP" if equals tier "Silver" "Member" "Guest" }}`
- **Prefill:** `{{ if equals tier "Gold" "VIP" }}`  ← partial! Student extends it.
- **Test cases:** Gold → "VIP", Silver → "Member", Bronze → "Guest"
- **Notes:** Student gets the first `if` for free, just needs to replace the else value with another `if`. This is "We Do" — heavy scaffolding for a pattern they may have seen in Ch.5 but likely need reinforcement on.

### Step 4 — Three-Way: Your Turn
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Nested `if` independently
- **Description:** "Now build one from scratch." Toolbox: `if`, `equals`
- **Formula:** `{{ if equals dept "Engineering" "Builds" if equals dept "Sales" "Sells" "Supports" }}`
- **Prefill:** `{{}}`
- **Test cases:** Engineering → "Builds", Sales → "Sells", Marketing → "Supports"

---

## Section B: And (Steps 5-11)

### Step 5 — Concept: The Power of And (I Do — Bug Fix)
- **Phase:** I Do (Interactive)
- **Type:** challenge
- **Goal:** Understand what `and` does by fixing a broken formula
- **Description:** "**New Tool: `and`** (Arity 2). `{{ and boolean1 boolean2 }}`. Returns `true` ONLY when BOTH inputs are true. Below is a formula that's supposed to check if the system is `ready` AND `steady` — but it's broken. Fix it!"
- **Prefill:** `{{ or ready steady }}`  ← uses wrong function (`or` instead of `and`)
- **Formula (correct):** `{{ and ready steady }}`
- **Test cases:** Both true → "true", ready+!steady → "false", !ready+steady → "false"
- **Notes:** Student sees a complete formula, understands the structure, just needs to swap one word. Low pressure, high learning. They also see what `or` does wrong here (returns true when only one is true) which primes them for later.

### Step 6 — Predict the And ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Goal:** Predict `and` behavior before writing it
- **Question:** "If `ready` is `true` and `steady` is `false`, what does `{{ and ready steady }}` return?"
- **Options:** `true`, `false`, `"ready"`, `error`
- **Correct:** `false`
- **Description:** "Remember: `and` is strict. BOTH must be true. If even one is false, the whole thing is false."

### Step 7 — We Do: And with One Equals
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Combine `and` with one boolean + one `equals`
- **Description:** "A user must be an `\"Admin\"` AND `active` (boolean). We've started the formula — fill in the missing `equals` check." Toolbox: `and` (new!), `equals` (Ch.5)
- **Prefill:** `{{ and _____ active }}`  ← student fills the blank with `equals role "Admin"`
- **Formula:** `{{ and equals role "Admin" active }}`
- **Test cases:** Admin+active → "true", Admin+!active → "false", Staff+active → "false"
- **Hints:** ["Replace _____ with an equals check", "equals role \"Admin\"", "{{ and equals role \"Admin\" active }}"]
- **Notes:** BRIDGE STEP. One side is a bare boolean, one side needs `equals`. The partial prefill shows the structure.

### Step 8 — We Do: And with Two Equals
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Both sides of `and` need `equals`
- **Description:** "Now BOTH checks need `equals`. Check if role is `\"Admin\"` AND status is `\"Active\"`. You need TWO `equals` — one for each check." Toolbox: `and`, `equals`
- **Prefill:** `{{ and equals role "Admin" }}`  ← student needs to add the second equals
- **Formula:** `{{ and equals role "Admin" equals status "Active" }}`
- **Test cases:** Admin+Active → "true", Admin+Inactive → "false", Sales+Active → "false"
- **Hints:** ["You have the first check. Now add the second.", "equals status \"Active\"", "{{ and equals role \"Admin\" equals status \"Active\" }}"]

### Step 9 — You Do: And with Two Equals
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Independent dual-equals `and` check
- **Description:** "Check if `department` is `\"Sales\"` AND `region` is `\"West\"`." Toolbox: `and`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ and equals department "Sales" equals region "West" }}`
- **Test cases:** Sales+West → "true", Sales+East → "false", Engineering+West → "false"

### Step 10 — You Do: And inside If
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Wrap `and` logic in `if` for output
- **Description:** "If the user is an `\"Admin\"` AND `\"Active\"`, output `\"Access Granted\"`. Otherwise `\"Locked\"`." Toolbox: `if`, `and`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and equals role "Admin" equals status "Active" "Access Granted" "Locked" }}`
- **Test cases:** Admin+Active → "Access Granted", Admin+Inactive → "Locked", Staff+Active → "Locked"

### Step 11 — You Do: Numeric And
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Mix numeric and string checks in `and`
- **Description:** "If `score` is greater than 50 AND `status` is `\"Active\"`, output `\"Eligible\"`. Otherwise `\"Not Eligible\"`. Remember `greater` from Chapter 5!" Toolbox: `if`, `and`, `greater` (Ch.5), `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and greater score 50 equals status "Active" "Eligible" "Not Eligible" }}`
- **Test cases:** 60+Active → "Eligible", 60+Inactive → "Not Eligible", 40+Active → "Not Eligible"

---

## Section C: Or (Steps 12-17)

### Step 12 — Concept: The Power of Or (I Do — Bug Fix)
- **Phase:** I Do (Interactive)
- **Type:** challenge
- **Goal:** Understand `or` by fixing a broken formula
- **Description:** "**New Tool: `or`** (Arity 2). `{{ or boolean1 boolean2 }}`. Returns `true` if AT LEAST ONE input is true. The formula below is supposed to check if the project is `fast` OR `cheap` — but someone used `and`. Fix it!"
- **Prefill:** `{{ and fast cheap }}`  ← wrong function
- **Formula:** `{{ or fast cheap }}`
- **Test cases:** fast+!cheap → "true", !fast+cheap → "true", neither → "false"
- **Notes:** Mirrors the `and` bug-fix. Student swaps `and` → `or` and sees the difference in behavior with the same test data.

### Step 13 — Predict the Or ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Question:** "`fast` is `false` and `cheap` is `true`. What does `{{ or fast cheap }}` return?"
- **Options:** `true`, `false`, `"cheap"`, `error`
- **Correct:** `true`
- **Description:** "`or` is generous. Only ONE needs to be true. Compare this to `and` which required BOTH."

### Step 14 — We Do: Or with One Equals
- **Phase:** We Do
- **Type:** challenge
- **Goal:** `or` with one boolean + one equals
- **Description:** "A user can enter if they are a `\"VIP\"` OR if they `hasTicket` (boolean). Fill in the missing check." Toolbox: `or`, `equals`
- **Prefill:** `{{ or _____ hasTicket }}`
- **Formula:** `{{ or equals type "VIP" hasTicket }}`
- **Test cases:** VIP+!ticket → "true", Guest+ticket → "true", Guest+!ticket → "false"

### Step 15 — You Do: Or with Two Equals
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Both sides of `or` need `equals`
- **Description:** "Check if `type` is `\"VIP\"` OR `\"Member\"`." Toolbox: `or`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ or equals type "VIP" equals type "Member" }}`
- **Test cases:** VIP → "true", Member → "true", Guest → "false"

### Step 16 — You Do: Or inside If
- **Phase:** You Do
- **Type:** challenge
- **Goal:** `or` + `equals` inside `if`
- **Description:** "If the user is a `\"VIP\"` or `\"Member\"`, output `\"Welcome In\"`. Others get `\"Pay Entry\"`." Toolbox: `if`, `or`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if or equals type "VIP" equals type "Member" "Welcome In" "Pay Entry" }}`
- **Test cases:** VIP → "Welcome In", Member → "Welcome In", Guest → "Pay Entry"

### Step 17 — You Do: Numeric Or
- **Phase:** You Do
- **Type:** challenge
- **Goal:** `or` with numeric comparisons
- **Description:** "Kids under 13 and seniors 65+ get a discount. If `age` is less than 13 OR `age` is geq 65, output `\"Discounted\"`. Otherwise `\"Full Price\"`. Remember `less` and `geq` from Chapter 5!" Toolbox: `if`, `or`, `less` (Ch.5), `geq` (Ch.5)
- **Prefill:** `{{}}`
- **Formula:** `{{ if or less age 13 geq age 65 "Discounted" "Full Price" }}`
- **Test cases:** age 10 → "Discounted", age 30 → "Full Price", age 70 → "Discounted"

---

## Section D: Not (Steps 18-21)

### Step 18 — Concept: Simple Negation (I Do — Bug Fix)
- **Phase:** I Do (Interactive)
- **Type:** challenge
- **Goal:** Understand `not` by fixing a formula
- **Description:** "**New Tool: `not`** (Arity 1). `{{ not boolean }}`. Flips a Boolean — `true` becomes `false`, `false` becomes `true`. The door `isLocked`. We want to check if it's UNLOCKED (return `true` when `isLocked` is `false`). The formula below just returns `isLocked` directly — add `not` to flip it!"
- **Prefill:** `{{ isLocked }}`  ← missing `not`
- **Formula:** `{{ not isLocked }}`
- **Test cases:** isLocked=true → "false", isLocked=false → "true"

### Step 19 — Predict the Not ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Question:** "If `isLocked` is `true`, what does `{{ not isLocked }}` return?"
- **Options:** `true`, `false`, `"not"`, `"isLocked"`
- **Correct:** `false`
- **Description:** "`not` is simple — it just flips. `true` becomes `false`, `false` becomes `true`."

### Step 20 — We Do: Negating a Check
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Wrap `equals` in `not`
- **Description:** "Check if status is NOT `\"Banned\"`. We've started the formula — the `equals` check is there, but it returns `true` for banned users. Wrap it in `not` to flip the result." Toolbox: `not`, `equals`
- **Prefill:** `{{ equals status "Banned" }}`  ← student needs to add `not` at the front
- **Formula:** `{{ not equals status "Banned" }}`
- **Test cases:** Banned → "false", Active → "true"
- **Hints:** ["This returns true for Banned users — we want the opposite", "Add `not` before `equals`", "{{ not equals status \"Banned\" }}"]

### Step 21 — You Do: Exclusion Gate
- **Phase:** You Do
- **Type:** challenge
- **Goal:** `not` inside `if` — full pattern
- **Description:** "If status is NOT `\"Banned\"`, output `\"Allow\"`. Otherwise `\"Block\"`." Toolbox: `if`, `not`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if not equals status "Banned" "Allow" "Block" }}`
- **Test cases:** Banned → "Block", Active → "Allow", Pending → "Allow"

---

## Section E: Capstone — The Logic Chain (Steps 22-24)

### Step 22 — Build the Or
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Build the inner `or` piece
- **Description:** "A user can edit if they are `\"Admin\"` OR `\"Editor\"`. Let's build that check first." Toolbox: `or`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ or equals role "Admin" equals role "Editor" }}`
- **Test cases:** Admin → "true", Editor → "true", Guest → "false"

### Step 23 — Add the And
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Combine with `and`
- **Description:** "Now add: they must ALSO be `\"Active\"`. Take your `or` logic and combine it with an `equals status \"Active\"` check using `and`." Toolbox: `and`, `or`, `equals`
- **Prefill:** `{{ and equals status "Active" }}`  ← student adds the `or` part
- **Formula:** `{{ and equals status "Active" or equals role "Admin" equals role "Editor" }}`
- **Test cases:** Active+Admin → "true", Active+Editor → "true", Inactive+Admin → "false", Active+Guest → "false"

### Step 24 — The Full Gate
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Wrap in `if` for output
- **Description:** "Give it a voice. If the user passes both checks, output `\"Can Edit\"`. Otherwise `\"View Only\"`. Wrap your logic from the last step in an `if`." Toolbox: `if`, `and`, `or`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and equals status "Active" or equals role "Admin" equals role "Editor" "Can Edit" "View Only" }}`
- **Test cases:** Active+Admin → "Can Edit", Active+Editor → "Can Edit", Inactive+Admin → "View Only", Active+Guest → "View Only"

---

# Chapter 7: Text Logic & Validation

**Functions covered:** `contains`, `in`
**Prerequisite knowledge:** `if`, `equals`, `and`, `or`, `not` (Ch.5-6), `greater`, `less`, `geq`, `leq`, `length` (Ch.5)
**Estimated steps:** ~17

---

## Section A: Warm-Up (Steps 1-2)

### Step 1 — Refresher: And + Equals
- **Phase:** Warm-up
- **Type:** challenge
- **Goal:** Quick `and` review
- **Description:** "If department is `\"Sales\"` AND region is `\"West\"`, output `\"Priority\"`. Otherwise `\"Standard\"`." Toolbox: `if`, `and`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and equals dept "Sales" equals region "West" "Priority" "Standard" }}`

### Step 2 — Refresher: Not + Equals
- **Phase:** Warm-up
- **Type:** challenge
- **Goal:** Quick `not` review
- **Description:** "If status is NOT `\"Archived\"`, output `\"Visible\"`. Otherwise `\"Hidden\"`." Toolbox: `if`, `not`, `equals`
- **Prefill:** `{{}}`
- **Formula:** `{{ if not equals status "Archived" "Visible" "Hidden" }}`

---

## Section B: Contains (Steps 3-8)

### Step 3 — Concept: Substring Search (I Do — Bug Fix)
- **Phase:** I Do (Interactive)
- **Type:** challenge
- **Goal:** Understand `contains` by fixing a broken formula
- **Description:** "**New Tool: `contains`** (Arity 2). `{{ contains haystack needle }}`. Returns `true` if the needle text is found INSIDE the haystack. The formula below tries to check if the `email` has an `@` symbol — but the arguments are backwards. Fix the order!"
- **Prefill:** `{{ contains "@" email }}`  ← arguments swapped
- **Formula:** `{{ contains email "@" }}`
- **Test cases:** "a@b.com" → "true", "ab.com" → "false"
- **Notes:** Forces student to think about argument order (haystack first, needle second). They see it fail, swap, see it pass.

### Step 4 — What Does Contains Return? ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Question:** "The `email` is `\"tom@company.com\"`. What does `{{ contains email \"@\" }}` return?"
- **Options:** `true`, `false`, `"@"`, `"tom@company.com"`
- **Correct:** `true`
- **Description:** "`contains` returns a **Boolean** — just like `equals`. It answers the question: 'Is this text hiding inside that text?' It doesn't return the found text — just `true` or `false`."

### Step 5 — We Do: Contains in If
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Use `contains` inside `if`
- **Description:** "If the email contains `\"@\"`, output `\"Valid\"`. Otherwise `\"Invalid\"`. We've given you the `contains` check — now wrap it in an `if`." Toolbox: `if`, `contains`
- **Prefill:** `{{ contains email "@" }}`  ← student wraps in `if` and adds outputs
- **Formula:** `{{ if contains email "@" "Valid" "Invalid" }}`
- **Test cases:** "a@b.com" → "Valid", "ab.com" → "Invalid"

### Step 6 — You Do: Contains in If
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Independent `contains` + `if`
- **Description:** "If the `url` contains `\"https\"`, output `\"Secure\"`. Otherwise `\"Not Secure\"`." Toolbox: `if`, `contains`
- **Prefill:** `{{}}`
- **Formula:** `{{ if contains url "https" "Secure" "Not Secure" }}`
- **Test cases:** "https://safe.com" → "Secure", "http://old.com" → "Not Secure"

### Step 7 — You Do: Contains + Not
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Negative text check
- **Description:** "If the `username` does NOT contain `\"test\"`, output `\"Real\"`. Otherwise `\"Fake\"`." Toolbox: `if`, `not` (Ch.6), `contains`
- **Prefill:** `{{}}`
- **Formula:** `{{ if not contains username "test" "Real" "Fake" }}`
- **Test cases:** "jdoe" → "Real", "testuser" → "Fake"

### Step 8 — You Do: Contains + And
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Combine two `contains` checks
- **Description:** "A valid email must contain BOTH `\"@\"` AND `\".\"`. Output `\"Valid\"` or `\"Invalid\"`." Toolbox: `if`, `and` (Ch.6), `contains`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and contains email "@" contains email "." "Valid" "Invalid" }}`
- **Test cases:** "a@b.com" → "Valid", "a@b" → "Invalid", "ab.com" → "Invalid"

---

## Section C: In (Steps 9-13)

### Step 9 — Concept: List Membership (I Do — Bug Fix)
- **Phase:** I Do (Interactive)
- **Type:** challenge
- **Goal:** Understand `in` by fixing a broken formula
- **Description:** "**New Tool: `in`** (Arity 2). `{{ in value list }}`. The list is a **space-separated** string. Returns `true` if the value matches one of the items in the list. The formula below tries to check if `color` is red, blue, or green — but someone used `contains` instead of `in`. Fix it!"
- **Prefill:** `{{ contains color "red blue green" }}`  ← wrong function
- **Formula:** `{{ in color "red blue green" }}`
- **Test cases:** "red" → "true", "blue" → "true", "yellow" → "false"
- **Notes:** This teaches the critical distinction: `contains` checks substrings, `in` checks list membership. Using `contains` here would incorrectly match "reddish" or "blueberry".

### Step 10 — Contains vs In ⭐ MC
- **Phase:** I Do (Interactive)
- **Type:** multiple-choice
- **Question:** "`color` is `\"reddish\"`. What does `{{ contains color \"red\" }}` return? (Think carefully!)"
- **Options:** `true` — "red" is inside "reddish", `false` — "reddish" is not "red"
- **Correct:** `true` — "red" is inside "reddish"
- **Description:** "This is why `contains` and `in` are different tools! `contains` finds text INSIDE other text — so 'red' is inside 'reddish'. `in` checks for an EXACT match against a list. Use `in` when you want exact matches. Use `contains` when you're searching inside text."

### Step 11 — We Do: In with If
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Use `in` inside `if`
- **Description:** "If the `student.grade` is in High School (`\"09 10 11 12\"`), output `\"High School\"`. Otherwise `\"Other\"`. We've started the formula — complete it." Toolbox: `if`, `in`
- **Prefill:** `{{ if in student.grade }}`  ← student adds the list and outputs
- **Formula:** `{{ if in student.grade "09 10 11 12" "High School" "Other" }}`
- **Test cases:** "09" → "High School", "12" → "High School", "07" → "Other"

### Step 12 — You Do: In with If
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Independent `in` + `if`
- **Description:** "If the `day` is a weekend day (`\"Saturday Sunday\"`), output `\"Weekend\"`. Otherwise `\"Weekday\"`." Toolbox: `if`, `in`
- **Prefill:** `{{}}`
- **Formula:** `{{ if in day "Saturday Sunday" "Weekend" "Weekday" }}`
- **Test cases:** "Saturday" → "Weekend", "Monday" → "Weekday", "Sunday" → "Weekend"

### Step 13 — You Do: In + Not
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Combine `in` with `not`
- **Description:** "If the `status` is NOT in `\"Banned Suspended\"`, output `\"Active\"`. Otherwise `\"Restricted\"`." Toolbox: `if`, `not` (Ch.6), `in`
- **Prefill:** `{{}}`
- **Formula:** `{{ if not in status "Banned Suspended" "Active" "Restricted" }}`
- **Test cases:** "OK" → "Active", "Banned" → "Restricted", "Suspended" → "Restricted"

---

## Section D: Range Checks (Steps 14-15)

### Step 14 — We Do: Is It in Range?
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Range check with `and` + numeric comparisons
- **Description:** "Is the score in the valid range? Check if `score` is at least 50 AND less than 100. Remember `geq` (greater or equal) and `less` from Chapter 5!" Toolbox: `and` (Ch.6), `geq` (Ch.5), `less` (Ch.5)
- **Prefill:** `{{ and geq score 50 }}`  ← student adds the `less` part
- **Formula:** `{{ and geq score 50 less score 100 }}`
- **Test cases:** 50 → "true", 75 → "true", 49 → "false", 100 → "false"

### Step 15 — You Do: Range Gate
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Range check inside `if`
- **Description:** "If `temperature` is at least 60 AND less than 80, output `\"Comfortable\"`. Otherwise `\"Extreme\"`." Toolbox: `if`, `and` (Ch.6), `geq` (Ch.5), `less` (Ch.5)
- **Prefill:** `{{}}`
- **Formula:** `{{ if and geq temperature 60 less temperature 80 "Comfortable" "Extreme" }}`
- **Test cases:** 70 → "Comfortable", 59 → "Extreme", 80 → "Extreme"

---

## Section E: Password Validator Capstone (Steps 16-19)

### Step 16 — Build Part 1: Length + Hash
- **Phase:** We Do
- **Type:** challenge
- **Goal:** `and` with `greater` + `contains`
- **Description:** "Let's build a password validator! First check: is the password long enough AND does it contain a special character? Check if `length` of `pass` is greater than 8 AND `pass` contains `\"#\"`. Remember `length` and `greater` from Chapter 5!" Toolbox: `and`, `greater` (Ch.5), `length` (Ch.5), `contains`
- **Prefill:** `{{ and greater length pass 8 }}`  ← student adds the `contains` part
- **Formula:** `{{ and greater length pass 8 contains pass "#" }}`
- **Test cases:** "secure#1234" → "true", "short#" → "false", "longpassword" → "false"

### Step 17 — Build Part 2: The Forbidden Word
- **Phase:** You Do
- **Type:** challenge
- **Goal:** `not` + `contains`
- **Description:** "Second check: the password must NOT contain the word `\"password\"`. Build this check." Toolbox: `not` (Ch.6), `contains`
- **Prefill:** `{{}}`
- **Formula:** `{{ not contains pass "password" }}`
- **Test cases:** "mysecret" → "true", "mypassword123" → "false"

### Step 18 — Combine: The Triple And
- **Phase:** We Do
- **Type:** challenge
- **Goal:** Chain Part 1 and Part 2
- **Description:** "Now combine your two checks into one. Use the 'Triple And' structure: `{{ and PART_1 PART_2 }}`. We've pasted Part 1 for you — add Part 2." Toolbox: `and`, `greater`, `length`, `contains`, `not`
- **Prefill:** `{{ and and greater length pass 8 contains pass "#" }}`  ← student adds Part 2
- **Formula:** `{{ and and greater length pass 8 contains pass "#" not contains pass "password" }}`
- **Test cases:** "secure#123456" → "true", "short#" → "false", "mypassword#123" → "false"

### Step 19 — Final Exam: Password Validator
- **Phase:** You Do
- **Type:** challenge
- **Goal:** Wrap in `if` for final output
- **Description:** "You built the engine. Now give it a voice! Output `\"Strong\"` if the password passes ALL checks. Otherwise `\"Weak\"`. Wrap your logic from the last step in an `if`." Toolbox: `if`, `and`, `greater`, `length`, `contains`, `not`
- **Prefill:** `{{}}`
- **Formula:** `{{ if and and greater length pass 8 contains pass "#" not contains pass "password" "Strong" "Weak" }}`
- **Test cases:** "secure#12345" → "Strong", "secure123456" → "Weak", "#short" → "Weak", "mypassword#123" → "Weak"

---

# Summary

## Step Counts
- **Chapter 6:** 24 steps (4 warm-up + 7 and + 6 or + 4 not + 3 capstone)
- **Chapter 7:** 19 steps (2 warm-up + 6 contains + 5 in + 2 range + 4 password capstone)

## Multiple Choice Questions: 6 total
- Ch.6 Step 2: What does `equals` return? (Boolean foundation)
- Ch.6 Step 6: Predict `and` behavior
- Ch.6 Step 13: Predict `or` behavior
- Ch.6 Step 19: Predict `not` behavior
- Ch.7 Step 4: What does `contains` return? (Boolean from text)
- Ch.7 Step 10: Contains vs In distinction

## I Do / We Do / You Do Ratio per Section
Each section introducing a new tool follows:
- 1-2 I Do steps (bug fix + MC prediction)
- 1-2 We Do steps (partial prefills)
- 2-3 You Do steps (independent practice)

## Key Design Decisions
1. **No parentheses anywhere** — all formulas use pure prefix notation
2. **Toolbox on every step** — lists all required functions with chapter origin
3. **Bug-fix "I Do" steps** — student always interacts, never passively reads
4. **Partial prefills for "We Do"** — student fills a gap, not a blank page
5. **MC questions test prediction, not recall** — "what will this return?" not "what is the definition of?"
6. **Bridge steps before complexity jumps** — especially the bool+equals → equals+equals transition

## Parens Still Needing Fixes (Out of Scope)
- Chapter 5: Steps 3-10
- Chapter 4: Steps ~8, ~10
- Chapter 9: Steps 5, 8, 14, 15
- Chapter 10: Steps 5, 6, 12, 13, 14
- Chapter 11: Multiple forEach steps

## Implementation Order
1. Write new `chapter6.js` — 24 steps
2. Write new `chapter7.js` — 19 steps
3. Verify all formulas are paren-free
4. Test all formulas parse correctly
5. Update `index.js` if chapter titles/descriptions changed
