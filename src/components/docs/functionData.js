// Shared function data for documentation pages
// Each category can be imported individually or all together

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
        desc: "Extracts the first letter of each word, handling spaces and hyphens.",
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

export const MATH_DATE_OPS = [
    {
        name: "add",
        syntax: "{{add arg1 arg2}}",
        arity: 2,
        desc: "Performs addition on numeric values. Works with grade levels, years, IDs, or any numeric field.",
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

export const LOGIC_OPS = [
    {
        name: "if",
        syntax: '{{if condition "true" "false"}}',
        arity: 3,
        desc: "Returns one value if true, another if false.",
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

export const UTILITY_OPS = [
    {
        name: "concat",
        syntax: "{{concat val1 val2}}",
        arity: 2,
        desc: "Joins two strings together.",
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
        name: "len",
        syntax: "{{len [field]}}",
        arity: 1,
        desc: "Returns the character count of a string.",
        examples: [
            {
                level: "Basic",
                code: '{{len name.first}}',
                argBreakdown: [
                    { arg: "Arg 1", value: "name.first", meaning: "The text to measure" }
                ],
                humanEnglish: "Count the number of characters in the first name.",
                result: '"Jean-Luc" → 8'
            },
            {
                level: "Intermediate",
                code: '{{if greater len student.password "8" "Valid" "Too Short"}}',
                result: '"pass" (4 chars) → "Too Short"',
                translation: "Check if a string meets a minimum length requirement."
            },
            {
                level: "Advanced",
                code: '{{if equals len student.sis_id "6" student.sis_id concat "0" student.sis_id}}',
                result: '"12345" → "012345"',
                translation: "Pad an ID number with a leading zero if it's too short."
            }
        ]
    }
];
