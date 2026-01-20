export const chapter8 = {
    id: "chapter-8",
    title: "Chapter 8: Handling Missing Data",
    description: "Safely work with optional fields using ignoreIfNull.",
    functions: ["ignoreIfNull"],
    steps: [
        {
            id: "c8-s1",
            type: "challenge",
            title: "Refresher: Concatenation",
            goal: "Join first and last name with a space",
            description: "Before we tackle missing data, let's review `concat`.\n\n**Tool: `concat`** (Arity 2)\n\n**Challenge:**\nJoin `name.first` and `name.last` with a space in between.",
            testCases: [
                { name: "Standard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Jean Picard" }
            ],
            hints: ["{{ concat name.first concat \" \" name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c8-s2",
            type: "challenge",
            title: "Concept: The Missing Field Problem",
            goal: "See what happens with missing data",
            description: "What happens when you try to access a field that doesn't exist?\n\n**The Problem:** If you write `{{ name.middle }}` but the data doesn't have a `middle` field, the formula **throws an error**.\n\n**The Data Below:**\nNotice there is NO `middle` field in the name object.\n\n**Challenge:**\nTry to output `name.middle` and observe the error.\n\n(Don't worry, this is supposed to fail! Click 'Skip Step' to continue.)",
            referenceDataPlacement: "top",
            testCases: [
                { name: "No Middle", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "" }
            ],
            hints: ["{{ name.middle }}"],
            prefill: "{{}}"
        },
        {
            id: "c8-s3",
            type: "challenge",
            title: "New Tool: ignoreIfNull",
            goal: "Safely access an optional field",
            description: "We need a way to access fields that might not exist.\n\n**New Tool: `ignoreIfNull`** (Arity 1)\n\n`{{ ignoreIfNull field }}`\n\n**How it works:**\n• If the field exists → returns its value\n• If the field is missing → returns empty string `\"\"`\n• **No crash!**\n\n**Challenge:**\nUse `ignoreIfNull` to safely access `name.middle`.\n\n(The output will be empty since there's no middle name, but it won't crash!)",
            referenceDataPlacement: "top",
            testCases: [
                { name: "No Middle", data: { "name": { "first": "Jean" } }, expected: "" },
                { name: "Has Middle", data: { "name": { "middle": "Tiberius" } }, expected: "Tiberius" }
            ],
            hints: ["{{ ignoreIfNull name.middle }}"],
            prefill: "{{}}"
        },
        {
            id: "c8-s4",
            type: "challenge",
            title: "Practice: Optional Fields",
            goal: "Access an optional nickname",
            description: "Let's practice with a different optional field.\n\n**Challenge:**\nSafely access `user.nickname`. If it exists, show it. If not, show nothing (empty string).",
            testCases: [
                { name: "Has Nickname", data: { "user": { "nickname": "Captain" } }, expected: "Captain" },
                { name: "No Nickname", data: { "user": { "name": "Jean" } }, expected: "" }
            ],
            hints: ["{{ ignoreIfNull user.nickname }}"],
            prefill: "{{}}"
        },
        {
            id: "c8-s5",
            type: "challenge",
            title: "Concept: Truthiness",
            goal: "Understand how if treats empty strings",
            description: "Here's a powerful concept: **Empty strings are treated as `false` by the `if` function.**\n\n**Truthiness Rules:**\n• Empty string `\"\"` → `false`\n• Any non-empty string → `true`\n\n**Why this matters:**\n`{{ if (ignoreIfNull name.middle) ... }}`\n• If middle exists → truthy → first branch\n• If middle missing → empty string → falsy → second branch\n\n**Challenge:**\nIf `status` exists (is not empty), output `\"Active\"`. Otherwise output `\"Inactive\"`.",
            testCases: [
                { name: "Has Status", data: { "status": "online" }, expected: "Active" },
                { name: "No Status", data: { "user": "test" }, expected: "Inactive" }
            ],
            hints: [
                "Use ignoreIfNull to safely get status",
                "{{ if ignoreIfNull status \"Active\" \"Inactive\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s6",
            type: "challenge",
            title: "Practice: Conditional Display",
            goal: "Show middle name or a default message",
            description: "Now let's combine `ignoreIfNull` with `if` to provide a fallback.\n\n**Pattern:**\n```\n{{ if ignoreIfNull field \n     field \n     \"default\" \n}}\n```\n\n**Challenge:**\nIf `name.middle` exists, output it. Otherwise output `\"No Middle Name\"`.",
            testCases: [
                { name: "Has Middle", data: { "name": { "middle": "Beth" } }, expected: "Beth" },
                { name: "No Middle", data: { "name": { "first": "Amy" } }, expected: "No Middle Name" }
            ],
            hints: [
                "Check if middle exists: ignoreIfNull name.middle",
                "If true, show it. If false, show default.",
                "{{ if ignoreIfNull name.middle ignoreIfNull name.middle \"No Middle Name\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s7",
            type: "challenge",
            title: "Practice: Conditional Separator",
            goal: "Add a space only if field exists",
            description: "Here's a tricky one: How do you add a space **only** if a field exists?\n\n**The Problem:**\n`{{ concat \"Hello\" concat \" \" name.middle }}`\n→ If middle is missing, you get `\"Hello \"` (trailing space)\n\n**The Solution:**\nMake the space conditional too!\n\n**Challenge:**\nOutput `\"Prefix: \"` followed by the `tag` field. But only add the space if `tag` exists.",
            testCases: [
                { name: "Has Tag", data: { "tag": "VIP" }, expected: "Prefix: VIP" },
                { name: "No Tag", data: { "user": "test" }, expected: "Prefix:" }
            ],
            hints: [
                "If tag exists, concat \" \" with tag",
                "{{ concat \"Prefix:\" (if (ignoreIfNull tag) (concat \" \" (ignoreIfNull tag)) \"\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s8",
            type: "challenge",
            title: "Reinforcement: Full Name Builder",
            goal: "Practice nested concat with optional field",
            description: "Let's build up to the final challenge.\n\n**Challenge:**\nOutput `name.first` followed by a space, then `name.suffix` (like \"Jr\" or \"Sr\").\n\nBut only add the space and suffix if `suffix` exists.\n\nExamples:\n• If suffix exists: `\"Jean Jr\"`\n• If no suffix: `\"Jean\"`",
            testCases: [
                { name: "Has Suffix", data: { "name": { "first": "Jean", "suffix": "Jr" } }, expected: "Jean Jr" },
                { name: "No Suffix", data: { "name": { "first": "Jean" } }, expected: "Jean" }
            ],
            hints: [
                "Start with first name",
                "Conditionally add space + suffix",
                "{{ concat name.first (if (ignoreIfNull name.suffix) (concat \" \" (ignoreIfNull name.suffix)) \"\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s9",
            type: "challenge",
            title: "Exam 1: Middle Name or Nothing",
            goal: "Output the middle name if it exists, otherwise nothing.",
            description: "First checkpoint! This should be straightforward now.\n\n**Challenge:**\nOutput `name.middle` if it exists. If it doesn't exist, output nothing (empty string).",
            testCases: [
                {
                    name: "User with middle name",
                    data: { "name": { "middle": "Beth" } },
                    expected: "Beth"
                },
                {
                    name: "User with no middle name",
                    data: { "name": { "first": "Amy" } },
                    expected: ""
                }
            ],
            hints: ["{{ ignoreIfNull name.middle }}"],
            prefill: "{{}}"
        },
        {
            id: "c8-s10",
            type: "challenge",
            title: "Exam 2: Middle Name with Fallback",
            goal: "Output the middle name if it exists, otherwise \"No Middle Name\".",
            description: "Second checkpoint! Add a fallback message.\n\n**Challenge:**\nOutput `name.middle` if it exists. If it doesn't exist, output `\"No Middle Name\"`.",
            testCases: [
                {
                    name: "User with middle name",
                    data: { "name": { "middle": "Beth" } },
                    expected: "Beth"
                },
                {
                    name: "User with no middle name",
                    data: { "name": { "first": "Amy" } },
                    expected: "No Middle Name"
                }
            ],
            hints: [
                "Use if with ignoreIfNull",
                "{{ if (ignoreIfNull name.middle) (ignoreIfNull name.middle) \"No Middle Name\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s11",
            type: "challenge",
            title: "Final Exam: Full Name with Optional Middle",
            goal: "Create a template that checks for a middle name. If it exists, include it between first and last names. If not, just First Last.",
            description: "The ultimate challenge! Combine everything you've learned.\n\n**Requirements:**\n\n• If middle name exists: `\"First Middle Last\"`\n• If no middle name: `\"First Last\"`\n• No extra spaces!\n\n**Strategy:**\n1. Start with `name.first`\n2. Add a space\n3. Conditionally add middle + space (only if middle exists)\n4. Add `name.last`",
            testCases: [
                {
                    name: "User with Middle Name",
                    data: { "name": { "first": "Amy", "middle": "Beth", "last": "Farrah Fowler" } },
                    expected: "Amy Beth Farrah Fowler"
                },
                {
                    name: "User without Middle Name",
                    data: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
                    expected: "Jean-O'Luc Picard"
                }
            ],
            hints: [
                "Start: concat name.first concat \" \" ...",
                "Middle part: (if (ignoreIfNull name.middle) (concat (ignoreIfNull name.middle) \" \") \"\")",
                "End with name.last"
            ],
            prefill: "{{}}"
        }
    ]
};
