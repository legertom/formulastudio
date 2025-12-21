export const chapter1 = {
    id: "chapter-1",
    title: "Chapter 1: The Foundation",
    description: "Master the basics: the wrapper, strings, data access.",
    steps: [
        {
            id: "c1-s1",
            type: "challenge",
            title: "The Formula Wrapper",
            goal: "Type two opening braces {{ and two closing braces }}",
            description: "Every IDM formula is wrapped in **double curly braces**.\n\nThis tells the system: \"Hey, this is code!\"\n\nType an empty wrapper to get started.",
            testCases: [{ name: "Test", data: {}, expected: "" }],
            hints: ["Type {{ }}"],
            prefill: ""
        },
        {
            id: "c1-s2",
            type: "challenge",
            title: "Fix the Syntax!",
            goal: "This formula is WRONG. Fix it!",
            description: "**IDM does NOT use parentheses or commas!**\n\nMost languages write `func(a, b)`. IDM writes `func a b` with **spaces**.\n\nThe formula below is broken. Fix it by removing `(`, `)`, and `,`.",
            testCases: [{ name: "Test", data: {}, expected: "AB" }],
            hints: ["Remove ( ) and the comma.", "Try: {{ concat \"A\" \"B\" }}"],
            prefill: "{{concat(\"A\", \"B\")}}"
        },
        {
            id: "c1-s3",
            type: "challenge",
            title: "What is a String?",
            goal: "Output the word Hello",
            description: "A **String** is just text. In IDM, strings are wrapped in **double quotes** inside your formula.\n\nExample: `\"Hello World\"`",
            testCases: [{ name: "Test", data: {}, expected: "Hello" }],
            hints: ["Type {{ \"Hello\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s4",
            type: "challenge",
            title: "What is a Number?",
            goal: "Output the number 2025",
            description: "A **Number** is just digits. Numbers don't need quotes.\n\nWait... in IDM, numbers are actually treated as text too. So `2025` works the same as `\"2025\"`.",
            testCases: [{ name: "Test", data: {}, expected: "2025" }],
            hints: ["Type {{ 2025 }} or {{ \"2025\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s5",
            type: "challenge",
            title: "What is an Object?",
            goal: "Output the text { id: 123 } as a string",
            description: "You've learned about **Strings** and **Numbers**.\n\n**Objects** organize them into groups using **Key-Value Pairs**:\n`Label : Data`\n\nThey use **single curly braces** `{ }` to wrap the group.\n\n**WARNING: Don't confuse your braces!**\n* `{ ... }` = Data (Object)\n* `{{ ... }}` = Code (Formula)\n* Only **Code** braces trigger the formula engine.\n\n**Challenge:**\nOutput a fake object `{ id: 123 }` (Label `id`, Data `123`) as a text string.",
            testCases: [{ name: "Test", data: {}, matchRegex: "^\\{\\s*id:\\s*123\\s*\\}$", expected: "{ id: 123 }" }],
            hints: ["Type {{ \"{ id: 123 }\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s6",
            type: "challenge",
            title: "What is JSON?",
            goal: "Find the value for \"color\" and output it as a string",
            description: "This specific format is called **JSON** (**J**ava**S**cript **O**bject **N**otation).\n\nIt organizes data into **Key-Value Pairs**:\n*   **Key**: The label (e.g., `\"color\"`)\n*   **Value**: The data (e.g., `\"blue\"`)\n\n**NOTE: Strict Syntax**\nNotice how JSON uses **double quotes** `\" \"` around everything—both the Keys AND the text Values.\n\nThis is exactly how **Clever** sends data to applications.\n\n**Challenge:**\nLook at the Reference Data below. Find the **Value** for the `color` Key, and output it as a string.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Test", data: { "color": "blue" }, expected: "blue" }],
            hints: ["The value is \"blue\".", "Type {{ \"blue\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s7",
            type: "challenge",
            title: "From Keys to Fields",
            goal: "Output the value of the `color` field",
            description: "You just saw how **JSON** uses **Keys** (like `\"color\"`) to label data.\n\nIn Formula Studio, we call these **Fields**!\n\nTo use a field, we just wrap the Key name in our double curly braces `{{ }}`.\n\n**Crucial Change:** We **drop the quotes** when using them as fields.\n\n*   JSON Key: `\"color\"`\n*   Formula Field: `{{ color }}`\n\n**Challenge:**\nUse the `color` field to get its value.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Test", data: { "color": "blue" }, expected: "blue" }],
            hints: ["Type {{ color }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s8",
            type: "challenge",
            title: "Fields",
            goal: "Output the user's ID from the data.",
            description: "Instead of typing a string, you can pull values **from the data**.\n\nJust type the **field name** (no quotes). Look at the Reference Data panel below for `id`.",
            referenceDataPlacement: "top",
            testCases: [{ name: "User A", data: { "id": "999" }, expected: "999" }],
            hints: ["Type {{ id }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s9",
            type: "challenge",
            title: "The Object Error",
            goal: "Cause the [object Object] error",
            description: "Sometimes you might try to output a **Group** (Object) instead of a single **Value** (String).\n\nWhen you do this, the system gets confused and yells: `[object Object]`.\n\nThis means: **\"You gave me the whole box, but I can only print text!\"**\n\n**Challenge:**\nType `{{ name }}` to trigger this error. (Yes, we want you to break it!)",
            referenceDataPlacement: "top",
            testCases: [{ name: "Inspect", data: { "name": { "first": "Jean", "last": "Picard" } }, matchRegex: "\\[object Object\\]", expected: "[object Object]" }],
            hints: ["Type {{ name }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s10",
            type: "challenge",
            title: "Dot Notation",
            goal: "Get the LAST name from inside the name object.",
            description: "To get a value **inside** an object, use a **dot** `.`\n\n`name.last` means: go into `name`, then get `last`.\n\nUse the Reference Data panel below to confirm the structure.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Picard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Picard" }],
            hints: ["Type {{ name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s11",
            type: "challenge",
            title: "Deeper Nesting",
            goal: "Get the District Name",
            description: "Data can be nested multiple levels deep!\n\nUse dot notation to walk the path step-by-step: `level1.level2.level3`.\n\n**Challenge:**\nCheck the Reference Data below. Drill down into the `school` object to find the district **name**.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "school": { "district": { "name": "Happy Valley" } } }, expected: "Happy Valley" }],
            hints: ["Type {{ school.district.name }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s12",
            type: "challenge",
            title: "Final Exam: First Name",
            goal: "Extract the first name.",
            description: "Prove you've mastered the basics. Get the **first name** from the data.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Standard User", data: { "name": { "first": "Jean-O'Luc", "last": "Picard" }, "student": { "graduation_year": "2030" }, "id": "12345" }, expected: "Jean-O'Luc" }
            ],
            hints: ["Use dot notation.", "Type {{ name.first }}"],
            prefill: "{{}}"
        }
    ]
};
