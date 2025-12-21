export const TEXT_EXTRACTION_OPS = [
    {
        name: "textBefore",
        syntax: '{{textBefore arg1 arg2}}',
        arity: 2,
        desc: "Extracts all text that appears before a specific character or substring.",
        examples: [
            {
                level: "Basic",
                code: '{{textBefore student.email "@"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.email", meaning: "The text to search (variable or string)" },
                    { arg: "Arg 2", value: '"@"', meaning: "The character/substring to find" }
                ],
                humanEnglish: "Look at the student's email, find the @ symbol, and give me everything BEFORE it.",
                result: '"jdoe@school.edu" → "jdoe"'
            },
            {
                level: "Intermediate",
                code: '{{textBefore student.name ", "}}',
                result: '"Doe, John" → "Doe"',
                translation: "Extract the last name from a 'Last, First' format."
            },
            {
                level: "Advanced",
                code: '{{toLower textBefore student.email "@"}}',
                result: '"JDoe@School.edu" → "jdoe"',
                translation: "Extract username AND convert to lowercase in one formula."
            }
        ]
    },
    {
        name: "textAfter",
        syntax: '{{textAfter arg1 arg2}}',
        arity: 2,
        desc: "Extracts all text that appears after a specific character or substring.",
        examples: [
            {
                level: "Basic",
                code: '{{textAfter student.email "@"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.email", meaning: "The text to search (variable or string)" },
                    { arg: "Arg 2", value: '"@"', meaning: "The character/substring to find" }
                ],
                humanEnglish: "Look at the student's email, find the @ symbol, and give me everything AFTER it.",
                result: '"jdoe@school.edu" → "school.edu"'
            },
            {
                level: "Intermediate",
                code: '{{textAfter student.name ", "}}',
                result: '"Doe, John" → "John"',
                translation: "Extract the first name from a 'Last, First' format."
            },
            {
                level: "Advanced",
                code: '{{if contains student.phone "-" textAfter student.phone "-" student.phone}}',
                result: '"555-1234" → "1234" OR "5551234" → "5551234"',
                translation: "Get digits after dash, or return full number if no dash exists."
            }
        ]
    },
    {
        name: "textAfterLast",
        syntax: '{{textAfterLast arg1 arg2}}',
        arity: 2,
        desc: "Extracts text after the LAST occurrence of a character (useful when multiple matches exist).",
        examples: [
            {
                level: "Basic",
                code: '{{textAfterLast student.email "."}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.email", meaning: "The text to search (variable or string)" },
                    { arg: "Arg 2", value: '"."', meaning: "The character/substring to find (last one)" }
                ],
                humanEnglish: "Look at the student's email, find the LAST period, and give me everything after it.",
                result: '"jdoe@school.edu" → "edu"'
            },
            {
                level: "Intermediate",
                code: '{{textAfterLast file.path "/"}}',
                result: '"/documents/reports/final.pdf" → "final.pdf"',
                translation: "Extract just the filename from a full file path."
            },
            {
                level: "Advanced",
                code: '{{textBefore textAfterLast student.email "@" "."}}',
                result: '"jdoe@mail.school.edu" → "school"',
                translation: "Extract the organization name from a complex email domain."
            }
        ]
    }
];
