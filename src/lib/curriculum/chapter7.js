export const chapter7 = {
    id: "chapter-7",
    title: "Chapter 7: Text Logic & Validation",
    description: "Search text with contains, match lists with in, and build a password validator.",
    functions: ["contains", "in"],
    steps: [
        // ============================================================
        // SECTION A: Warm-Up (Steps 1-2)
        // ============================================================
        {
            id: "c7-s1",
            type: "challenge",
            title: "Refresher: And + Equals",
            goal: "Quick and review",
            description: "Let's warm up with an `and` check from Chapter 6.\n\n🧰 **Toolbox:** `if`, `and`, `equals`\n\n**Challenge:**\nIf `dept` is `\"Sales\"` **AND** `region` is `\"West\"`, output `\"Priority\"`. Otherwise `\"Standard\"`.",
            testCases: [
                { name: "Sales West", data: { "dept": "Sales", "region": "West" }, expected: "Priority" },
                { name: "Sales East", data: { "dept": "Sales", "region": "East" }, expected: "Standard" },
                { name: "Engineering West", data: { "dept": "Engineering", "region": "West" }, expected: "Standard" }
            ],
            hints: [
                "You need: if and equals ... equals ... output1 output2",
                "{{ if and equals dept \"Sales\" equals region \"West\" \"Priority\" \"Standard\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s2",
            type: "challenge",
            title: "Refresher: Not + Equals",
            goal: "Quick not review",
            description: "One more warm-up with `not` from Chapter 6.\n\n🧰 **Toolbox:** `if`, `not`, `equals`\n\n**Challenge:**\nIf `status` is **NOT** `\"Archived\"`, output `\"Visible\"`. Otherwise `\"Hidden\"`.",
            testCases: [
                { name: "Active", data: { "status": "Active" }, expected: "Visible" },
                { name: "Archived", data: { "status": "Archived" }, expected: "Hidden" },
                { name: "Draft", data: { "status": "Draft" }, expected: "Visible" }
            ],
            hints: [
                "The condition is: not equals status \"Archived\"",
                "{{ if not equals status \"Archived\" \"Visible\" \"Hidden\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION B: Contains (Steps 3-8)
        // ============================================================
        {
            id: "c7-s3",
            type: "challenge",
            title: "Concept: Substring Search",
            goal: "Fix the broken contains formula",
            description: "**New Tool: `contains`** — Arity 2\n\n`{{ contains haystack needle }}`\n\nReturns `true` if the `needle` text is found **INSIDE** the `haystack`.\n\nThink of it as: \"Is **needle** hiding inside **haystack**?\"\n\n🧰 **Toolbox:** `contains` — new!\n\n**Challenge:**\nThe formula below tries to check if the `email` has an `@` symbol — but the arguments are **backwards**. Fix the order!\n\n*The haystack comes first, the needle comes second*",
            testCases: [
                { name: "Valid Email", data: { "email": "a@b.com" }, expected: "true" },
                { name: "Invalid Email", data: { "email": "ab.com" }, expected: "false" }
            ],
            hints: [
                "The haystack — the text to search IN — comes first",
                "The needle — what you're looking for — comes second",
                "{{ contains email \"@\" }}"
            ],
            prefill: "{{ contains \"@\" email }}"
        },
        {
            id: "c7-s4",
            type: "multiple-choice",
            title: "What Does Contains Return?",
            goal: "Understand that contains returns a Boolean",
            description: "`contains` returns a **Boolean** — just like `equals`. It answers the question: \"Is this text hiding inside that text?\"\n\nIt doesn't return the found text — just `true` or `false`.",
            question: "The email is \"tom@company.com\". What does {{ contains email \"@\" }} return?",
            options: ["true", "false", "\"@\"", "\"tom@company.com\""],
            correctAnswer: "true",
            hints: ["contains checks if the needle is inside the haystack", "\"@\" IS inside \"tom@company.com\""]
        },
        {
            id: "c7-s5",
            type: "challenge",
            title: "Contains in If",
            goal: "Wrap contains in if",
            description: "Since `contains` returns a Boolean, we can feed it to `if`!\n\n🧰 **Toolbox:** `if`, `contains`\n\n**Challenge:**\nThe `contains` check is already written. **Wrap it in an `if`** to output `\"Valid\"` when true and `\"Invalid\"` when false.",
            testCases: [
                { name: "Valid", data: { "email": "a@b.com" }, expected: "Valid" },
                { name: "Invalid", data: { "email": "ab.com" }, expected: "Invalid" }
            ],
            hints: [
                "Put `if` at the start, and add the two output strings at the end",
                "{{ if contains email \"@\" \"Valid\" \"Invalid\" }}"
            ],
            prefill: "{{ contains email \"@\" }}"
        },
        {
            id: "c7-s6",
            type: "challenge",
            title: "You Do: Contains in If",
            goal: "Independent contains + if",
            description: "Your turn — from scratch!\n\n🧰 **Toolbox:** `if`, `contains`\n\n**Challenge:**\nIf the `url` contains `\"https\"`, output `\"Secure\"`. Otherwise `\"Not Secure\"`.",
            testCases: [
                { name: "Secure", data: { "url": "https://safe.com" }, expected: "Secure" },
                { name: "Not Secure", data: { "url": "http://old.com" }, expected: "Not Secure" }
            ],
            hints: [
                "The haystack is url, the needle is \"https\"",
                "{{ if contains url \"https\" \"Secure\" \"Not Secure\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s7",
            type: "challenge",
            title: "Contains + Not",
            goal: "Negative text check",
            description: "We can combine `contains` with `not` from Chapter 6!\n\n🧰 **Toolbox:** `if`, `not`, `contains`\n\n**Challenge:**\nIf the `username` does **NOT** contain `\"test\"`, output `\"Real\"`. Otherwise `\"Fake\"`.",
            testCases: [
                { name: "Real", data: { "username": "jdoe" }, expected: "Real" },
                { name: "Fake", data: { "username": "testuser" }, expected: "Fake" }
            ],
            hints: [
                "The condition is: not contains username \"test\"",
                "{{ if not contains username \"test\" \"Real\" \"Fake\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s8",
            type: "challenge",
            title: "Contains + And",
            goal: "Combine two contains checks",
            description: "A valid email must contain **BOTH** `\"@\"` **AND** `\".\"`.\n\n🧰 **Toolbox:** `if`, `and`, `contains`\n\n**Challenge:**\nIf the `email` contains `\"@\"` **AND** contains `\".\"`, output `\"Valid\"`. Otherwise `\"Invalid\"`.",
            testCases: [
                { name: "Full Email", data: { "email": "a@b.com" }, expected: "Valid" },
                { name: "No Dot", data: { "email": "a@b" }, expected: "Invalid" },
                { name: "No At", data: { "email": "ab.com" }, expected: "Invalid" }
            ],
            hints: [
                "You need two contains checks glued together with and",
                "contains email \"@\" and contains email \".\"",
                "{{ if and contains email \"@\" contains email \".\" \"Valid\" \"Invalid\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION C: In (Steps 9-13)
        // ============================================================
        {
            id: "c7-s9",
            type: "challenge",
            title: "Concept: List Membership",
            goal: "Fix the broken formula",
            description: "**New Tool: `in`** — Arity 2\n\n`{{ in value list }}`\n\nThe `list` is a **space-separated** string of options. Returns `true` if the value **exactly matches** one of the items.\n\n**Example:** `{{ in \"apple\" \"apple banana cherry\" }}` → `true`\n\n🧰 **Toolbox:** `in` — new!\n\n**Challenge:**\nThe formula below tries to check if `color` is red, blue, or green — but someone used `contains` instead of `in`. **Fix it!**\n\n*Think: do we want to search INSIDE text, or match against a LIST?*",
            testCases: [
                { name: "Red", data: { "color": "red" }, expected: "true" },
                { name: "Blue", data: { "color": "blue" }, expected: "true" },
                { name: "Yellow", data: { "color": "yellow" }, expected: "false" }
            ],
            hints: [
                "We want to match against a list, not search inside text",
                "Replace `contains` with `in`",
                "{{ in color \"red blue green\" }}"
            ],
            prefill: "{{ contains color \"red blue green\" }}"
        },
        {
            id: "c7-s10",
            type: "multiple-choice",
            title: "Contains vs In",
            goal: "Understand the critical difference",
            description: "This is why `contains` and `in` are **different tools**!\n\n• `contains` finds text **INSIDE** other text — so \"red\" is inside \"reddish\"\n• `in` checks for an **EXACT match** against a list\n\nUse `in` when you want exact matches. Use `contains` when you're searching inside text.",
            question: "color is \"reddish\". What does {{ contains color \"red\" }} return? Think carefully!",
            options: ["true — \"red\" is inside \"reddish\"", "false — \"reddish\" is not \"red\""],
            correctAnswer: "true — \"red\" is inside \"reddish\"",
            hints: ["contains searches for a substring INSIDE text", "Is the text \"red\" hiding inside the text \"reddish\"?"]
        },
        {
            id: "c7-s11",
            type: "challenge",
            title: "In with If",
            goal: "Use in inside if",
            description: "Let's put `in` to work inside an `if`.\n\n🧰 **Toolbox:** `if`, `in`\n\n**Challenge:**\nWe've started the formula. Complete it by adding the list of High School grades and the two outputs.\n\nIf `student.grade` is in `\"09 10 11 12\"`, output `\"High School\"`. Otherwise `\"Other\"`.",
            testCases: [
                { name: "Freshman", data: { "student": { "grade": "09" } }, expected: "High School" },
                { name: "Senior", data: { "student": { "grade": "12" } }, expected: "High School" },
                { name: "Middle School", data: { "student": { "grade": "07" } }, expected: "Other" }
            ],
            hints: [
                "Add the list string and two output values",
                "\"09 10 11 12\" \"High School\" \"Other\"",
                "{{ if in student.grade \"09 10 11 12\" \"High School\" \"Other\" }}"
            ],
            prefill: "{{ if in student.grade }}"
        },
        {
            id: "c7-s12",
            type: "challenge",
            title: "You Do: In with If",
            goal: "Independent in + if",
            description: "Your turn — from scratch!\n\n🧰 **Toolbox:** `if`, `in`\n\n**Challenge:**\nIf the `day` is a weekend day `\"Saturday Sunday\"`, output `\"Weekend\"`. Otherwise `\"Weekday\"`.",
            testCases: [
                { name: "Saturday", data: { "day": "Saturday" }, expected: "Weekend" },
                { name: "Monday", data: { "day": "Monday" }, expected: "Weekday" },
                { name: "Sunday", data: { "day": "Sunday" }, expected: "Weekend" }
            ],
            hints: [
                "The list is \"Saturday Sunday\"",
                "{{ if in day \"Saturday Sunday\" \"Weekend\" \"Weekday\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s13",
            type: "challenge",
            title: "In + Not",
            goal: "Combine in with not",
            description: "We can combine `in` with `not` to exclude a group!\n\n🧰 **Toolbox:** `if`, `not`, `in`\n\n**Challenge:**\nIf the `status` is **NOT** in `\"Banned Suspended\"`, output `\"Active\"`. Otherwise `\"Restricted\"`.",
            testCases: [
                { name: "OK", data: { "status": "OK" }, expected: "Active" },
                { name: "Banned", data: { "status": "Banned" }, expected: "Restricted" },
                { name: "Suspended", data: { "status": "Suspended" }, expected: "Restricted" }
            ],
            hints: [
                "The condition is: not in status \"Banned Suspended\"",
                "{{ if not in status \"Banned Suspended\" \"Active\" \"Restricted\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION D: Range Checks (Steps 14-15)
        // ============================================================
        {
            id: "c7-s14",
            type: "challenge",
            title: "Is It in Range?",
            goal: "Range check with and + numeric comparisons",
            description: "Let's combine `and` with numeric comparisons from Chapter 5.\n\n🧰 **Toolbox:** `and`, `geq`, `less`\n\nRemember from Chapter 5:\n• `geq score 50` → true if score is **50 or higher** — greater or equal\n• `less score 100` → true if score is **below 100**\n\n**Challenge:**\nWe've started the first check. Add the second check to complete the range.\n\nReturn `true` if `score` is **at least 50 AND less than 100**.",
            testCases: [
                { name: "Low Edge", data: { "score": 50 }, expected: "true" },
                { name: "Middle", data: { "score": 75 }, expected: "true" },
                { name: "Too Low", data: { "score": 49 }, expected: "false" },
                { name: "Too High", data: { "score": 100 }, expected: "false" }
            ],
            hints: [
                "Add the upper bound check: less score 100",
                "{{ and geq score 50 less score 100 }}"
            ],
            prefill: "{{ and geq score 50 }}"
        },
        {
            id: "c7-s15",
            type: "challenge",
            title: "Range Gate",
            goal: "Range check inside if",
            description: "Now wrap a range check in `if` for output.\n\n🧰 **Toolbox:** `if`, `and`, `geq`, `less`\n\n**Challenge:**\nIf `temperature` is **at least 60 AND less than 80**, output `\"Comfortable\"`. Otherwise `\"Extreme\"`.",
            testCases: [
                { name: "Just Right", data: { "temperature": 70 }, expected: "Comfortable" },
                { name: "Too Cold", data: { "temperature": 59 }, expected: "Extreme" },
                { name: "Too Hot", data: { "temperature": 80 }, expected: "Extreme" }
            ],
            hints: [
                "The condition is: and geq temperature 60 less temperature 80",
                "{{ if and geq temperature 60 less temperature 80 \"Comfortable\" \"Extreme\" }}"
            ],
            prefill: "{{}}"
        },

        // ============================================================
        // SECTION E: Password Validator Capstone (Steps 16-19)
        // ============================================================
        {
            id: "c7-s16",
            type: "challenge",
            title: "Build Part 1: Length + Hash",
            goal: "And with greater + contains",
            description: "Let's build a **Password Validator** step by step!\n\n🧰 **Toolbox:** `and`, `greater`, `length`, `contains`\n\nRemember from Chapter 5:\n• `length pass` → returns the number of characters\n• `greater X 8` → true if X is bigger than 8\n\n**Challenge:**\nWe've started with the length check. **Add a `contains` check** for the `\"#\"` symbol.\n\nCheck if `pass` is longer than 8 characters **AND** contains `\"#\"`.",
            testCases: [
                { name: "Valid", data: { "pass": "secure#1234" }, expected: "true" },
                { name: "Too Short", data: { "pass": "short#" }, expected: "false" },
                { name: "No Hash", data: { "pass": "longpassword" }, expected: "false" }
            ],
            hints: [
                "Add: contains pass \"#\"",
                "{{ and greater length pass 8 contains pass \"#\" }}"
            ],
            prefill: "{{ and greater length pass 8 }}"
        },
        {
            id: "c7-s17",
            type: "challenge",
            title: "Build Part 2: The Forbidden Word",
            goal: "Not + contains check",
            description: "Second check: the password must **NOT** contain the word `\"password\"`.\n\n🧰 **Toolbox:** `not`, `contains`\n\n**Challenge:**\nBuild this check from scratch.",
            testCases: [
                { name: "Secure", data: { "pass": "mysecret" }, expected: "true" },
                { name: "Forbidden", data: { "pass": "mypassword123" }, expected: "false" }
            ],
            hints: [
                "Check if pass contains \"password\", then negate it",
                "{{ not contains pass \"password\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c7-s18",
            type: "challenge",
            title: "Combine: The Triple And",
            goal: "Chain Part 1 and Part 2",
            description: "Now combine your two checks into one.\n\nThe **Triple And** structure: `{{ and PART_1 PART_2 }}`\n\nWhen Part 1 is already an `and`, this becomes: `{{ and and ... ... PART_2 }}`\n\n🧰 **Toolbox:** `and`, `greater`, `length`, `contains`, `not`\n\n**Challenge:**\nWe've pasted Part 1 for you. **Add Part 2** — your forbidden word check — at the end.",
            testCases: [
                { name: "Perfect", data: { "pass": "secure#123456" }, expected: "true" },
                { name: "Failed Part 1", data: { "pass": "short#" }, expected: "false" },
                { name: "Failed Part 2", data: { "pass": "mypassword#123" }, expected: "false" }
            ],
            hints: [
                "Add your Part 2 after the existing formula",
                "not contains pass \"password\"",
                "{{ and and greater length pass 8 contains pass \"#\" not contains pass \"password\" }}"
            ],
            prefill: "{{ and and greater length pass 8 contains pass \"#\" }}"
        },
        {
            id: "c7-s19",
            type: "challenge",
            title: "Final Exam: Password Validator",
            goal: "Wrap in if for final output",
            description: "You built the engine. Now give it a voice!\n\n🧰 **Toolbox:** `if`, `and`, `greater`, `length`, `contains`, `not`\n\n**Challenge:**\nOutput `\"Strong\"` if the password passes **ALL** checks. Otherwise `\"Weak\"`.\n\nWrap your logic from the last step in an `if`.\n\n**Tip: Reuse what you just built!**",
            testCases: [
                { name: "Strong", data: { "pass": "secure#12345" }, expected: "Strong" },
                { name: "No Hash", data: { "pass": "secure123456" }, expected: "Weak" },
                { name: "Short", data: { "pass": "#short" }, expected: "Weak" },
                { name: "Forbidden Word", data: { "pass": "mypassword#123" }, expected: "Weak" }
            ],
            hints: [
                "Start with if, paste your logic, add the two outputs",
                "{{ if and and greater length pass 8 contains pass \"#\" not contains pass \"password\" \"Strong\" \"Weak\" }}"
            ],
            prefill: "{{}}"
        }
    ]
};
