export const CURRICULUM = [
    {
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
                title: "What is a String?",
                goal: "Output the word Hello",
                description: "A **String** is just text. In IDM, strings are wrapped in **double quotes** inside your formula.\n\nExample: `\"Hello World\"`",
                testCases: [{ name: "Test", data: {}, expected: "Hello" }],
                hints: ["Type {{ \"Hello\" }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s3",
                type: "challenge",
                title: "What is a Number?",
                goal: "Output the number 2025",
                description: "A **Number** is just digits. Numbers don't need quotes.\n\nWait... in IDM, numbers are actually treated as text too. So `2025` works the same as `\"2025\"`.",
                testCases: [{ name: "Test", data: {}, expected: "2025" }],
                hints: ["Type {{ 2025 }} or {{ \"2025\" }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s4",
                type: "challenge",
                title: "What is JSON?",
                goal: "Look at the Reference Data. Type the value of the `color` field.",
                description: "**JSON** is how user data is stored. It uses **single** curly braces `{ }` to group data.\n\nDon't confuse `{ }` (data) with `{{ }}` (code)!\n\nLook at the data panel on the right.",
                testCases: [{ name: "Test", data: { "color": "blue" }, expected: "blue" }],
                hints: ["The data shows color is 'blue'. Type {{ \"blue\" }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s5",
                type: "challenge",
                title: "Your First Formula",
                goal: "Output \"Hello World\"",
                description: "Combine what you've learned. Write a formula that outputs the string `Hello World`.",
                testCases: [{ name: "Test", data: {}, expected: "Hello World" }],
                hints: ["Type {{ \"Hello World\" }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s6",
                type: "challenge",
                title: "Fix the Syntax!",
                goal: "This formula is WRONG. Fix it!",
                description: "**IDM does NOT use parentheses or commas!**\n\nMost languages write `func(a, b)`. IDM writes `func a b` with **spaces**.\n\nThe formula below is broken. Fix it by removing `(`, `)`, and `,`.",
                testCases: [{ name: "Test", data: {}, expected: "AB" }],
                hints: ["Remove ( ) and the comma.", "Try: {{ concat \"A\" \"B\" }}"],
                prefill: "{{concat(\"A\", \"B\")}}"
            },
            {
                id: "c1-s7",
                type: "challenge",
                title: "Fields",
                goal: "Output the user's ID from the data.",
                description: "Instead of typing a string, you can pull values **from the data**.\n\nJust type the **field name** (no quotes). Look at the Reference Data for `id`.",
                testCases: [{ name: "User A", data: { "id": "999" }, expected: "999" }],
                hints: ["Type {{ id }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s8",
                type: "challenge",
                title: "Objects Are Not Output!",
                goal: "Type `name` and see what happens.",
                description: "Sometimes a field contains a **group** of other fields (an \"object\"), not a simple value.\n\nTry accessing just `name`. You'll get something weird like `{\"first\":...}`. That's the raw object — not what we want!",
                testCases: [{ name: "Inspect", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "{\"first\":\"Jean\",\"last\":\"Picard\"}" }],
                hints: ["Type {{ name }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s9",
                type: "challenge",
                title: "Dot Notation",
                goal: "Get the LAST name from inside the name object.",
                description: "To get a value **inside** an object, use a **dot** `.`\n\n`name.last` means: go into `name`, then get `last`.",
                testCases: [{ name: "Picard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "Picard" }],
                hints: ["Type {{ name.last }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s10",
                type: "challenge",
                title: "Deeper Nesting",
                goal: "Get the graduation year from inside the student object.",
                description: "Data can be nested multiple levels. Use dot notation to walk the path.\n\nCheck the Reference Data!",
                testCases: [{ name: "Student", data: { "student": { "graduation_year": "2030" } }, expected: "2030" }],
                hints: ["Type {{ student.graduation_year }}"],
                prefill: "{{}}"
            },
            {
                id: "c1-s11",
                type: "challenge",
                title: "Final Exam: First Name",
                goal: "Extract the first name.",
                description: "Prove you've mastered the basics. Get the **first name** from the data.",
                testCases: [
                    { name: "Standard User", data: { "name": { "first": "Jean-O'Luc", "last": "Picard" }, "student": { "graduation_year": "2030" }, "id": "12345" }, expected: "Jean-O'Luc" }
                ],
                hints: ["Use dot notation.", "Type {{ name.first }}"],
                prefill: "{{}}"
            }
        ]
    },
    {
        id: "chapter-2",
        title: "Chapter 2: String Manipulation",
        description: "Learn to join strings and manipulate text.",
        steps: [
            {
                id: "c2-s1",
                type: "challenge",
                title: "Final Exam: Full Name",
                goal: "Create a template for first name + last name with a space in between.",
                description: "Use the `concat` function to join the first name, a space, and the last name.",
                testCases: [
                    {
                        name: "Standard User",
                        data: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
                        expected: "Jean-O'Luc Picard"
                    },
                    {
                        name: "Another User",
                        data: { "name": { "first": "Will", "last": "Riker" } },
                        expected: "Will Riker"
                    }
                ],
                hints: [
                    "Use {{concat}} to join strings.",
                    "You can concatenate a string literal like \" \" for the space."
                ]
            }
        ]
    },
    {
        id: "chapter-3",
        title: "Chapter 3: Advanced Strings",
        description: "Substrings and more complex operations.",
        steps: [
            {
                id: "c3-s1",
                type: "challenge",
                title: "Final Exam: ID Generation",
                goal: "Create a template for first initial + last name + graduation year with no spaces.",
                description: "Time for some string manipulation.",
                testCases: [
                    {
                        name: "Standard User",
                        data: { "name": { "first": "Jean-O'Luc", "last": "Picard" }, "student": { "graduation_year": "2030" } },
                        expected: "JPicard2030"
                    }
                ],
                hints: [
                    "Use {{substr}} for the initial.",
                    "Structure: {{substr ...}} {{name.last}} ..."
                ]
            }
        ]
    },
    {
        id: "chapter-4",
        title: "Chapter 4: Cleaning Data",
        description: "Replacing characters and sanitizing inputs.",
        steps: [
            {
                id: "c4-s1",
                type: "challenge",
                title: "Final Exam: Hyphen Replacement",
                goal: "Create a template to replace hyphens with spaces in a first name.",
                description: "Data cleanup challenge.",
                testCases: [
                    {
                        name: "Hyphenated Name",
                        data: { "name": { "first": "Jean-O'Luc" } },
                        expected: "Jean O'Luc"
                    },
                    {
                        name: "No Hyphen",
                        data: { "name": { "first": "William" } },
                        expected: "William"
                    }
                ],
                hints: [
                    "Use the {{replace}} function."
                ]
            }
        ]
    },
    {
        id: "chapter-5",
        title: "Chapter 5: Basic Logic",
        description: "Introduction to conditional logic.",
        steps: [
            {
                id: "c5-s1",
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
                ]
            }
        ]
    },
    {
        id: "chapter-6",
        title: "Chapter 6: Equality Checks",
        description: "Checking if values match exactly.",
        steps: [
            {
                id: "c6-s1",
                type: "challenge",
                title: "Final Exam: Secret ID",
                goal: "Output \"secret\" if id is \"secret-id\", else \"not so secret\".",
                description: "Checking equality.",
                testCases: [
                    {
                        name: "Regular ID",
                        data: { "id": "12345" },
                        expected: "not so secret"
                    },
                    {
                        name: "Secret ID",
                        data: { "id": "secret-id" },
                        expected: "secret"
                    }
                ],
                hints: [
                    "Use {{if equals id ... }}"
                ]
            }
        ]
    },
    {
        id: "chapter-7",
        title: "Chapter 7: Nested Logic",
        description: "Chaining multiple if statements.",
        steps: [
            {
                id: "c7-s1",
                type: "challenge",
                title: "Final Exam: Graduation Status",
                goal: "Output \"New Student\" (2037), \"Former Student\" (2025), or \"Current Student\" (Checked in that order).",
                description: "Nested logic.",
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
                    "Nest your if statements.",
                    "Structure: {{if cond1 val1 if cond2 val2 val3}}"
                ]
            }
        ]
    },
    {
        id: "chapter-8",
        title: "Chapter 8: Data Safety",
        description: "Handling missing or null values.",
        steps: [
            {
                id: "c8-s1",
                type: "challenge",
                title: "Final Exam: Middle Name Handling",
                goal: "Output the middle name if it exists, otherwise nothing.",
                description: "Handling nulls without errors.",
                testCases: [
                    {
                        name: "User with Middle Name",
                        data: { "name": { "middle": "Tiberius" } },
                        expected: "Tiberius"
                    },
                    {
                        name: "User with No Middle Name",
                        data: { "name": { "first": "Jean" } }, // missing middle
                        expected: ""
                    }
                ],
                hints: [
                    "Direct access to a missing field throws an error.",
                    "Use {{ignoreIfNull name.middle}}"
                ]
            }
        ]
    },
    {
        id: "chapter-9",
        title: "Chapter 9: Existence Checks",
        description: "Logic based on whether fields exist.",
        steps: [
            {
                id: "c9-s1",
                type: "challenge",
                title: "Final Exam: Middle Name with Fallback",
                goal: "Output the middle name if it exists, otherwise \"No Middle Name\".",
                description: "Conditional logic based on field existence.",
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
                    "Try using the 'if' and 'ignoreIfNull' functions together",
                    "An empty value is interpreted as false by the 'if' function while a non-empty value is interpreted as true",
                    "{{if <middle name exists> <middle name> <No Middle Name>}}"
                ]
            }
        ]
    },
    {
        id: "chapter-10",
        title: "Chapter 10: Master Challenge",
        description: "Combining everything you've learned.",
        steps: [
            {
                id: "c10-s1",
                type: "challenge",
                title: "Final Exam: Full Name with Optional Middle",
                goal: "Create a template that checks for a middle name. If it exists, include it between first and last names. If not, just First Last.",
                description: "The ultimate challenge! Combine all your skills. Complex concatenation with optional logic.",
                testCases: [
                    {
                        name: "User with Middle Name",
                        data: { "name": { "first": "James", "middle": "Tiberius", "last": "Kirk" } },
                        expected: "James Tiberius Kirk"
                    },
                    {
                        name: "User without Middle Name",
                        data: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
                        expected: "Jean-O'Luc Picard"
                    }
                ],
                hints: [
                    "You need to conditionally add the middle name AND the extra space.",
                    "Try: {{concat name.first concat \" \" ...}}",
                    "Think about how to return an empty string if the middle name is missing."
                ]
            }
        ]
    }
];
