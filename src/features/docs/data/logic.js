export const LOGIC_OPS = [
    {
        name: "if",
        syntax: '{{if condition "true" "false"}}',
        arity: 3,
        desc: "Returns one value if true, another if false.",
        returns: "String",
        args: [
            { name: "condition", desc: "The condition to check (must be True/False)" },
            { name: "trueValue", desc: "Value to return if condition is True" },
            { name: "falseValue", desc: "Value to return if condition is False" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{if student.active "Active" "Inactive"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.active", meaning: "The boolean flag check (True/False)" },
                    { arg: "Arg 2", value: '"Active"', meaning: "Result if TRUE" },
                    { arg: "Arg 3", value: '"Inactive"', meaning: "Result if FALSE" }
                ],
                humanEnglish: "Check if the student is active. If yes, return 'Active'. If not, return 'Inactive'.",
                result: 'True → "Active" | False → "Inactive"'
            },
            {
                level: "Basic",
                code: '{{if equals student.grade "12" "Senior" "Student"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: 'equals student.grade "12"', meaning: "The condition to check (True/False)" },
                    { arg: "Arg 2", value: '"Senior"', meaning: "Result if TRUE" },
                    { arg: "Arg 3", value: '"Student"', meaning: "Result if FALSE" }
                ],
                humanEnglish: "Check if the grade is 12. If yes, return 'Senior'. If not, return 'Student'.",
                result: 'Grade 12 → "Senior" | Grade 10 → "Student"'
            },
            {
                level: "Intermediate",
                code: '{{if greater student.gpa "3.5" "Honor Roll" "Standard"}}',
                result: 'GPA 3.8 → "Honor Roll"',
                translation: "If GPA is strictly higher than 3.5, label as Honor Roll."
            },
            {
                level: "Advanced",
                code: '{{if equals student.status "Active" if greater student.gpa "3.5" "Scholar" "Active" "Inactive"}}',
                result: 'Active & High GPA → "Scholar"',
                translation: "Nested Logic: First check if Active. If Active, check GPA for Scholar status. If not Active, return Inactive."
            }
        ]
    },
    {
        name: "equals",
        syntax: "{{equals val1 val2}}",
        arity: 2,
        desc: "Checks if two values are identical.",
        returns: "Boolean",
        args: [
            { name: "value1", desc: "The first value to compare" },
            { name: "value2", desc: "The second value to compare" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{equals student.grade "12"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The variable to check" },
                    { arg: "Arg 2", value: '"12"', meaning: "The value to compare against" }
                ],
                humanEnglish: "Check if the student's grade is exactly 12.",
                result: 'True if 12, False otherwise'
            },
            {
                level: "Intermediate",
                code: '{{if equals student.grade "12" "Senior" "Student"}}',
                result: 'Grade 12 → "Senior" | Grade 11 → "Student"',
                translation: "Commonly used inside an `if` statement to trigger logic."
            },
            {
                level: "Advanced",
                code: '{{equals toLower student.email toLower student.username}}',
                result: '"JDOE@school.edu" vs "jdoe@school.edu" → True',
                translation: "Case-insensitive comparison by converting both sides to lowercase first."
            }
        ]
    },
    {
        name: "greater",
        syntax: "{{greater val1 val2}}",
        arity: 2,
        desc: "Checks if val1 > val2.",
        returns: "Boolean",
        args: [
            { name: "value1", desc: "The value to check" },
            { name: "value2", desc: "The threshold to compare against" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{greater student.grade "08"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The variable to check" },
                    { arg: "Arg 2", value: '"08"', meaning: "The threshold value" }
                ],
                humanEnglish: "Check if the grade is strictly greater than 08.",
                result: 'Grade 09 → True | Grade 08 → False'
            },
            {
                level: "Intermediate",
                code: '{{if greater student.gpa "3.0" "Eligible" "Ineligible"}}',
                result: 'GPA 3.5 → "Eligible"',
                translation: "Used to determine eligibility based on a GPA threshold."
            },
            {
                level: "Advanced",
                code: '{{and greater student.grade "09" greater student.gpa "3.5"}}',
                result: 'Grade 10, GPA 3.8 → True',
                translation: "Combined check: Grade must be > 09 AND GPA must be > 3.5."
            }
        ]
    },
    {
        name: "less",
        syntax: "{{less val1 val2}}",
        arity: 2,
        desc: "Checks if val1 < val2.",
        returns: "Boolean",
        args: [
            { name: "value1", desc: "The value to check" },
            { name: "value2", desc: "The threshold to compare against" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{less student.grade "09"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The variable to check" },
                    { arg: "Arg 2", value: '"09"', meaning: "The threshold value" }
                ],
                humanEnglish: "Check if the grade is strictly less than 09 (Middle School or lower).",
                result: 'Grade 08 → True | Grade 09 → False'
            },
            {
                level: "Intermediate",
                code: '{{if less student.days_absent "5" "Good Attendance" "At Risk"}}',
                result: '3 absences → "Good Attendance"',
                translation: "Classify students based on absence count."
            },
            {
                level: "Advanced",
                code: '{{or less student.grade "09" greater student.grade "12"}}',
                result: 'Grade 05 → True',
                translation: "Check if grade is OUTSIDE the High School range (9-12)."
            }
        ]
    },
    {
        name: "geq",
        syntax: "{{geq val1 val2}}",
        arity: 2,
        desc: "Greater than or equal to.",
        returns: "Boolean",
        args: [
            { name: "value1", desc: "The value to check" },
            { name: "value2", desc: "The threshold to compare against" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{geq student.grade "09"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The variable to check" },
                    { arg: "Arg 2", value: '"09"', meaning: "The threshold value" }
                ],
                humanEnglish: "Check if the grade is 09 or higher (High School).",
                result: 'Grade 09 → True | Grade 08 → False'
            },
            {
                level: "Intermediate",
                code: '{{if geq student.age "18" "Adult" "Minor"}}',
                result: 'Age 18 → "Adult"',
                translation: "Determine legal adulthood status."
            },
            {
                level: "Advanced",
                code: '{{if geq len student.password "8" "Valid" "Too Short"}}',
                result: '"secret123" (9 chars) → "Valid"',
                translation: "Validate password length using nested logic."
            }
        ]
    },
    {
        name: "leq",
        syntax: "{{leq val1 val2}}",
        arity: 2,
        desc: "Less than or equal to.",
        returns: "Boolean",
        args: [
            { name: "value1", desc: "The value to check" },
            { name: "value2", desc: "The threshold to compare against" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{leq student.grade "05"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The variable to check" },
                    { arg: "Arg 2", value: '"05"', meaning: "The threshold value" }
                ],
                humanEnglish: "Check if the grade is 05 or lower (Elementary School).",
                result: 'Grade 05 → True | Grade 06 → False'
            },
            {
                level: "Intermediate",
                code: '{{if leq student.gpa "2.0" "Academic Probation" "Safe"}}',
                result: 'GPA 1.8 → "Academic Probation"',
                translation: "Flag students with low GPA."
            },
            {
                level: "Advanced",
                code: '{{and leq student.grade "05" geq student.grade "01"}}',
                result: 'Grade 03 → True',
                translation: "Check if grade is within the Elementary range (1-5)."
            }
        ]
    },
    {
        name: "contains",
        syntax: "{{contains str sub}}",
        arity: 2,
        desc: "Checks if a string contains a substring.",
        returns: "Boolean",
        args: [
            { name: "text", desc: "The text to search within" },
            { name: "substring", desc: "The text to look for" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{contains student.email "@student"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.email", meaning: "The text to search" },
                    { arg: "Arg 2", value: '"@student"', meaning: "The substring to look for" }
                ],
                humanEnglish: "Check if the email address contains '@student'.",
                result: '"jdoe@student.edu" → True'
            },
            {
                level: "Intermediate",
                code: '{{if contains student.address "Box" "PO Box" "Street Address"}}',
                result: '"PO Box 123" → "PO Box"',
                translation: "Classify address type based on content."
            },
            {
                level: "Advanced",
                code: '{{contains toLower student.notes "urgent"}}',
                result: '"This is URGENT" → True',
                translation: "Case-insensitive check for keywords in notes."
            }
        ]
    },
    {
        name: "in",
        syntax: '{{in val "item1 item2"}}',
        arity: 2,
        desc: "Checks if a value is in a list.",
        returns: "Boolean",
        args: [
            { name: "value", desc: "The value to check" },
            { name: "list", desc: "A space-separated list of allowed values" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{in student.grade "09 10 11 12"}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.grade", meaning: "The value to check" },
                    { arg: "Arg 2", value: '"09 10 11 12"', meaning: "Space-separated list of allowed values" }
                ],
                humanEnglish: "Check if the student is in any High School grade.",
                result: 'Grade 10 → True'
            },
            {
                level: "Intermediate",
                code: '{{if in student.status "Active Enrolled" "Current" "Former"}}',
                result: '"Enrolled" → "Current"',
                translation: "Group multiple status codes into a single category."
            },
            {
                level: "Advanced",
                code: '{{in toLower student.department "math science engineering"}}',
                result: '"Science" → True',
                translation: "Case-insensitive check against a list of departments."
            }
        ]
    },
    {
        name: "not",
        syntax: "{{not val}}",
        arity: 1,
        desc: "Inverts a boolean (True becomes False).",
        returns: "Boolean",
        args: [
            { name: "value", desc: "The boolean value to invert" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{not student.active}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.active", meaning: "The boolean to invert" }
                ],
                humanEnglish: "Check if the student is NOT active.",
                result: 'Active=True → False | Active=False → True'
            },
            {
                level: "Intermediate",
                code: '{{if not contains student.email "@" "Invalid Email" "Valid"}}',
                result: '"user_no_domain" → "Invalid Email"',
                translation: "Flag data that is missing a required character."
            },
            {
                level: "Advanced",
                code: '{{not or student.active student.graduated}}',
                result: 'Neither active nor graduated → True',
                translation: "Check if student has NO status (neither active nor graduated)."
            }
        ]
    },
    {
        name: "and",
        syntax: "{{and val1 val2}}",
        arity: 2,
        desc: "True only if BOTH are true.",
        returns: "Boolean",
        args: [
            { name: "condition1", desc: "First condition" },
            { name: "condition2", desc: "Second condition" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{and student.active student.paid}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.active", meaning: "First condition" },
                    { arg: "Arg 2", value: "student.paid", meaning: "Second condition" }
                ],
                humanEnglish: "Check if student is both Active AND Paid.",
                result: 'Both True → True'
            },
            {
                level: "Intermediate",
                code: '{{if and equals student.grade "12" equals student.status "Active" "Senior" "Other"}}',
                result: 'Active 12th grader → "Senior"',
                translation: "Define a cohort based on multiple criteria."
            },
            {
                level: "Advanced",
                code: '{{and greater student.gpa "3.5" not contains student.notes "Discipline"}}',
                result: 'High GPA & No Discipline → True',
                translation: "Complex criteria for awards eligibility."
            }
        ]
    },
    {
        name: "or",
        syntax: "{{or val1 val2}}",
        arity: 2,
        desc: "True if AT LEAST ONE is true.",
        returns: "Boolean",
        args: [
            { name: "condition1", desc: "First condition" },
            { name: "condition2", desc: "Second condition" }
        ],
        examples: [
            {
                level: "Basic",
                code: '{{or student.active student.graduated}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "student.active", meaning: "First condition" },
                    { arg: "Arg 2", value: "student.graduated", meaning: "Second condition" }
                ],
                humanEnglish: "Check if student is either Active OR Graduated (exists in system).",
                result: 'One or both True → True'
            },
            {
                level: "Intermediate",
                code: '{{if or equals student.grade "11" equals student.grade "12" "Upperclassman" "Underclassman"}}',
                result: 'Grade 11 → "Upperclassman"',
                translation: "Group Grades 11 and 12 together."
            },
            {
                level: "Advanced",
                code: '{{or contains student.email "@school.edu" contains student.email "@district.org"}}',
                result: '"jdoe@district.org" → True',
                translation: "Validate email against multiple allowed domains."
            }
        ]
    }
];
