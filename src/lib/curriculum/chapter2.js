export const chapter2 = {
    id: "chapter-2",
    title: "Chapter 2: String Manipulation",
    description: "Learn to join strings and manipulate text using functions.",
    steps: [
        {
            id: "c2-s1",
            type: "challenge",
            title: "Function Basics",
            goal: "Uppercase the word \"hello\"",
            description: "Functions are the **Verbs** of code.\n\nThere are only about 30 of them, and each one does a specific, unique job.\n\nThey are magic words that **DO** things to your data.\n\n`{{ verb data }}`\n\nUse the `toUpper` function (verb) to turn the text \"hello\" (data) into \"HELLO\".",
            testCases: [
                { name: "Test", data: {}, expected: "HELLO" }
            ],
            hints: [
                "Type {{ toUpper \"hello\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s2",
            type: "challenge",
            title: "What is an Argument?",
            goal: "Count the number of letters in the word \"argument\"",
            description: "The input you give to the magic word (Function) is called an **Argument**.\n\n**Why \"Argument\"?**\nIt comes from mathematics (and Latin \"arguere\" - to make clear). It's the \"evidence\" or \"input\" you give the function so it can do its job.\n\n`{{ len \"text\" }}`\n\nWithout an argument, the function has nothing to work on!\n\n**Challenge:**\nThe `len` function (length) takes one Argument. Use it to count the letters.",
            testCases: [
                { name: "Test", data: {}, expected: "8" }
            ],
            hints: [
                "Type {{ len \"argument\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s3",
            type: "challenge",
            title: "Variables as Arguments",
            goal: "Lowercase the first name",
            description: "Arguments don't have to be just strings (like `\"hello\"`). They can also be **Variables** (Fields).\n\nThe `toLower` function takes **1 Argument**.\n\n`{{ toLower text }}`\n\n(Tip: All available functions and their argument counts are listed in the **Documentation** tab).\n\nVariables are just placeholders for data that changes.\n\nUse the `toLower` function on the `name.first` variable.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "jean" }
            ],
            hints: [
                "Type {{ toLower name.first }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s4",
            type: "challenge",
            title: "Multiple Arguments",
            goal: "Join \"Super\" and \"Man\"",
            description: "Some functions need more than one argument.\n\nThe `concat` (concatenate) function joins two things together.\n\n`{{ concat arg1 arg2 }}`",
            testCases: [
                { name: "Test", data: {}, expected: "SuperMan" }
            ],
            hints: [
                "Type {{ concat \"Super\" \"Man\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s5",
            type: "challenge",
            title: "Variable Concatenation",
            goal: "Join first and last name directly",
            description: "You can join two variables together.\n\nCreate a format like `FirstLast` (e.g., \"JeanPicard\").",
            testCases: [
                { name: "Picard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "JeanPicard" }
            ],
            hints: [
                "Type {{ concat name.first name.last }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s6",
            type: "challenge",
            title: "Mixed Arguments",
            goal: "Add a prefix to the last name",
            description: "You can mix **Strings** and **Variables**.\n\nJoin the text `\"Agent \"` (notice the space!) with the `name.last` variable.\n\n**Why the space?**\nComputers don't know English grammar. If you want a space between words, you must verify explicitly include it inside the string.",
            testCases: [
                { name: "Bond", data: { "name": { "last": "Bond" } }, expected: "Agent Bond" }
            ],
            hints: [
                "Type {{ concat \"Agent \" name.last }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s7",
            type: "challenge",
            title: "The \"Space\" Problem",
            goal: "Create the second half of a full name",
            description: "We are building up to a full name: `First` + ` Last`.\n\nLet's build the second part first.\n\nConcatenate a **space** `\" \"` with the `name.last`.",
            testCases: [
                { name: "Picard", data: { "name": { "last": "Picard" } }, expected: " Picard" }
            ],
            hints: [
                "Type {{ concat \" \" name.last }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s8",
            type: "challenge",
            title: "Inner Nesting",
            goal: "Shout a greeting to Jean",
            description: "Functions can be used inside other functions. This is called **Nesting**.\n\nThink of it in steps:\n1. The inner function runs first: `toUpper` turns `name.first` into \"JEAN\".\n2. The outer function runs next: `concat` joins \"HELLO \" with that result.\n\nSo `{{ concat \"HELLO \" toUpper name.first }}` works just like `{{ concat \"HELLO \" \"JEAN\" }}`!",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "HELLO JEAN" }
            ],
            hints: [
                "Type {{ concat \"HELLO \" toUpper name.first }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s9",
            type: "challenge",
            title: "Outer Nesting",
            goal: "Shout the whole greeting",
            description: "You can also transform the **result** of a function.\n\nUse `concat` to join `\"Hello \"` and `name.first`...\n\n...then wrap the WHOLE thing in `toUpper`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "HELLO JEAN" }
            ],
            hints: [
                "Type {{ toUpper concat \"Hello \" name.first }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s10",
            type: "challenge",
            title: "Final Exam: Full Name",
            goal: "Output the full name (First + Space + Last)",
            description: "Combine everything you've learned to build a Full Name.\n\n**The Goal:** Join the `name.first` and `name.last` fields with a **space** in the middle.",
            testCases: [
                {
                    name: "Standard User",
                    data: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
                    expected: "Jean-O'Luc Picard"
                }
            ],
            hints: [
                "PRO TIP: You will need to use `concat` inside another `concat` (Nesting).",
                "Think of it as: First + (Space + Last)",
                "{{ concat name.first concat \" \" name.last }}"
            ],
            prefill: "{{}}"
        }
    ]
};
