export const TEXT_TRANSFORM_OPS = [
    {
        name: "toLower",
        syntax: "{{toLower arg1}}",
        arity: 1,
        desc: "Converts all letters in a text value to lowercase.",
        examples: [
            {
                level: "Basic",
                code: "{{toLower name.first}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "The text to convert (variable or string)" }
                ],
                humanEnglish: "Take the student's first name and make all the letters lowercase.",
                result: '"JOHN" → "john"'
            },
            {
                level: "Intermediate",
                code: '{{toLower concat name.first "." name.last}}',
                result: '"John.Doe" → "john.doe"',
                translation: "Combine first and last name with a period, then lowercase the entire result."
            },
            {
                level: "Advanced",
                code: '{{concat toLower substr name.first 0 1 toLower name.last}}',
                result: '"John" + "Doe" → "jdoe"',
                translation: "Take first initial + last name, both lowercased, to create a username."
            }
        ]
    },
    {
        name: "toUpper",
        syntax: "{{toUpper arg1}}",
        arity: 1,
        desc: "Converts all letters in a text value to uppercase.",
        examples: [
            {
                level: "Basic",
                code: "{{toUpper name.last}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "name.last", meaning: "The text to convert (variable or string)" }
                ],
                humanEnglish: "Take the student's last name and make all the letters UPPERCASE.",
                result: '"doe" → "DOE"'
            },
            {
                level: "Intermediate",
                code: "{{toUpper substr name.last 0 1}}",
                result: '"doe" → "D"',
                translation: "Get the first letter of the last name and uppercase it (for initials)."
            },
            {
                level: "Advanced",
                code: '{{concat toUpper substr name.first 0 1 ". " toUpper substr name.last 0 1 "."}}',
                result: '"john doe" → "J. D."',
                translation: "Create formatted initials like 'J. D.' from first and last name."
            }
        ]
    },
    {
        name: "substr",
        fullName: "substring",
        syntax: "{{substr arg1 arg2 arg3}}",
        arity: 3,
        desc: "Short for 'substring'. Extracts a portion of text starting at a position for a specified length.",
        args: [
            { name: "arg1", desc: "The source string to extract from" },
            { name: "arg2", desc: "The starting position (0-indexed)" },
            { name: "arg3", desc: "The number of characters to extract" }
        ],
        note: {
            title: "How Position Counting Works",
            content: "Positions start at 0, not 1. Think of it as 'characters from the left edge'.",
            diagram: [
                { char: "J", pos: 0 },
                { char: "O", pos: 1 },
                { char: "H", pos: 2 },
                { char: "N", pos: 3 }
            ],
            example: "substr \"JOHN\" 0 2 → \"JO\" (start at 0, take 2 chars)"
        },
        examples: [
            {
                level: "Basic",
                code: "{{substr student.sis_id 0 3}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "student.sis_id", meaning: "The text to extract from (variable or string)" },
                    { arg: "Arg 2", value: "0", meaning: "Starting position (0 = first character)" },
                    { arg: "Arg 3", value: "3", meaning: "Number of characters to extract" }
                ],
                humanEnglish: "Look at the SIS ID, start at the beginning (position 0), and grab the first 3 characters.",
                result: '"123456" → "123"'
            },
            {
                level: "Intermediate",
                code: "{{substr name.first 0 1}}",
                result: '"Jonathan" → "J"',
                translation: "Extract just the first letter of the first name (for initials)."
            },
            {
                level: "Advanced",
                code: '{{concat toLower substr name.first 0 1 toLower name.last "@school.edu"}}',
                result: '"John Doe" → "jdoe@school.edu"',
                translation: "Build an email: first initial + last name + domain, all lowercase."
            }
        ]
    },
    {
        name: "alphanumeric",
        syntax: "{{alphanumeric arg1}}",
        arity: 1,
        desc: "Removes all special characters, keeping only letters (A-Z, a-z) and numbers (0-9).",
        args: [
            { name: "arg1", desc: "The text to clean (variable or string)" }
        ],
        examples: [
            {
                level: "Basic",
                code: "{{alphanumeric name.last}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "name.last", meaning: "The text to clean (variable or string)" }
                ],
                humanEnglish: "Take the last name and remove any apostrophes, hyphens, or special characters.",
                result: '"O\'Connor" → "OConnor"'
            },
            {
                level: "Intermediate",
                code: "{{alphanumeric name.first}}",
                result: '"Mary-Jane" → "MaryJane"',
                translation: "Remove hyphens from hyphenated first names."
            },
            {
                level: "Advanced",
                code: "{{toLower alphanumeric concat name.first name.last}}",
                result: '"Mary-Jane O\'Connor" → "maryjaneconnor"',
                translation: "Create a clean, lowercase username from full name with no special chars."
            }
        ]
    },
    {
        name: "initials",
        syntax: "{{initials arg1}}",
        arity: 1,
        desc: "Extracts the first letter of each word and converts them to Uppercase (Standard IDM Format).",
        examples: [
            {
                level: "Basic",
                code: "{{initials name.first}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "The text to extract initials from (variable or string)" }
                ],
                humanEnglish: "Look at the first name and grab the first letter of each word or hyphenated part.",
                result: '"Jean-Luc" → "JL"'
            },
            {
                level: "Intermediate",
                code: '{{concat initials name.first initials name.last}}',
                result: '"Jean-Luc Picard" → "JLP"',
                translation: "Combine initials from both first and last name."
            },
            {
                level: "Advanced",
                code: '{{toLower concat initials name.first name.last}}',
                result: '"Jean-Luc" + "Picard" → "jlpicard"',
                translation: "Create a username from first name initials + full last name, lowercased."
            }
        ]
    },
    {
        name: "trimLeft",
        syntax: "{{trimLeft arg1}}",
        arity: 1,
        desc: "Removes any leading whitespace (spaces, tabs) from the beginning of text.",
        examples: [
            {
                level: "Basic",
                code: '{{trimLeft name.first}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "The text to trim (variable or string)" }
                ],
                humanEnglish: "Take the first name and remove any extra spaces from the front.",
                result: '"  John" → "John"'
            },
            {
                level: "Intermediate",
                code: '{{trimLeft "   data"}}',
                result: '"   data" → "data"',
                translation: "Clean up a string literal that accidentally has leading spaces."
            },
            {
                level: "Advanced",
                code: '{{toLower trimLeft name.first}}',
                result: '"  JOHN" → "john"',
                translation: "Trim leading spaces AND convert to lowercase in one formula."
            }
        ]
    },
    {
        name: "delimiterCapitalize",
        syntax: "{{delimiterCapitalize arg1}}",
        arity: 1,
        desc: "Capitalizes the first letter of each word, treating spaces and hyphens as word delimiters.",
        examples: [
            {
                level: "Basic",
                code: '{{delimiterCapitalize name.full}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.full", meaning: "The text to capitalize (variable or string)" }
                ],
                humanEnglish: "Take the full name and capitalize the first letter of each word.",
                result: '"john doe" → "John Doe"'
            },
            {
                level: "Intermediate",
                code: '{{delimiterCapitalize name.first}}',
                result: '"mary-jane" → "Mary-Jane"',
                translation: "Capitalize hyphenated names correctly (both parts capitalized)."
            },
            {
                level: "Advanced",
                code: '{{delimiterCapitalize toLower name.full}}',
                result: '"JOHN DOE" → "John Doe"',
                translation: "First lowercase the entire name, then apply proper capitalization."
            }
        ]
    }
];
