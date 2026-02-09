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
            description: "Before we tackle missing data, let's review `concat`.\n\n**Tool: `concat`** — Arity 2\n\n**Challenge:**\nJoin `name.first` and `name.last` with a space in between.",
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
            description: "What happens when you try to access a field that doesn't exist?\n\n**The Problem:** If you write `{{ name.middle }}` but the data doesn't have a `middle` field, the formula **throws an error**.\n\n**The Data Below:**\nNotice there is NO `middle` field in the name object.\n\n**Challenge:**\nTry to output `name.middle` and observe the error.\n\nDon't worry, this is supposed to fail! Click 'Skip Step' to continue.",
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
            description: "We need a way to access fields that might not exist.\n\n**New Tool: `ignoreIfNull`** — Arity 1\n\n`{{ ignoreIfNull field }}`\n\n**How it works:**\n• If the field exists → returns its value\n• If the field is missing → returns empty string `\"\"`\n• **No crash!**\n\n**Challenge:**\nUse `ignoreIfNull` to safely access `name.middle`.\n\nThe output will be empty since there's no middle name, but it won't crash!",
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
            description: "Let's practice with a different optional field.\n\n**Challenge:**\nSafely access `user.nickname`. If it exists, show it. If not, show nothing.",
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
            title: "Concept: What Does ignoreIfNull Return When the Field Is Missing?",
            goal: "See that ignoreIfNull returns an empty string for missing fields",
            description: "Before we go further, let's make something concrete.\n\nWhen a field is missing, `ignoreIfNull` returns an **empty string** — `\"\"`.\n\nAn empty string looks like... nothing. It's a blank value. But it's important because **the `if` function treats empty strings as false.**\n\nLet's see this in action.\n\n**Challenge:**\nUse `if` to check `ignoreIfNull user.title`.\n• If it has a value, output `\"yes\"`\n• If it's empty, output `\"no\"`\n\nSince `user.title` is missing in the first test case, `ignoreIfNull` will return `\"\"`, and `if` will treat that as false — so you should see `\"no\"`.",
            testCases: [
                { name: "Missing field", data: { "user": { "name": "Jean" } }, expected: "no" },
                { name: "Has field", data: { "user": { "title": "Captain" } }, expected: "yes" }
            ],
            hints: [
                "Use ignoreIfNull user.title as the condition for if",
                "{{ if ignoreIfNull user.title \"yes\" \"no\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s6",
            type: "challenge",
            title: "Practice: Exists or Not?",
            goal: "Check if a field exists and show a label",
            description: "Let's practice the pattern from the last step with different words.\n\n**Challenge:**\nIf `status` exists, output `\"Active\"`. If `status` is missing, output `\"Inactive\"`.",
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
            id: "c8-s7",
            type: "challenge",
            title: "Concept: Showing the Field's Own Value",
            goal: "If a field exists, show its actual value",
            description: "So far, when a field exists, we've output a **fixed word** like `\"Active\"` or `\"yes\"`.\n\nBut what if we want to show **the field's actual value** when it exists?\n\nWe can use the field itself as the \"true\" output:\n\n`{{ if ignoreIfNull role ignoreIfNull role \"Guest\" }}`\n\n• If `role` is `\"Admin\"` → output `\"Admin\"` (the actual value!)\n• If `role` is missing → output `\"Guest\"`\n\n**Challenge:**\nIf `role` exists, output its value. If not, output `\"Guest\"`.",
            testCases: [
                { name: "Has Role", data: { "role": "Admin" }, expected: "Admin" },
                { name: "No Role", data: { "user": "test" }, expected: "Guest" }
            ],
            hints: [
                "The condition and the true branch both use ignoreIfNull role",
                "{{ if ignoreIfNull role ignoreIfNull role \"Guest\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s8",
            type: "challenge",
            title: "Practice: Conditional Display",
            goal: "Show middle name or a default message",
            description: "Same pattern, different field. This time with a nested field.\n\n**Challenge:**\nIf `name.middle` exists, output it. Otherwise output `\"No Middle Name\"`.",
            testCases: [
                { name: "Has Middle", data: { "name": { "middle": "Beth" } }, expected: "Beth" },
                { name: "No Middle", data: { "name": { "first": "Amy" } }, expected: "No Middle Name" }
            ],
            hints: [
                "Check if middle exists: ignoreIfNull name.middle",
                "If true, show it. If false, show the default.",
                "{{ if ignoreIfNull name.middle ignoreIfNull name.middle \"No Middle Name\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s9",
            type: "challenge",
            title: "Concept: Concat with If",
            goal: "Attach a conditional value to static text",
            description: "So far we've used `if` on its own. But what if we want to **attach** the result of an `if` to some static text?\n\nWe can use `concat` to join a static string with the result of an `if`:\n\n`{{ concat \"Tag: \" if ignoreIfNull tag ignoreIfNull tag \"None\" }}`\n\n• `concat` takes two things: `\"Tag: \"` and the result of the `if`\n• The `if` decides: show the tag value, or show `\"None\"`\n\n**Challenge:**\nIf `tag` exists, output `\"Tag: VIP\"`. If `tag` is missing, output `\"Tag: None\"`.",
            testCases: [
                { name: "Has Tag", data: { "tag": "VIP" }, expected: "Tag: VIP" },
                { name: "No Tag", data: { "user": "test" }, expected: "Tag: None" }
            ],
            hints: [
                "Start with concat and the static part: \"Tag: \"",
                "Then use if ignoreIfNull tag to pick the value",
                "{{ concat \"Tag: \" if ignoreIfNull tag ignoreIfNull tag \"None\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s10",
            type: "challenge",
            title: "Concept: The Trailing Space Problem",
            goal: "See why naive concat causes trailing spaces",
            description: "Before the next challenge, let's **see a problem** that comes up in real formatting.\n\nTry this: `{{ concat \"Prefix: \" ignoreIfNull tag }}`\n\nWhen `tag` is `\"VIP\"`, you get `\"Prefix: VIP\"` — great!\n\nBut when `tag` is missing, you get `\"Prefix: \"` — there's a **trailing space**. That's messy.\n\n**Challenge:**\nType `{{ concat \"Prefix: \" ignoreIfNull tag }}` and observe what happens when the tag is missing. See the extra space?\n\nDon't worry — we'll fix this in the next step!",
            testCases: [
                { name: "Has Tag", data: { "tag": "VIP" }, expected: "Prefix: VIP" },
                { name: "No Tag (has trailing space)", data: { "user": "test" }, expected: "Prefix: " }
            ],
            hints: [
                "Just type it exactly: concat \"Prefix: \" ignoreIfNull tag",
                "{{ concat \"Prefix: \" ignoreIfNull tag }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s11",
            type: "challenge",
            title: "Practice: Conditional Separator",
            goal: "Add a space only if field exists",
            description: "Now let's **fix** the trailing space problem from the last step.\n\n**The Idea:** Instead of always including the space, make the space **conditional**. Use `if` to decide:\n• If `tag` exists → concat a space + the tag value\n• If `tag` is missing → concat an empty string (nothing)\n\n**The Goal:**\n• If `tag` is `\"VIP\"` → Output: `\"Prefix: VIP\"`\n• If `tag` is missing → Output: `\"Prefix:\"` — **No trailing space!**\n\nYou already know how to concat a static part with an `if` result. Now the `if`'s true branch itself uses `concat` to join a space with the tag.",
            testCases: [
                { name: "Has Tag", data: { "tag": "VIP" }, expected: "Prefix: VIP" },
                { name: "No Tag", data: { "user": "test" }, expected: "Prefix:" }
            ],
            hints: [
                "1. Start with the static part: \"Prefix:\"",
                "2. Use 'if' to decide what to concat after it.",
                "3. If 'ignoreIfNull tag' is true → concat \" \" with ignoreIfNull tag.",
                "4. If false → just an empty string \"\".",
                "{{ concat \"Prefix:\" if ignoreIfNull tag concat \" \" ignoreIfNull tag \"\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s12",
            type: "challenge",
            title: "Reinforcement: Full Name Builder",
            goal: "Practice nested concat with optional field",
            description: "Let's build on the pattern from the last step.\n\n**The Goal:**\n• If `suffix` is `\"Jr\"` → Output: `\"Jean Jr\"` — Space + suffix included\n• If `suffix` is missing → Output: `\"Jean\"` — **No trailing space**\n\n**Challenge:**\nOutput `name.first` followed by a conditional space and the `name.suffix` field.",
            testCases: [
                { name: "Has Suffix", data: { "name": { "first": "Jean", "suffix": "Jr" } }, expected: "Jean Jr" },
                { name: "No Suffix", data: { "name": { "first": "Jean" } }, expected: "Jean" }
            ],
            hints: [
                "1. Start with name.first",
                "2. Use 'if' to decide what to add next.",
                "3. If 'ignoreIfNull name.suffix' is true, concat a space with 'ignoreIfNull name.suffix'.",
                "4. If false, just add an empty string \"\".",
                "{{ concat name.first if ignoreIfNull name.suffix concat \" \" name.suffix \"\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s13",
            type: "challenge",
            title: "Exam 1: Middle Name or Nothing",
            goal: "Output the middle name if it exists, otherwise nothing.",
            description: "First checkpoint! This should be straightforward now.\n\n**Challenge:**\nOutput `name.middle` if it exists. If it doesn't exist, output nothing.",
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
            id: "c8-s14",
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
                "{{ if ignoreIfNull name.middle ignoreIfNull name.middle \"No Middle Name\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s15",
            type: "challenge",
            title: "Exam 3: First Name + Optional Middle",
            goal: "Output first name, and conditionally add the middle name after it.",
            description: "Almost there! This is the last step before the final exam.\n\n**Requirements:**\n• If middle name exists: `\"Amy Beth\"`\n• If no middle name: `\"Amy\"`\n• No extra spaces!\n\n**Strategy:**\n1. Start with `name.first`\n2. Use `if` to check if `name.middle` exists\n3. If yes → concat a space + the middle name\n4. If no → concat an empty string",
            testCases: [
                {
                    name: "Has Middle",
                    data: { "name": { "first": "Amy", "middle": "Beth" } },
                    expected: "Amy Beth"
                },
                {
                    name: "No Middle",
                    data: { "name": { "first": "Amy" } },
                    expected: "Amy"
                }
            ],
            hints: [
                "1. Start with name.first as the first part of concat.",
                "2. The second part of concat is an if that checks ignoreIfNull name.middle.",
                "3. If true → concat \" \" with ignoreIfNull name.middle.",
                "4. If false → \"\".",
                "{{ concat name.first if ignoreIfNull name.middle concat \" \" ignoreIfNull name.middle \"\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c8-s16",
            type: "challenge",
            title: "Final Exam: Full Name with Optional Middle",
            goal: "Create a template that checks for a middle name. If it exists, include it between first and last names. If not, just First Last.",
            description: "The ultimate challenge! Combine everything you've learned.\n\n**Requirements:**\n\n• If middle name exists: `\"First Middle Last\"`\n• If no middle name: `\"First Last\"`\n• No extra spaces!\n\n**Strategy — think of it as four parts joined together:**\n1. `name.first`\n2. `\" \"` — there's always a space before last name\n3. If middle exists, `middle + \" \"` — otherwise `\"\"` (nothing)\n4. `name.last`",
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
                "1. The outer structure is: concat name.first concat \" \" concat ??? name.last",
                "2. The ??? is the conditional middle part.",
                "3. The middle part: if ignoreIfNull name.middle concat ignoreIfNull name.middle \" \" \"\"",
                "4. This means: if middle exists, add \"middle + space\". If not, add nothing.",
                "{{ concat name.first concat \" \" concat if ignoreIfNull name.middle concat ignoreIfNull name.middle \" \" \"\" name.last }}"
            ],
            prefill: "{{}}"
        }
    ]
};
