export const chapter2 = {
    id: "chapter-2",
    title: "Chapter 2: String Manipulation",
    description: "Learn to join strings and manipulate text using functions.",
    functions: ["toUpper", "toLower", "length", "concat"],
    steps: [
        // === toUpper Block (S1-5): INTRO → PATTERN → PRACTICE → PRACTICE → VARIABLES ===
        {
            id: "c2-s1",
            type: "challenge",
            title: "Meet Your First Function",
            goal: "Turn hello into HELLO",
            description: "Functions are the **Verbs** of code—magic words that **DO** things to your data.\n\nThere are only 29 of them, and each one does a specific, unique job.\n\n**New Function: `toUpper`** (Arity 1)\n\n`{{ toUpper text }}`\n\nConverts all letters to UPPERCASE. Think of it like the CAPS LOCK key.\n\n**Challenge:**\nThe **literal** text `\"hello\"` is already in the editor. Add `toUpper` before it to transform it.",
            testCases: [
                { name: "Test", data: {}, expected: "HELLO" }
            ],
            hints: ["Add toUpper before \"hello\"", "Type {{ toUpper \"hello\" }}"],
            prefill: "{{ \"hello\" }}"
        },
        {
            id: "c2-s2",
            type: "challenge",
            title: "Prefix Notation",
            goal: "Understand the syntax pattern",
            description: "Notice something interesting about the syntax:\n\n`{{ toUpper \"hello\" }}`\n\nThe **function name** comes **FIRST**, then its input. This is called **Prefix Notation**—the action word leads!\n\nIn everyday English we say \"make 'hello' uppercase\".\nIn formulas we write `toUpper \"hello\"`—**action first!**\n\nThis pattern applies to ALL 29 functions. The verb always comes before the noun.\n\n**Challenge:**\nThe code shows `toLower` instead—another function that makes text lowercase. Observe the same pattern: function first, then input.",
            testCases: [
                { name: "Test", data: {}, expected: "hello" }
            ],
            hints: ["Just observe the pattern: function name comes first!"],
            prefill: "{{ toLower \"HELLO\" }}"
        },
        {
            id: "c2-s3",
            type: "challenge",
            title: "Practice: Change the Input",
            goal: "Change \"hello\" to \"world\"",
            description: "Great! You just saw your first function in action.\n\nThe text inside the quotes is called an **Argument**—it's the input you give to the function.\n\n**Challenge:**\nChange the **literal** text from `\"hello\"` to `\"world\"` to uppercase a different word.",
            testCases: [
                { name: "Test", data: {}, expected: "WORLD" }
            ],
            hints: ["Change the text inside the quotes", "Replace \"hello\" with \"world\""],
            prefill: "{{ toUpper \"hello\" }}"
        },
        {
            id: "c2-s4",
            type: "challenge",
            title: "Practice: Write It Yourself",
            goal: "Uppercase the word \"goodbye\"",
            description: "Now try writing the whole thing from scratch!\n\n**Pattern:** `{{ function argument }}`\n\n**Challenge:**\nWrite a formula using `toUpper` on the **literal** `\"goodbye\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "GOODBYE" }
            ],
            hints: ["Remember: function first, then the text", "Type {{ toUpper \"goodbye\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s5",
            type: "challenge",
            title: "Functions on Variables",
            goal: "Uppercase the department name",
            description: "So far you've used `toUpper` on **literals**—text you typed directly.\n\nNow let's use it on a **variable**—data that changes per person!\n\n**Challenge:**\nWrite a formula to uppercase `staff.department`.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Engineering", data: { "staff": { "department": "engineering" } }, expected: "ENGINEERING" },
                { name: "Sales", data: { "staff": { "department": "sales" } }, expected: "SALES" }
            ],
            hints: ["Instead of \"text\", use the variable staff.department", "Type {{ toUpper staff.department }}"],
            prefill: "{{}}"
        },

        // === toLower Block (S6-8): NEW FUNCTION → PRACTICE → COMPARE ===
        {
            id: "c2-s6",
            type: "challenge",
            title: "The Opposite: toLower",
            goal: "Lowercase the first name",
            description: "Every CAPS LOCK has an opposite.\n\n**New Function: `toLower`** (Arity 1)\n\n`{{ toLower text }}`\n\nConverts all letters to lowercase. The mirror image of `toUpper`.\n\n**Challenge:**\nUse `toLower` on the `name.first` variable.",
            testCases: [
                { name: "JEAN", data: { "name": { "first": "JEAN" } }, expected: "jean" },
                { name: "Mixed", data: { "name": { "first": "JeAn" } }, expected: "jean" }
            ],
            hints: ["Type {{ toLower name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s7",
            type: "challenge",
            title: "Practice: toLower",
            goal: "Lowercase the district username",
            description: "Let's practice with a nested variable.\n\nRemember **dot notation** from Chapter 1? You can chain dots to access deeply nested data.\n\n**Challenge:**\nUse `toLower` on `teacher.credentials.district_username`.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Teacher 1", data: { "teacher": { "credentials": { "district_username": "JSMITH" } } }, expected: "jsmith" },
                { name: "Teacher 2", data: { "teacher": { "credentials": { "district_username": "APatel" } } }, expected: "apatel" }
            ],
            hints: ["Chain the dots: teacher.credentials.district_username", "Type {{ toLower teacher.credentials.district_username }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s8",
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
            id: "c2-s9",
            type: "challenge",
            title: "Counting Characters",
            goal: "Count the letters in \"argument\"",
            description: "Not all functions transform text—some analyze it.\n\n**New Function: `length`** (Arity 1)\n\n`{{ length text }}`\n\nCounts the number of characters in text. Like counting letters on a Scrabble board.\n\n**Challenge:**\nUse `length` to count the letters in `\"argument\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "8" }
            ],
            hints: ["Type {{ length \"argument\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s10",
            type: "challenge",
            title: "Practice: length",
            goal: "Count the characters in the state ID",
            description: "Let's apply `length` to a nested variable.\n\nThe `student.state_id` field contains an ID like `\"NY-2024-00384\"`.\n\n**Challenge:**\nCount the characters in `student.state_id`.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "NY Student", data: { "student": { "state_id": "NY-2024-00384" } }, expected: "13" },
                { name: "CA Student", data: { "student": { "state_id": "CA-991" } }, expected: "6" }
            ],
            hints: ["Use dot notation: student.state_id", "Type {{ length student.state_id }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s11",
            type: "challenge",
            title: "Why Length Matters",
            goal: "Check the length of the district username",
            description: "Real-world use case: Validating input length.\n\nUsernames often have character limits. Getting the length is the first step to validation.\n\n**Challenge:**\nGet the `length` of `student.credentials.district_username`.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Maria", data: { "student": { "credentials": { "district_username": "msantos_2027" } } }, expected: "12" },
                { name: "Jean-Luc", data: { "student": { "credentials": { "district_username": "jpicard_2030" } } }, expected: "12" }
            ],
            hints: ["Chain the dots: student.credentials.district_username", "Type {{ length student.credentials.district_username }}"],
            prefill: "{{}}"
        },

        // === concat Block (S11-15): NEW TOOL → 4 progressive practices ===
        {
            id: "c2-s12",
            type: "challenge",
            title: "Joining Text",
            goal: "Join \"Super\" and \"Man\"",
            description: "Some functions need more than one argument.\n\n**New Function: `concat`** (Arity 2)\n\n`{{ concat text1 text2 }}`\n\nShort for \"concatenate\"—it glues two pieces of text together. Like taping two pieces of paper end-to-end.\n\n**Challenge:**\nUse `concat` to join `\"Super\"` and `\"Man\"`.",
            testCases: [
                { name: "Test", data: {}, expected: "SuperMan" }
            ],
            hints: ["Type {{ concat \"Super\" \"Man\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s13",
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
            id: "c2-s14",
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
            id: "c2-s15",
            type: "challenge",
            title: "Mixed Arguments",
            goal: "Add a title before the last name",
            description: "You can mix **Strings** and **Variables**.\n\n**Challenge:**\nJoin the text `\"Agent \"` (notice the space!) with the `name.last` variable.",
            testCases: [
                { name: "Bond", data: { "name": { "last": "Bond" } }, expected: "Agent Bond" }
            ],
            hints: ["Type {{ concat \"Agent \" name.last }}"],
            prefill: "{{}}"
        },
        // === Nesting Block (S16-19): CONCEPT → PRACTICE → FULL NAME → OUTER ===
        {
            id: "c2-s16",
            type: "challenge",
            title: "Functions Inside Functions",
            goal: "Make the name UPPERCASE",
            description: "Functions can be used inside other functions. This is called **Nesting**.\n\nThe code below outputs `\"Hello, Jean\"`. But we want `\"Hello, JEAN\"`!\n\n**Challenge:**\nReplace `name.first` with `toUpper name.first` to uppercase just the name.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Hello, JEAN" }
            ],
            hints: ["Replace name.first with toUpper name.first", "{{ concat \"Hello, \" toUpper name.first }}"],
            prefill: "{{ concat \"Hello, \" name.first }}"
        },
        {
            id: "c2-s17",
            type: "challenge",
            title: "Practice: Nesting",
            goal: "Shout the last name in a greeting",
            description: "Same pattern, different data.\n\nThis time, uppercase the **last name** instead.\n\n**Challenge:**\nUse `concat` to join `\"Hello, \"` with `toUpper name.last`.\n\nExpected output: `\"Hello, PICARD\"`",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Hello, PICARD" },
                { name: "Beverly", data: { "name": { "first": "Beverly", "last": "Crusher" } }, expected: "Hello, CRUSHER" }
            ],
            hints: ["Same pattern as before, just use name.last", "{{ concat \"Hello, \" toUpper name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s18",
            type: "challenge",
            title: "Full Name",
            goal: "Output First + Space + Last",
            description: "Now let's nest `concat` inside another `concat`.\n\n**The Goal:** Join `name.first` and `name.last` with a **space** in the middle.\n\nThink of it as: `First + (Space + Last)`\n\n**Challenge:**\nCreate the output `\"Jean Picard\"`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Jean Picard" },
                { name: "Beverly", data: { "name": { "first": "Beverly", "last": "Crusher" } }, expected: "Beverly Crusher" }
            ],
            hints: [
                "First: concat \" \" name.last → \" Picard\"",
                "Then: concat name.first [that result] → \"Jean Picard\"",
                "{{ concat name.first concat \" \" name.last }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c2-s19",
            type: "challenge",
            title: "Outer Nesting",
            goal: "Shout the whole greeting",
            description: "You can also transform the **result** of a function.\n\nThis time, build the greeting first, THEN uppercase **everything**.\n\n**Challenge:**\n1. Use `concat` to join `\"Hello \"` and `name.first`.\n2. Wrap the WHOLE thing in `toUpper`.\n\nExpected output: `\"HELLO JEAN\"`",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "HELLO JEAN" },
                { name: "Beverly", data: { "name": { "first": "Beverly", "last": "Crusher" } }, expected: "HELLO BEVERLY" }
            ],
            hints: ["Build the greeting first, then uppercase it", "{{ toUpper concat \"Hello \" name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c2-s20",
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
                "Start with the full name: concat name.first concat \" \" name.last",
                "Add the text before: concat \"Welcome, \" [fullname]",
                "Add the exclamation after: concat [result] \"!\"",
                "Uppercase everything: toUpper [entire formula]"
            ],
            prefill: "{{}}"
        }
    ]
};
