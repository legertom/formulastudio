export const chapter2 = {
    id: "chapter-2",
    title: "Chapter 2: String Manipulation",
    description: "Learn to join strings and manipulate text using functions.",
    functions: ["toUpper", "toLower", "length", "concat"],
    steps: [
        // === toUpper Block (S1-4): OBSERVE → MODIFY → WRITE → PRACTICE ===
        {
            id: "c2-s1",
            type: "challenge",
            title: "Meet Your First Function",
            goal: "See what toUpper does",
            description: "Functions are the **Verbs** of code. They are magic words that **DO** things to your data.\n\nThere are only about 30 of them, and each one does a specific, unique job.\n\n**New Tool: `toUpper`** (Arity 1)\n\n`{{ toUpper text }}`\n\nConverts all letters to UPPERCASE. Think of it like the CAPS LOCK key.\n\n**Challenge:**\nThe code is already written below. Look at the output to see what `toUpper` does!",
            testCases: [
                { name: "Test", data: {}, expected: "HELLO" }
            ],
            hints: ["The code is already written - just observe the result!"],
            prefill: "{{ toUpper \"hello\" }}"
        },
        {
            id: "c2-s2",
            type: "challenge",
            title: "Change the Input",
            goal: "Change \"hello\" to \"world\"",
            description: "Great! You just saw your first function in action.\n\nThe text inside the quotes is called an **Argument**—it's the input you give to the function.\n\n**Challenge:**\nModify the code to uppercase the word `\"world\"` instead of `\"hello\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "WORLD" }
            ],
            hints: ["Change \"hello\" to \"world\""],
            prefill: "{{ toUpper \"hello\" }}"
        },
        {
            id: "c2-s3",
            type: "challenge",
            title: "Write It Yourself",
            goal: "Uppercase the word \"goodbye\"",
            description: "Now try writing the whole thing from scratch!\n\n**Pattern:** `{{ function argument }}`\n\n**Challenge:**\nUse `toUpper` to uppercase the word `\"goodbye\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "GOODBYE" }
            ],
            hints: ["Type {{ toUpper \"goodbye\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s4",
            type: "challenge",
            title: "Functions on Variables",
            goal: "Uppercase the first name",
            description: "Arguments can also be **Variables** (Fields from your data).\n\nInstead of typing `\"Jean\"`, you can use `name.first` to reference the data.\n\n**Challenge:**\nUse `toUpper` on the `name.first` variable.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "JEAN" },
                { name: "William", data: { "name": { "first": "William" } }, expected: "WILLIAM" }
            ],
            hints: ["Type {{ toUpper name.first }}"],
            prefill: "{{}}"
        },

        // === toLower Block (S5-7): NEW TOOL → PRACTICE → COMPARE ===
        {
            id: "c2-s5",
            type: "challenge",
            title: "The Opposite: toLower",
            goal: "Lowercase the first name",
            description: "Every CAPS LOCK has an opposite.\n\n**New Tool: `toLower`** (Arity 1)\n\n`{{ toLower text }}`\n\nConverts all letters to lowercase. The mirror image of `toUpper`.\n\n**Challenge:**\nUse `toLower` on the `name.first` variable.",
            testCases: [
                { name: "JEAN", data: { "name": { "first": "JEAN" } }, expected: "jean" },
                { name: "Mixed", data: { "name": { "first": "JeAn" } }, expected: "jean" }
            ],
            hints: ["Type {{ toLower name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s6",
            type: "challenge",
            title: "Practice: toLower",
            goal: "Lowercase the department name",
            description: "Let's practice with a different variable.\n\n**Challenge:**\nUse `toLower` on the `department` variable.",
            testCases: [
                { name: "Engineering", data: { "department": "ENGINEERING" }, expected: "engineering" },
                { name: "Sales", data: { "department": "Sales" }, expected: "sales" }
            ],
            hints: ["Type {{ toLower department }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s7",
            type: "challenge",
            title: "toUpper vs toLower",
            goal: "Choose the right function",
            description: "Time for a quick decision!\n\nThe system needs all status codes in UPPERCASE.\n\n**Challenge:**\nConvert the `status` to uppercase.",
            testCases: [
                { name: "Active", data: { "status": "active" }, expected: "ACTIVE" },
                { name: "Pending", data: { "status": "pending" }, expected: "PENDING" }
            ],
            hints: ["Which function makes text UPPERCASE?", "{{ toUpper status }}"],
            prefill: "{{}}"
        },

        // === length Block (S8-10): NEW TOOL → PRACTICE → USE CASE ===
        {
            id: "c2-s8",
            type: "challenge",
            title: "Counting Characters",
            goal: "Count the letters in \"argument\"",
            description: "Not all functions transform text—some analyze it.\n\n**New Tool: `length`** (Arity 1)\n\n`{{ length text }}`\n\nCounts the number of characters in text. Like counting letters on a Scrabble board.\n\n**Challenge:**\nUse `length` to count the letters in `\"argument\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "8" }
            ],
            hints: ["Type {{ length \"argument\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s9",
            type: "challenge",
            title: "Practice: length",
            goal: "Count the characters in the first name",
            description: "Let's apply `length` to a variable.\n\n**Challenge:**\nCount the characters in `name.first`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "4" },
                { name: "Jean-Luc", data: { "name": { "first": "Jean-Luc" } }, expected: "8" }
            ],
            hints: ["Type {{ length name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s10",
            type: "challenge",
            title: "Why Length Matters",
            goal: "Check the length of the username",
            description: "Real-world use case: Validating input length.\n\nUsernames often have character limits. The first step is knowing how long they are.\n\n**Challenge:**\nGet the `length` of the `username` field.",
            testCases: [
                { name: "Short", data: { "username": "jdoe" }, expected: "4" },
                { name: "Long", data: { "username": "captain_picard" }, expected: "14" }
            ],
            hints: ["Type {{ length username }}"],
            prefill: "{{}}"
        },

        // === concat Block (S11-15): NEW TOOL → 4 progressive practices ===
        {
            id: "c2-s11",
            type: "challenge",
            title: "Joining Text",
            goal: "Join \"Super\" and \"Man\"",
            description: "Some functions need more than one argument.\n\n**New Tool: `concat`** (Arity 2)\n\n`{{ concat text1 text2 }}`\n\nShort for \"concatenate\"—it glues two pieces of text together. Like taping two pieces of paper end-to-end.\n\n**Challenge:**\nUse `concat` to join `\"Super\"` and `\"Man\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "SuperMan" }
            ],
            hints: ["Type {{ concat \"Super\" \"Man\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s12",
            type: "challenge",
            title: "Variable Concatenation",
            goal: "Join first and last name",
            description: "You can join two variables together.\n\n**Challenge:**\nCreate a format like `FirstLast` (e.g., \"JeanPicard\").",
            testCases: [
                { name: "Picard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "JeanPicard" }
            ],
            hints: ["Type {{ concat name.first name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s13",
            type: "challenge",
            title: "The Space Problem",
            goal: "Add a space before the last name",
            description: "We're building up to a full name: `First` + `\" \"` + `Last`.\n\nLet's build the second part first.\n\n**Why the space?**\nComputers don't know English grammar. If you want a space between words, you must explicitly include it.\n\n**Challenge:**\nConcatenate a **space** `\" \"` with `name.last`.",
            testCases: [
                { name: "Picard", data: { "name": { "last": "Picard" } }, expected: " Picard" }
            ],
            hints: ["Type {{ concat \" \" name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s14",
            type: "challenge",
            title: "Mixed Arguments",
            goal: "Add a prefix to the last name",
            description: "You can mix **Strings** and **Variables**.\n\n**Challenge:**\nJoin the text `\"Agent \"` (notice the space!) with the `name.last` variable.",
            testCases: [
                { name: "Bond", data: { "name": { "last": "Bond" } }, expected: "Agent Bond" }
            ],
            hints: ["Type {{ concat \"Agent \" name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s15",
            type: "challenge",
            title: "Exam: Full Name",
            goal: "Output First + Space + Last",
            description: "Combine everything you've learned to build a Full Name.\n\n**The Goal:** Join the `name.first` and `name.last` fields with a **space** in the middle.\n\n💡 **HINT:** You'll need to nest a `concat` inside another `concat`.\n\nThink of it as: `First + (Space + Last)`",
            testCases: [
                { name: "Standard User", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Jean Picard" }
            ],
            hints: [
                "First: concat \" \" name.last → \" Picard\"",
                "Then: concat name.first (result) → \"Jean Picard\"",
                "{{ concat name.first (concat \" \" name.last) }}"
            ],
            prefill: "{{}}"
        },

        // === Nesting Block (S16-18): CONCEPT → PRACTICE → EXAM ===
        {
            id: "c2-s16",
            type: "challenge",
            title: "Functions Inside Functions",
            goal: "Shout a greeting to Jean",
            description: "Functions can be used inside other functions. This is called **Nesting**.\n\nThink of it in steps:\n1. The **inner** function runs first: `toUpper` turns `name.first` into \"JEAN\".\n2. The **outer** function runs next: `concat` joins \"HELLO \" with that result.\n\n**Challenge:**\nCreate the output `\"HELLO JEAN\"` by nesting `toUpper` inside `concat`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "HELLO JEAN" }
            ],
            hints: ["Type {{ concat \"HELLO \" (toUpper name.first) }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s17",
            type: "challenge",
            title: "Outer Nesting",
            goal: "Shout the whole greeting",
            description: "You can also transform the **result** of a function.\n\nThis time, let's build the greeting first, THEN uppercase the whole thing.\n\n**Challenge:**\n1. Use `concat` to join `\"Hello \"` and `name.first`.\n2. Wrap the WHOLE thing in `toUpper`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "HELLO JEAN" }
            ],
            hints: ["Type {{ toUpper (concat \"Hello \" name.first) }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s18",
            type: "challenge",
            title: "Chapter 2 Final Exam",
            goal: "Create a formatted greeting",
            description: "Put it ALL together!\n\n**The Goal:**\nCreate the output: `\"WELCOME, [FIRST] [LAST]!\"`\n\nFor example: `\"WELCOME, JEAN PICARD!\"`\n\n**Steps:**\n1. Build the full name (First + Space + Last).\n2. Add `\"WELCOME, \"` before and `\"!\"` after.\n3. Uppercase the whole thing.\n\n**Good luck!**",
            testCases: [
                {
                    name: "Picard",
                    data: { "name": { "first": "Jean", "last": "Picard" } },
                    expected: "WELCOME, JEAN PICARD!"
                },
                {
                    name: "Bond",
                    data: { "name": { "first": "James", "last": "Bond" } },
                    expected: "WELCOME, JAMES BOND!"
                }
            ],
            hints: [
                "Start with the full name: concat name.first (concat \" \" name.last)",
                "Add the prefix: concat \"Welcome, \" (fullname)",
                "Add the suffix: concat (...) \"!\"",
                "Uppercase everything: toUpper (...)"
            ],
            prefill: "{{}}"
        }
    ]
};
