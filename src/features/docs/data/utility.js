export const UTILITY_OPS = [
    {
        name: "concat",
        syntax: "{{concat val1 val2}}",
        arity: 2,
        desc: "Joins two strings together.",
        returns: "String",
        args: [
            { name: "text1", desc: "First string" },
            { name: "text2", desc: "Second string" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{concat name.first name.last}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "First text part" },
                    { arg: "Arg 2", value: "name.last", meaning: "Second text part" }
                ],
                humanEnglish: "Join the first and last name together directly.",
                result: '"John" + "Doe" → "JohnDoe"'
            },
            {
                level: "Intermediate",
                code: '{{concat name.first concat " " name.last}}',
                result: '"John" + " " + "Doe" → "John Doe"',
                translation: "Insert a space by nesting a second concat function."
            },
            {
                level: "Advanced",
                code: '{{concat toLower name.first "." toLower name.last "@school.edu"}}',
                result: '"john.doe@school.edu"',
                translation: "Build a complex string like an email address using multiple parts and functions."
            }
        ]
    },
    {
        name: "ignoreIfNull",
        syntax: "{{ignoreIfNull [field]}}",
        arity: 1,
        desc: "Skips the field if it has no data. Prevents Traffic Errors.",
        returns: "String",
        args: [
            { name: "value", desc: "The field to check" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{ignoreIfNull name.middle}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.middle", meaning: "The field that might be empty" }
                ],
                humanEnglish: "If middle name exists, show it. If not, return nothing (empty string).",
                result: '"James" → "James" | null → ""'
            },
            {
                level: "Intermediate",
                code: '{{concat name.first " " ignoreIfNull name.middle " " name.last}}',
                result: '"John  Doe" (if no middle name)',
                translation: "Safely include a middle name in a full name string without causing an error if it's missing."
            },
            {
                level: "Advanced",
                code: '{{if equals ignoreIfNull student.phone "" "No Phone" student.phone}}',
                result: 'null → "No Phone"',
                translation: "Explicitly handle missing data by providing a fallback value."
            }
        ]
    },
    {
        name: "length",
        syntax: "{{length [field]}}",
        arity: 1,
        desc: "Returns the character count of a string.",
        returns: "Number",
        args: [
            { name: "text", desc: "The text to measure" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{length name.first}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "The text to measure" }
                ],
                humanEnglish: "Count the number of characters in the first name.",
                result: '"Jean-Luc" → 8'
            },
            {
                level: "Intermediate",
                code: '{{if greater length student.password "8" "Valid" "Too Short"}}',
                result: '"pass" (4 chars) → "Too Short"',
                translation: "Check if a string meets a minimum length requirement."
            },
            {
                level: "Advanced",
                code: '{{if equals length student.sis_id "6" student.sis_id concat "0" student.sis_id}}',
                result: '"12345" → "012345"',
                translation: "Pad an ID number with a leading zero if it's too short."
            }
        ]
    },
    {
        name: "forEach",
        syntax: '{{forEach "variable" list "logic"}}',
        arity: 3,
        desc: "Loops over a list and applies logic to each item.",
        returns: "Groups (one output per list item)",
        args: [
            { name: "variable", desc: "Name for each item in the loop (as a string)" },
            { name: "list", desc: "The list/array to iterate over" },
            { name: "logic", desc: "The logic to apply (URL-encoded if nested braces)" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{forEach "s" schools "%7B%7Bs.name%7D%7D"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: '"s"', meaning: "Variable name for each school" },
                    { arg: "Arg 2", value: "schools", meaning: "The list to loop through" },
                    { arg: "Arg 3", value: '"%7B%7Bs.name%7D%7D"', meaning: "URL-encoded {{s.name}}" }
                ],
                humanEnglish: "Loop through each school and output its name.",
                result: '"School A", "School B", "School C"'
            }
        ]
    }
];
