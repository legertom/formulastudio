export const SEARCH_REPLACE_OPS = [
    {
        name: "replace",
        syntax: '{{replace arg1 arg2 arg3}}',
        arity: 3,
        desc: "Finds all occurrences of a substring and replaces them with new text. Case-sensitive.",
        note: {
            title: "Common Use Cases",
            content: "Perfect for cleaning phone numbers, fixing formatting issues, standardizing data, or swapping characters."
        },
        examples: [
            {
                level: "Basic",
                code: '{{replace student.phone "-" ""}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.phone", meaning: "The text to search within (variable or string)" },
                    { arg: "Arg 2", value: '"-"', meaning: "The substring to find (what to remove or replace)" },
                    { arg: "Arg 3", value: '""', meaning: "The replacement text (empty string removes it)" }
                ],
                humanEnglish: "Look at the phone number and remove every hyphen by replacing it with nothing.",
                result: '"555-0199" → "5550199"'
            },
            {
                level: "Intermediate",
                code: '{{replace student.email "@oldschool.edu" "@newschool.edu"}}',
                result: '"jdoe@oldschool.edu" → "jdoe@newschool.edu"',
                translation: "Update email domain from old to new school domain (useful for migrations)."
            },
            {
                level: "Advanced",
                code: '{{toLower replace student.username "_" "."}}',
                result: '"John_Doe" → "john.doe"',
                translation: "Convert underscores to periods and lowercase the result for username standardization."
            }
        ]
    }
];
