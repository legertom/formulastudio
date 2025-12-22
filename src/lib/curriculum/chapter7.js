export const chapter7 = {
    id: "chapter-7",
    title: "Chapter 7: Nested Logic",
    description: "Chaining multiple if statements.",
    steps: [
        {
            id: "c7-s1",
            type: "challenge",
            title: "Refresher: Simple If/Else",
            goal: "Output 'Admin' or 'User' based on role",
            description: "Before we dive into nested logic, let's review the basic `if` statement.\n\n**Tool: `if`** (Arity 3)\n\n`{{ if condition then_value else_value }}`\n\n**Challenge:**\nIf the `role` is `\"Admin\"`, output `\"Admin\"`. Otherwise, output `\"User\"`.",
            testCases: [
                { name: "Admin", data: { "role": "Admin" }, expected: "Admin" },
                { name: "Guest", data: { "role": "Guest" }, expected: "User" }
            ],
            hints: ["{{ if (equals role \"Admin\") \"Admin\" \"User\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c7-s2",
            type: "challenge",
            title: "Concept: The Else-If Pattern",
            goal: "Understand nested if structure",
            description: "What if we have **3 possible outcomes** instead of just 2?\n\nWe can put an `if` statement inside the **else slot** of another `if`!\n\n**Structure:**\n```\n{{ if condition1 \n     value1 \n     if condition2 value2 value3 \n}}\n```\n\n**How it works:**\n• If condition1 is true → value1\n• Else, check condition2:\n  • If condition2 is true → value2\n  • Else → value3\n\n**Challenge:**\nIf `fast` is true → `\"Fast\"`, else if `slow` is true → `\"Slow\"`, else → `\"Stopped\"`.",
            testCases: [
                { name: "Fast", data: { "fast": true, "slow": false }, expected: "Fast" },
                { name: "Slow", data: { "fast": false, "slow": true }, expected: "Slow" },
                { name: "Stopped", data: { "fast": false, "slow": false }, expected: "Stopped" }
            ],
            hints: [
                "Start with: {{ if fast \"Fast\" ...",
                "The else slot needs another if: ... (if slow \"Slow\" \"Stopped\")",
                "{{ if fast \"Fast\" (if slow \"Slow\" \"Stopped\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s3",
            type: "challenge",
            title: "Practice: Three-Way Choice",
            goal: "Implement traffic light logic",
            description: "Let's practice the nested `if` pattern with boolean variables.\n\n**Challenge:**\nIf `go` is true → `\"Green\"`, else if `caution` is true → `\"Yellow\"`, else → `\"Red\"`.",
            testCases: [
                { name: "Green Light", data: { "go": true, "caution": false }, expected: "Green" },
                { name: "Yellow Light", data: { "go": false, "caution": true }, expected: "Yellow" },
                { name: "Red Light", data: { "go": false, "caution": false }, expected: "Red" }
            ],
            hints: ["{{ if go \"Green\" (if caution \"Yellow\" \"Red\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c7-s4",
            type: "challenge",
            title: "Practice: Three-Way with Equals",
            goal: "Check membership tier",
            description: "Now let's use `equals` instead of boolean variables.\n\n**Challenge:**\nIf `tier` is `\"VIP\"` → `\"VIP\"`, else if `tier` is `\"Member\"` → `\"Member\"`, else → `\"Guest\"`.",
            testCases: [
                { name: "VIP", data: { "tier": "VIP" }, expected: "VIP" },
                { name: "Member", data: { "tier": "Member" }, expected: "Member" },
                { name: "Guest", data: { "tier": "Basic" }, expected: "Guest" }
            ],
            hints: [
                "First check: (equals tier \"VIP\")",
                "Second check: (equals tier \"Member\")",
                "{{ if (equals tier \"VIP\") \"VIP\" (if (equals tier \"Member\") \"Member\" \"Guest\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s5",
            type: "challenge",
            title: "Concept: Order Matters",
            goal: "Understand check sequence importance",
            description: "**CRITICAL INSIGHT:** The order of your checks matters!\n\nIf you check for `\"2025\"` first, then `\"2037\"`, you get different logic than checking `\"2037\"` first.\n\n**Why?** The first check that returns `true` wins. The rest are never evaluated.\n\n**Challenge:**\nCheck in this specific order:\n1. If `year` is `\"2037\"` → `\"Future\"`\n2. Else if `year` is `\"2025\"` → `\"Present\"`\n3. Else → `\"Past\"`",
            testCases: [
                { name: "Future", data: { "year": "2037" }, expected: "Future" },
                { name: "Present", data: { "year": "2025" }, expected: "Present" },
                { name: "Past", data: { "year": "2020" }, expected: "Past" }
            ],
            hints: ["{{ if (equals year \"2037\") \"Future\" (if (equals year \"2025\") \"Present\" \"Past\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c7-s6",
            type: "challenge",
            title: "Practice: Numeric Grading",
            goal: "Assign letter grades",
            description: "Nested `if` works great with numeric comparisons too!\n\n**Challenge:**\nIf `score` is greater than `90` → `\"A\"`, else if greater than `80` → `\"B\"`, else → `\"C\"`.",
            testCases: [
                { name: "A Grade", data: { "score": 95 }, expected: "A" },
                { name: "B Grade", data: { "score": 85 }, expected: "B" },
                { name: "C Grade", data: { "score": 75 }, expected: "C" }
            ],
            hints: [
                "Use greater for comparisons",
                "{{ if (greater score 90) \"A\" (if (greater score 80) \"B\" \"C\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s7",
            type: "challenge",
            title: "Practice: Nested Data Access",
            goal: "Check account type from nested object",
            description: "Let's combine **dot notation** with nested logic.\n\n**Challenge:**\nAccess `user.account.type` and check:\n• If `\"Premium\"` → `\"Premium\"`\n• Else if `\"Basic\"` → `\"Basic\"`\n• Else → `\"Trial\"`",
            testCases: [
                { name: "Premium", data: { "user": { "account": { "type": "Premium" } } }, expected: "Premium" },
                { name: "Basic", data: { "user": { "account": { "type": "Basic" } } }, expected: "Basic" },
                { name: "Trial", data: { "user": { "account": { "type": "Free" } } }, expected: "Trial" }
            ],
            hints: [
                "Access the field: user.account.type",
                "{{ if (equals user.account.type \"Premium\") \"Premium\" (if (equals user.account.type \"Basic\") \"Basic\" \"Trial\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s8",
            type: "challenge",
            title: "Reinforcement: Order Status",
            goal: "Build confidence with similar pattern",
            description: "One more practice before the final exam!\n\n**Challenge:**\nCheck `order.status` in this order:\n• If `\"Shipped\"` → `\"Shipped\"`\n• Else if `\"Processing\"` → `\"Processing\"`\n• Else → `\"Pending\"`",
            testCases: [
                { name: "Shipped", data: { "order": { "status": "Shipped" } }, expected: "Shipped" },
                { name: "Processing", data: { "order": { "status": "Processing" } }, expected: "Processing" },
                { name: "Pending", data: { "order": { "status": "New" } }, expected: "Pending" }
            ],
            hints: ["{{ if (equals order.status \"Shipped\") \"Shipped\" (if (equals order.status \"Processing\") \"Processing\" \"Pending\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c7-s9",
            type: "challenge",
            title: "Final Exam: Graduation Status",
            goal: "Output \"New Student\" (2037), \"Former Student\" (2025), or \"Current Student\" (Checked in that order).",
            description: "Put it all together!\n\n**Challenge:**\nCheck `student.graduation_year` in this specific order:\n• If `\"2037\"` → `\"New Student\"`\n• Else if `\"2025\"` → `\"Former Student\"`\n• Else → `\"Current Student\"`",
            testCases: [
                {
                    name: "New Student",
                    data: { "student": { "graduation_year": "2037" } },
                    expected: "New Student"
                },
                {
                    name: "Former Student",
                    data: { "student": { "graduation_year": "2025" } },
                    expected: "Former Student"
                },
                {
                    name: "Current Student",
                    data: { "student": { "graduation_year": "2030" } },
                    expected: "Current Student"
                }
            ],
            hints: [
                "Access the field: student.graduation_year",
                "Check \"2037\" first, then \"2025\"",
                "Structure: {{ if cond1 val1 (if cond2 val2 val3) }}"
            ],
            prefill: "{{}}"
        }
    ]
};
