export const chapter5 = {
    id: "chapter-5",
    title: "Chapter 5: Basic Logic",
    description: "Master the art of decision making with if, equals, and comparison logic.",
    steps: [
        {
            id: "c5-s1",
            type: "challenge",
            title: "Refresher: The Exact Match",
            goal: "Check if the role is 'Admin'",
            description: "Before we make decisions, we need to check facts.\n\n**Tool: `equals`** (Arity 2)\n\n`{{ equals thing1 thing2 }}`\n\nThis function returns a **Boolean** value (`true` or `false`). It answers a Yes/No question.\n\n**Challenge:**\nCheck if the user's `role` is exactly `\"Admin\"`.",
            testCases: [
                { name: "Is Admin", data: { "role": "Admin" }, expected: "true" },
                { name: "Is Guest", data: { "role": "Guest" }, expected: "false" }
            ],
            hints: ["Type {{ equals role \"Admin\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s2",
            type: "challenge",
            title: "Practice: Status Check",
            goal: "Check if status is 'Active'",
            description: "Let's try one more check before moving on.\n\n**Challenge:**\nUse `equals` again to get a **Boolean** result (`true`/`false`).\n\nCheck if the user's `status` is exactly `\"Active\"`.",
            testCases: [
                { name: "Active User", data: { "status": "Active" }, expected: "true" },
                { name: "Inactive User", data: { "status": "Inactive" }, expected: "false" }
            ],
            hints: ["Type {{ equals status \"Active\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s3",
            type: "challenge",
            title: "Concept: The Fork in the Road",
            goal: "Welcome Admins, deny others",
            description: "Now that we can check facts, let's act on them.\n\n**New Tool: `if`** (Arity 3)\n\n`{{ if condition then_do_this else_do_that }}`\n\nThe `if` function is \"Hungry\"—it eats 3 things:\n1. The **Condition** (must be a **Boolean**)\n2. The **Result** if True\n3. The **Result** if False\n\n**Challenge:**\nIf the `role` equals `\"Admin\"`, output `\"Welcome\"`. Otherwise, output `\"Access Denied\"`.",
            testCases: [
                { name: "Admin", data: { "role": "Admin" }, expected: "Welcome" },
                { name: "Guest", data: { "role": "Guest" }, expected: "Access Denied" }
            ],
            hints: [
                "Start with {{ if ...",
                "Your condition is: equals role \"Admin\"",
                "{{ if (equals role \"Admin\") \"Welcome\" \"Access Denied\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c5-s4",
            type: "challenge",
            title: "Practice: Department Check",
            goal: "Give a Bonus to Sales",
            description: "Let's practice the `if` function one more time with a text check.\n\n**Scenario:**\nEmployees in the \"Sales\" department get a \"Bonus\". Everyone else gets \"No Bonus\".\n\n**Challenge:**\nWrite an `if` statement to check the `department`.",
            testCases: [
                { name: "Sales", data: { "department": "Sales" }, expected: "Bonus" },
                { name: "Engineering", data: { "department": "Engineering" }, expected: "No Bonus" }
            ],
            hints: ["{{ if (equals department \"Sales\") \"Bonus\" \"No Bonus\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s5",
            type: "challenge",
            title: "Practice: Strict Comparisons",
            goal: "Pass if score is strictly greater than 50",
            description: "Logic isn't just about equality. It's about magnitude.\n\n**New Tool: `greater`** (Arity 2)\n\n`{{ greater number1 number2 }}`\n\nReturns `true` if number1 is strictly larger than number2.\n\n**Challenge:**\nIf the `score` is greater than `50`, output `\"Pass\"`. Otherwise, output `\"Fail\"`.\n\n(Note: A score of 50 is NOT greater than 50, so it should Fail).",
            testCases: [
                { name: "High Score", data: { "score": 60 }, expected: "Pass" },
                { name: "Edge Fail", data: { "score": 50 }, expected: "Fail" },
                { name: "Low Score", data: { "score": 10 }, expected: "Fail" }
            ],
            hints: ["{{ if (greater score 50) \"Pass\" \"Fail\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s6",
            type: "challenge",
            title: "Concept: The Edge Case",
            goal: "Pass if score is 50 or higher",
            description: "In the last step, a score of 50 Failed. That seems unfair.\n\n**New Tool: `geq`** (Arity 2)\n\nThis works exactly like `greater` but includes the number itself (Greater or Equal).\n\n`{{ geq a b }}` is equivalent to `{{ greater a b }}` but returns true if they are equal.\n\n**Challenge:**\nUpdate your logic so that a score of `50` also results in `\"Pass\"`.",
            testCases: [
                { name: "High Score", data: { "score": 60 }, expected: "Pass" },
                { name: "Edge Pass", data: { "score": 50 }, expected: "Pass" },
                { name: "Low Score", data: { "score": 49 }, expected: "Fail" }
            ],
            hints: ["Use geq instead of greater.", "{{ if (geq score 50) \"Pass\" \"Fail\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s7",
            type: "challenge",
            title: "Practice: Short Text",
            goal: "Flag usernames that are too short",
            description: "Sometimes we need to check if a number is `less` than another.\n\n**New Tool: `less`** (Arity 2)\n\n`{{ less number1 number2 }}` - Returns true if number1 is strictly smaller than number2.\n\n**Tool Combo: `len`**\n`{{ len string }}` - Returns the number of characters in a string.\n\n**Challenge:**\nIf the `username` length is less than `5` characters, output `\"Too Short\"`. Otherwise, output `\"OK\"`.",
            testCases: [
                { name: "Valid User", data: { "username": "jdoe123" }, expected: "OK" },
                { name: "Short User", data: { "username": "bob" }, expected: "Too Short" }
            ],
            hints: [
                "Get the length: {{ len username }}",
                "Compare it: {{ less (len username) 5 }}",
                "{{ if (less (len username) 5) \"Too Short\" \"OK\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c5-s8",
            type: "challenge",
            title: "Practice: Character Limit",
            goal: "Verify code length is 3 or less",
            description: "We can also check for \"Less Than or Equal To\".\n\n**New Tool: `leq`** (Arity 2)\n\n`{{ leq number1 number2 }}`\n\n**Challenge:**\nThe `code` must be 3 characters or fewer.\nIf the length of `code` is **leq** `3`, output `\"Valid\"`. Otherwise, output `\"Invalid\"`.",
            testCases: [
                { name: "Short Code", data: { "code": "AB" }, expected: "Valid" },
                { name: "Exact Limit", data: { "code": "ABC" }, expected: "Valid" },
                { name: "Long Code", data: { "code": "ABCD" }, expected: "Invalid" }
            ],
            hints: ["{{ if (leq (len code) 3) \"Valid\" \"Invalid\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s9",
            type: "challenge",
            title: "Logic: The Glitch Fixer",
            goal: "Fix Corrupted Statuses",
            description: "Time for some **Data Janitor** work.\n\nSome users have a corrupted `status` of `\"NULL\"`. We need to display them as `\"Pending\"` instead. Everyone else keeps their real status.\n\n**Strategy:**\nIf `status` equals `\"NULL\"` -> Output `\"Pending\"`\nElse -> Output `status` (the original value)\n\n**Challenge:**\nNormalize the status codes.",
            testCases: [
                { name: "Glitch Data", data: { "status": "NULL" }, expected: "Pending" },
                { name: "Valid Data", data: { "status": "Active" }, expected: "Active" }
            ],
            hints: ["{{ if (equals status \"NULL\") \"Pending\" status }}"],
            prefill: "{{}}"
        },
        {
            id: "c5-s10",
            type: "challenge",
            title: "Concept: The Chain",
            goal: "Implement Multi-Level Permissions",
            description: "What if there are more than 2 options?\n\n**Pattern: Nested Ifs**\n\nYou can put an `if` *inside* the \"else\" slot of another `if`. This creates a chain of decisions.\n\n**Goal:**\n1. If `role` is `\"Admin\"` -> `\"Full Access\"`\n2. Else If `role` is `\"Editor\"` -> `\"Edit Access\"`\n3. Else -> `\"View Only\"`",
            testCases: [
                { name: "Admin", data: { "role": "Admin" }, expected: "Full Access" },
                { name: "Editor", data: { "role": "Editor" }, expected: "Edit Access" },
                { name: "Guest", data: { "role": "Guest" }, expected: "View Only" }
            ],
            hints: [
                "Outer check: if equals role \"Admin\" ...",
                "The 'else' is another checking: if equals role \"Editor\" ...",
                "{{ if (equals role \"Admin\") \"Full Access\" (if (equals role \"Editor\") \"Edit Access\" \"View Only\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c5-s11",
            type: "challenge",
            title: "Final Exam: Length Conditional",
            goal: "Output \"Long name\" if first name length > 5, else \"Short name\".",
            description: "Logic based on string length.",
            testCases: [
                {
                    name: "Long Name",
                    data: { "name": { "first": "Jean-O'Luc" } },
                    expected: "Long name"
                },
                {
                    name: "Short Name",
                    data: { "name": { "first": "Data" } },
                    expected: "Short name"
                }
            ],
            hints: [
                "Use {{len}} to get the length.",
                "Combine {{if}}, {{greater}}, and {{len}}."
            ],
            prefill: "{{}}"
        }
    ]
};
