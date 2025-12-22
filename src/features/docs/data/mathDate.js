export const MATH_DATE_OPS = [
    {
        name: "add",
        syntax: "{{add arg1 arg2}}",
        arity: 2,
        desc: "Performs addition on numeric values. Works with grade levels, years, IDs, or any numeric field.",
        args: [
            { name: "number1", desc: "The first number" },
            { name: "number2", desc: "The number to add" }
        ],
        examples: [
            {
                level: "Basic",
                code: "{{add student.grade 1}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The starting number (variable or literal)" },
                    { arg: "Arg 2", value: "1", meaning: "The number to add" }
                ],
                humanEnglish: "Take the student's current grade level and add 1 to calculate their next grade.",
                result: '"10" → "11"'
            },
            {
                level: "Intermediate",
                code: '{{concat "Grade " add student.grade 1}}',
                result: '"Grade 11" (if current grade is 10)',
                translation: "Calculate next year's grade and format it as a label with text."
            },
            {
                level: "Advanced",
                code: '{{if equals add student.grade 1 "13" "Graduate" concat "Grade " add student.grade 1}}',
                result: 'Grade 12 → "Graduate", Grade 11 → "Grade 12"',
                translation: "Project next grade, but show 'Graduate' instead of 'Grade 13' for seniors."
            }
        ]
    },
    {
        name: "subtract",
        syntax: "{{subtract arg1 arg2}}",
        arity: 2,
        desc: "Performs subtraction on numeric values. Useful for calculating years ago, previous grades, or age calculations.",
        args: [
            { name: "number1", desc: "The first number" },
            { name: "number2", desc: "The number to subtract" }
        ],
        examples: [
            {
                level: "Basic",
                code: "{{subtract student.grad_year 1}}",
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grad_year", meaning: "The starting number (variable or literal)" },
                    { arg: "Arg 2", value: "1", meaning: "The number to subtract" }
                ],
                humanEnglish: "Take the graduation year and subtract 1 to get the previous year.",
                result: '"2024" → "2023"'
            },
            {
                level: "Intermediate",
                code: '{{subtract "2025" student.grad_year}}',
                result: 'Grad year 2024 → "1" (one year out)',
                translation: "Calculate how many years until graduation from a reference year."
            },
            {
                level: "Advanced",
                code: '{{if greater subtract student.grad_year "2024" "0" "Alumni" "Current Student"}}',
                result: 'Grad 2023 → "Alumni", Grad 2025 → "Current Student"',
                translation: "Determine if student is alumni based on whether grad year has passed."
            }
        ]
    },
    {
        name: "formatDate",
        syntax: '{{formatDate arg1 arg2}}',
        arity: 2,
        desc: "Converts dates from one format to another. Supports common patterns like MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY.",
        note: {
            title: "Common Date Format Patterns",
            content: "MM = month (01-12), DD = day (01-31), YYYY = 4-digit year, YY = 2-digit year. Use hyphens, slashes, or spaces as separators."
        },
        args: [
            { name: "date", desc: "The date to format" },
            { name: "formatString", desc: "The desired output format (e.g. 'MM/DD/YYYY')" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{formatDate student.dob "MM/DD/YYYY"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.dob", meaning: "The date field to format (variable containing a date)" },
                    { arg: "Arg 2", value: '"MM/DD/YYYY"', meaning: "The desired output format pattern" }
                ],
                humanEnglish: "Take the student's date of birth and display it in American format (month/day/year).",
                result: '"2010-05-20" → "05/20/2010"'
            },
            {
                level: "Intermediate",
                code: '{{formatDate student.enrollment_date "YYYY-MM-DD"}}',
                result: '"05/20/2024" → "2024-05-20"',
                translation: "Convert from American format to ISO 8601 format (standard for databases)."
            },
            {
                level: "Advanced",
                code: '{{formatDate formatDate student.dob "YYYY-MM-DD" "DD/MM/YYYY"}}',
                result: '"2010-05-20" → "20/05/2010"',
                translation: "Chain format conversions to transform dates through multiple formats (ISO → European)."
            }
        ]
    }
];
