export const chapter6 = {
    id: "chapter-6",
    title: "Chapter 6: Advanced Logic",
    description: "Combine decisions with and, or, and not.",
    functions: ["and", "or", "not"],
    steps: [
        // ============================================================
        // SECTION A: Warm-Up & Boolean Foundation (Steps 1-4)
        // ============================================================
        {
            id: "c6-s1",
            type: "challenge",
            title: "Refresher: The If Check",
            goal: "Check if role is 'Manager'",
            description: "Let's warm up with a standard check.\n\n🧰 **Toolbox:** `if`, `equals`\n\n**Challenge:**\nIf the `role` is `\"Manager\"`, output `\"Approved\"`. Otherwise output `\"Pending\"`.",
            testCases: [
                { name: "Manager", data: { "role": "Manager" }, expected: "Approved" },
                { name: "Staff", data: { "role": "Staff" }, expected: "Pending" }
            ],
            hints: [
                "Start with {{ if ...",
                "Your condition is: equals role \"Manager\"",
                "{{ if equals role \"Manager\" \"Approved\" \"Pending\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s2",
            type: "multiple-choice",
            title: "What Did Equals Return?",
            goal: "Understand that equals returns a Boolean",
            description: "In the last step, you wrote `{{ if equals role \"Manager\" ... }}`.\n\nThe `equals` function did its job **BEFORE** `if` made its decision.\n\nLet's make sure we understand what `equals` actually produced.\n\nThat `true`/`false` value is called a **Boolean**. Think of it as a Yes/No answer. Every `if` needs a Boolean to decide which path to take — it's the traffic light.",
            question: "When the role IS \"Manager\", what does equals role \"Manager\" return?",
            options: ["\"Manager\"", "true", "\"Approved\"", "equals"],
            correctAnswer: "true",
            hints: ["equals compares two things and answers a Yes/No question", "It doesn't return the text — it returns whether they match"]
        },
        {
            id: "c6-s3",
            type: "challenge",
            title: "Refresher: Three-Way Choice",
            goal: "Nested if with string checks",
            description: "What if there are **3 options** instead of just 2?\n\nYou can put an `if` inside the **else slot** of another `if`!\n\n🧰 **Toolbox:** `if`, `equals`\n\n**Challenge:**\nWe've started the first check for you. The `\"Gold\"` tier gets `\"VIP\"`. Now extend it:\n• If tier is `\"Silver\"` → `\"Member\"`\n• Otherwise → `\"Guest\"`\n\nReplace `\"VIP\"` 's else value with another `if` statement.",
            testCases: [
                { name: "Gold", data: { "tier": "Gold" }, expected: "VIP" },
                { name: "Silver", data: { "tier": "Silver" }, expected: "Member" },
                { name: "Bronze", data: { "tier": "Bronze" }, expected: "Guest" }
            ],
            hints: [
                "The else slot currently needs to be replaced with another if",
                "if equals tier \"Silver\" \"Member\" \"Guest\"",
                "{{ if equals tier \"Gold\" \"VIP\" if equals tier \"Silver\" \"Member\" \"Guest\" }}"
            ],
            prefill: "{{ if equals tier \"Gold\" \"VIP\" }}"
        },
        {
            id: "c6-s4",
            type: "challenge",
            title: "Three-Way: Your Turn",
            goal: "Build a nested if from scratch",
            description: "Now build one from scratch!\n\n🧰 **Toolbox:** `if`, `equals`\n\n**Challenge:**\n1. If `dept` is `\"Engineering\"` → `\"Builds\"`\n2. Else if `dept` is `\"Sales\"` → `\"Sells\"`\n3. Else → `\"Supports\"`",
            testCases: [
                { name: "Engineering", data: { "dept": "Engineering" }, expected: "Builds" },
                { name: "Sales", data: { "dept": "Sales" }, expected: "Sells" },
                { name: "Marketing", data: { "dept": "Marketing" }, expected: "Supports" }
            ],
            hints: [
                "Start with: {{ if equals dept \"Engineering\" \"Builds\" ...",
                "The else slot is another if: if equals dept \"Sales\" \"Sells\" \"Supports\"",
                "{{ if equals dept \"Engineering\" \"Builds\" if equals dept \"Sales\" \"Sells\" \"Supports\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION B: And (Steps 5-11)
        // ============================================================
        {
            id: "c6-s5",
            type: "challenge",
            title: "Concept: The Power of And",
            goal: "Fix the broken formula",
            description: "**New Tool: `and`** — Arity 2\n\n`{{ and boolean1 boolean2 }}`\n\nReturns `true` ONLY when **BOTH** inputs are true.\n\n🧰 **Toolbox:** `and` — new!\n\n**Challenge:**\nThe formula below only checks if the system is `ready` — but it **ignores** `steady`! We need BOTH to be true.\n\n**Fix it** by using `and` to check both variables.",
            testCases: [
                { name: "All Systems Go", data: { "ready": true, "steady": true }, expected: "true" },
                { name: "Not Steady", data: { "ready": true, "steady": false }, expected: "false" },
                { name: "Not Ready", data: { "ready": false, "steady": true }, expected: "false" }
            ],
            hints: [
                "Right now it only checks `ready`. We need to check `steady` too.",
                "Replace the formula with: and ready steady",
                "{{ and ready steady }}"
            ],
            prefill: "{{ ready }}"
        },
        {
            id: "c6-s6",
            type: "multiple-choice",
            title: "Predict the And",
            goal: "Predict and behavior",
            description: "`and` is strict — **BOTH** must be true. If even one is false, the whole thing is false.\n\nThink carefully before you answer!",
            question: "If ready is true and steady is false, what does {{ and ready steady }} return?",
            options: ["true", "false", "\"ready\"", "error"],
            correctAnswer: "false",
            hints: ["and requires BOTH to be true", "One of them is false..."]
        },
        {
            id: "c6-s7",
            type: "challenge",
            title: "And with One Equals",
            goal: "Combine and with a boolean and an equals check",
            description: "Now let's mix `and` with an `equals` check.\n\nA user must be an `\"Admin\"` **AND** `active` — a Boolean field.\n\n🧰 **Toolbox:** `and` — new!, `equals`\n\n**Challenge:**\nThe formula below only checks `active`. Add an `equals` check for the role **before** `active` to check BOTH conditions.",
            testCases: [
                { name: "Admin Active", data: { "role": "Admin", "active": true }, expected: "true" },
                { name: "Admin Inactive", data: { "role": "Admin", "active": false }, expected: "false" },
                { name: "Staff Active", data: { "role": "Staff", "active": true }, expected: "false" }
            ],
            hints: [
                "Right now it only checks active. Add an equals check before it.",
                "equals role \"Admin\"",
                "{{ and equals role \"Admin\" active }}"
            ],
            prefill: "{{ active }}"
        },
        {
            id: "c6-s8",
            type: "challenge",
            title: "And with Two Equals",
            goal: "Both sides of and need equals",
            description: "Now **BOTH** checks need `equals`.\n\nCheck if `role` is `\"Admin\"` **AND** `status` is `\"Active\"`.\n\nYou need **TWO** `equals` — one for each check.\n\n🧰 **Toolbox:** `and`, `equals`\n\n**Challenge:**\nWe've given you the first check. Add the second `equals` check.",
            testCases: [
                { name: "Admin Active", data: { "role": "Admin", "status": "Active" }, expected: "true" },
                { name: "Admin Inactive", data: { "role": "Admin", "status": "Inactive" }, expected: "false" },
                { name: "Sales Active", data: { "role": "Sales", "status": "Active" }, expected: "false" }
            ],
            hints: [
                "You have the first check. Now add the second.",
                "equals status \"Active\"",
                "{{ and equals role \"Admin\" equals status \"Active\" }}"
            ],
            prefill: "{{ and equals role \"Admin\" }}"
        },
        {
            id: "c6-s9",
            type: "challenge",
            title: "You Do: Dual Equals And",
            goal: "Independent dual-equals and check",
            description: "Your turn — from scratch!\n\n🧰 **Toolbox:** `and`, `equals`\n\n**Challenge:**\nCheck if `department` is `\"Sales\"` **AND** `region` is `\"West\"`.",
            testCases: [
                { name: "Sales West", data: { "department": "Sales", "region": "West" }, expected: "true" },
                { name: "Sales East", data: { "department": "Sales", "region": "East" }, expected: "false" },
                { name: "Engineering West", data: { "department": "Engineering", "region": "West" }, expected: "false" }
            ],
            hints: [
                "You need two equals checks glued together with and",
                "{{ and equals department \"Sales\" equals region \"West\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s10",
            type: "challenge",
            title: "And Inside If",
            goal: "Wrap and logic in if for output",
            description: "Now let's use that `and` check inside an `if` to produce output.\n\n🧰 **Toolbox:** `if`, `and`, `equals`\n\n**Challenge:**\nIf the user is an `\"Admin\"` **AND** `\"Active\"`, output `\"Access Granted\"`. Otherwise `\"Locked\"`.",
            testCases: [
                { name: "Admin Active", data: { "role": "Admin", "status": "Active" }, expected: "Access Granted" },
                { name: "Admin Inactive", data: { "role": "Admin", "status": "Inactive" }, expected: "Locked" },
                { name: "Staff Active", data: { "role": "Staff", "status": "Active" }, expected: "Locked" }
            ],
            hints: [
                "Start with if, then your and check, then the two outputs",
                "{{ if and equals role \"Admin\" equals status \"Active\" \"Access Granted\" \"Locked\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s11",
            type: "challenge",
            title: "Numeric And",
            goal: "Mix numeric and string checks in and",
            description: "We can mix different types of checks inside `and`.\n\n🧰 **Toolbox:** `if`, `and`, `greater`, `equals`\n\nRemember `greater` from Chapter 5? It checks if one number is bigger than another.\n\n**Challenge:**\nIf `score` is greater than `50` **AND** `status` is `\"Active\"`, output `\"Eligible\"`. Otherwise `\"Not Eligible\"`.",
            testCases: [
                { name: "High + Active", data: { "score": 60, "status": "Active" }, expected: "Eligible" },
                { name: "High + Inactive", data: { "score": 60, "status": "Inactive" }, expected: "Not Eligible" },
                { name: "Low + Active", data: { "score": 40, "status": "Active" }, expected: "Not Eligible" }
            ],
            hints: [
                "One check is: greater score 50",
                "The other check is: equals status \"Active\"",
                "{{ if and greater score 50 equals status \"Active\" \"Eligible\" \"Not Eligible\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION C: Or (Steps 12-17)
        // ============================================================
        {
            id: "c6-s12",
            type: "challenge",
            title: "Concept: The Power of Or",
            goal: "Fix the broken formula",
            description: "**New Tool: `or`** — Arity 2\n\n`{{ or boolean1 boolean2 }}`\n\nReturns `true` if **AT LEAST ONE** input is true.\n\n🧰 **Toolbox:** `or` — new!\n\n**Challenge:**\nThe formula below is supposed to check if the project is `fast` **OR** `cheap` — but someone used `and`. **Fix it!**\n\n*Run it first to see what's wrong — then fix the function name*",
            testCases: [
                { name: "Fast Only", data: { "fast": true, "cheap": false }, expected: "true" },
                { name: "Cheap Only", data: { "fast": false, "cheap": true }, expected: "true" },
                { name: "Neither", data: { "fast": false, "cheap": false }, expected: "false" }
            ],
            hints: [
                "The formula uses `and` but we need `or`",
                "Replace `and` with `or`",
                "{{ or fast cheap }}"
            ],
            prefill: "{{ and fast cheap }}"
        },
        {
            id: "c6-s13",
            type: "multiple-choice",
            title: "Predict the Or",
            goal: "Predict or behavior",
            description: "`or` is generous — only **ONE** needs to be true. Compare this to `and` which required **BOTH**.",
            question: "fast is false and cheap is true. What does {{ or fast cheap }} return?",
            options: ["true", "false", "\"cheap\"", "error"],
            correctAnswer: "true",
            hints: ["or only needs ONE to be true", "cheap is true..."]
        },
        {
            id: "c6-s14",
            type: "challenge",
            title: "Or with One Equals",
            goal: "Or with one boolean and one equals check",
            description: "A user can enter if they are a `\"VIP\"` **OR** if they have a ticket — `hasTicket` is a Boolean.\n\n🧰 **Toolbox:** `or`, `equals`\n\n**Challenge:**\nThe formula below only checks `hasTicket`. Add an `equals` check for the type **before** `hasTicket` to check EITHER condition.",
            testCases: [
                { name: "VIP", data: { "type": "VIP", "hasTicket": false }, expected: "true" },
                { name: "Ticket Holder", data: { "type": "Guest", "hasTicket": true }, expected: "true" },
                { name: "Empty Handed", data: { "type": "Guest", "hasTicket": false }, expected: "false" }
            ],
            hints: [
                "Right now it only checks hasTicket. Add an equals check before it.",
                "equals type \"VIP\"",
                "{{ or equals type \"VIP\" hasTicket }}"
            ],
            prefill: "{{ hasTicket }}"
        },
        {
            id: "c6-s15",
            type: "challenge",
            title: "Or with Two Equals",
            goal: "Both sides of or need equals",
            description: "Now both sides need `equals`.\n\n🧰 **Toolbox:** `or`, `equals`\n\n**Challenge:**\nCheck if `type` is `\"VIP\"` **OR** `\"Member\"`.",
            testCases: [
                { name: "VIP", data: { "type": "VIP" }, expected: "true" },
                { name: "Member", data: { "type": "Member" }, expected: "true" },
                { name: "Guest", data: { "type": "Guest" }, expected: "false" }
            ],
            hints: [
                "You need two equals checks glued together with or",
                "{{ or equals type \"VIP\" equals type \"Member\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s16",
            type: "challenge",
            title: "The Club Door",
            goal: "Or inside if for output",
            description: "Let's put `or` into action!\n\n🧰 **Toolbox:** `if`, `or`, `equals`\n\n**Challenge:**\nIf the user is a `\"VIP\"` **OR** a `\"Member\"`, output `\"Welcome In\"`. Everyone else gets `\"Pay Entry\"`.",
            testCases: [
                { name: "VIP", data: { "type": "VIP" }, expected: "Welcome In" },
                { name: "Member", data: { "type": "Member" }, expected: "Welcome In" },
                { name: "Guest", data: { "type": "Guest" }, expected: "Pay Entry" }
            ],
            hints: [
                "Build the or check first, then wrap in if",
                "{{ if or equals type \"VIP\" equals type \"Member\" \"Welcome In\" \"Pay Entry\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s17",
            type: "challenge",
            title: "Numeric Or",
            goal: "Or with numeric comparisons",
            description: "Kids under 13 and seniors 65+ get a discount.\n\n🧰 **Toolbox:** `if`, `or`, `less`, `geq`\n\nRemember from Chapter 5:\n• `less age 13` → true if age is below 13\n• `geq age 65` → true if age is 65 or higher\n\n**Challenge:**\nIf `age` is less than `13` **OR** `age` is geq `65`, output `\"Discounted\"`. Otherwise `\"Full Price\"`.",
            testCases: [
                { name: "Child", data: { "age": 10 }, expected: "Discounted" },
                { name: "Adult", data: { "age": 30 }, expected: "Full Price" },
                { name: "Senior", data: { "age": 70 }, expected: "Discounted" }
            ],
            hints: [
                "One check is: less age 13",
                "The other check is: geq age 65",
                "{{ if or less age 13 geq age 65 \"Discounted\" \"Full Price\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION D: Not (Steps 18-21)
        // ============================================================
        {
            id: "c6-s18",
            type: "challenge",
            title: "Concept: Simple Negation",
            goal: "Fix the formula by adding not",
            description: "**New Tool: `not`** — Arity 1\n\n`{{ not boolean }}`\n\nFlips a Boolean — `true` becomes `false`, `false` becomes `true`.\n\n🧰 **Toolbox:** `not` — new!\n\n**Challenge:**\nThe door `isLocked`. We want to check if it's **UNLOCKED** — return `true` when `isLocked` is `false`.\n\nThe formula below just returns `isLocked` directly. **Add `not` to flip it!**",
            testCases: [
                { name: "Locked", data: { "isLocked": true }, expected: "false" },
                { name: "Unlocked", data: { "isLocked": false }, expected: "true" }
            ],
            hints: [
                "Add `not` before `isLocked`",
                "{{ not isLocked }}"
            ],
            prefill: "{{ isLocked }}"
        },
        {
            id: "c6-s19",
            type: "multiple-choice",
            title: "Predict the Not",
            goal: "Predict not behavior",
            description: "`not` is the simplest logic tool — it just flips. `true` becomes `false`, `false` becomes `true`.",
            question: "If isLocked is true, what does {{ not isLocked }} return?",
            options: ["true", "false", "\"not\"", "\"isLocked\""],
            correctAnswer: "false",
            hints: ["not flips the value", "true becomes..."]
        },
        {
            id: "c6-s20",
            type: "challenge",
            title: "Negating a Check",
            goal: "Wrap equals in not",
            description: "We can also negate the result of a function like `equals`.\n\n🧰 **Toolbox:** `not`, `equals`\n\n**Challenge:**\nCheck if `status` is **NOT** `\"Banned\"`.\n\nThe formula below checks if the status IS Banned — returns `true` for banned users. **Add `not` at the front to flip it!**",
            testCases: [
                { name: "Banned User", data: { "status": "Banned" }, expected: "false" },
                { name: "Active User", data: { "status": "Active" }, expected: "true" }
            ],
            hints: [
                "This currently returns true for Banned — we want the opposite",
                "Add `not` before `equals`",
                "{{ not equals status \"Banned\" }}"
            ],
            prefill: "{{ equals status \"Banned\" }}"
        },
        {
            id: "c6-s21",
            type: "challenge",
            title: "The Exclusion Gate",
            goal: "Not inside if for output",
            description: "Let's use `not` to filter out bad actors.\n\n🧰 **Toolbox:** `if`, `not`, `equals`\n\n**Challenge:**\nIf the `status` is **NOT** `\"Banned\"`, output `\"Allow\"`. Otherwise output `\"Block\"`.",
            testCases: [
                { name: "Banned", data: { "status": "Banned" }, expected: "Block" },
                { name: "Active", data: { "status": "Active" }, expected: "Allow" },
                { name: "Pending", data: { "status": "Pending" }, expected: "Allow" }
            ],
            hints: [
                "The condition is: not equals status \"Banned\"",
                "{{ if not equals status \"Banned\" \"Allow\" \"Block\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION E: Capstone — The Logic Chain (Steps 22-24)
        // ============================================================
        {
            id: "c6-s22",
            type: "challenge",
            title: "Build the Or",
            goal: "Build the inner or piece",
            description: "Time for a real-world challenge! Let's build it step by step.\n\n**Scenario:** A user can edit if they are `\"Admin\"` **OR** `\"Editor\"`.\n\n🧰 **Toolbox:** `or`, `equals`\n\n**Challenge:**\nBuild JUST the `or` check. Is the role `\"Admin\"` or `\"Editor\"`?",
            testCases: [
                { name: "Admin", data: { "role": "Admin", "status": "Active" }, expected: "true" },
                { name: "Editor", data: { "role": "Editor", "status": "Active" }, expected: "true" },
                { name: "Guest", data: { "role": "Guest", "status": "Active" }, expected: "false" }
            ],
            hints: [
                "or equals role \"Admin\" equals role \"Editor\"",
                "{{ or equals role \"Admin\" equals role \"Editor\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s23",
            type: "challenge",
            title: "Add the And",
            goal: "Combine or with and",
            description: "Great! Now add a second requirement: they must **ALSO** be `\"Active\"`.\n\n🧰 **Toolbox:** `and`, `or`, `equals`\n\n**Challenge:**\nWe've started with the `and` and the status check. **Add your `or` logic from the last step** after it.",
            testCases: [
                { name: "Active Admin", data: { "status": "Active", "role": "Admin" }, expected: "true" },
                { name: "Active Editor", data: { "status": "Active", "role": "Editor" }, expected: "true" },
                { name: "Inactive Admin", data: { "status": "Inactive", "role": "Admin" }, expected: "false" },
                { name: "Active Guest", data: { "status": "Active", "role": "Guest" }, expected: "false" }
            ],
            hints: [
                "Paste your or logic after the status check",
                "or equals role \"Admin\" equals role \"Editor\"",
                "{{ and equals status \"Active\" or equals role \"Admin\" equals role \"Editor\" }}"
            ],
            prefill: "{{ and equals status \"Active\" }}"
        },
        {
            id: "c6-s24",
            type: "challenge",
            title: "The Full Gate",
            goal: "Wrap in if for final output",
            description: "You built the logic engine. Now give it a voice!\n\n🧰 **Toolbox:** `if`, `and`, `or`, `equals`\n\n**Challenge:**\nIf the user passes both checks, output `\"Can Edit\"`. Otherwise `\"View Only\"`.\n\nWrap your logic from the last step in an `if`.",
            testCases: [
                { name: "Active Admin", data: { "status": "Active", "role": "Admin" }, expected: "Can Edit" },
                { name: "Active Editor", data: { "status": "Active", "role": "Editor" }, expected: "Can Edit" },
                { name: "Inactive Admin", data: { "status": "Inactive", "role": "Admin" }, expected: "View Only" },
                { name: "Active Guest", data: { "status": "Active", "role": "Guest" }, expected: "View Only" }
            ],
            hints: [
                "Start with if, then your and/or logic, then the two outputs",
                "{{ if and equals status \"Active\" or equals role \"Admin\" equals role \"Editor\" \"Can Edit\" \"View Only\" }}"
            ],
            prefill: "{{}}"
        }
    ]
};
