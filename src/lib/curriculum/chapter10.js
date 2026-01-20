export const chapter10 = {
    id: "chapter-10",
    title: "Chapter 10: The Analyst",
    description: "Master dates, math, and data reporting.",
    functions: ["subtract", "formatDate", "delimiterCapitalize"],
    steps: [
        {
            id: "c10-s1",
            type: "challenge",
            title: "Refresher: Basic Math",
            goal: "Add the bonus to the salary",
            description: "Let's warm up with some simple math.\n\n**Tool: `add`** (Arity 2)\n`{{ add number1 number2 }}`\n\n**Challenge:**\nCalculate the `total` compensation by adding `salary` and `bonus`.",
            testCases: [
                { name: "Executive", data: { "salary": 100000, "bonus": 50000 }, expected: "150000" },
                { name: "Staff", data: { "salary": 50000, "bonus": 1000 }, expected: "51000" }
            ],
            hints: ["{{ add salary bonus }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s2",
            type: "challenge",
            title: "Concept: Subtraction",
            goal: "Calculate the balance",
            description: "To find the difference between numbers, we use subtraction.\n\n**New Tool: `subtract`** (Arity 2)\n`{{ subtract number1 number2 }}`\n\n*Example:* `{{ subtract 10 3 }}` -> `7`\n\n**Challenge:**\nCalculate the `balance` by subtracting `debit` from `credit`.",
            testCases: [
                { name: "Positive", data: { "credit": 500, "debit": 200 }, expected: "300" },
                { name: "Debt", data: { "credit": 100, "debit": 150 }, expected: "-50" }
            ],
            hints: ["{{ subtract credit debit }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s2-practice",
            type: "challenge",
            title: "Practice: Years of Service",
            goal: "Calculate tenure",
            description: "Let's use `subtract` for dates (years).\n\n**Challenge:**\nCalculate how long an employee has been with the company by subtracting `start_year` from `current_year`.",
            testCases: [
                { name: "Veteran", data: { "current_year": 2024, "start_year": 2010 }, expected: "14" },
                { name: "New Hire", data: { "current_year": 2024, "start_year": 2023 }, expected: "1" }
            ],
            hints: ["{{ subtract current_year start_year }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s3",
            type: "challenge",
            title: "Practice: Days Remaining",
            goal: "Calculate days until deadline",
            description: "Dates often behave like numbers. You can subtract them to find the difference in days (simplification for this lesson).\n\n**Data:**\n`target_day`: A number representing the deadline day.\n`current_day`: A number representing today.\n\n**Challenge:**\nCalculate how many days are left.",
            testCases: [
                { name: "Plenty of time", data: { "target_day": 30, "current_day": 10 }, expected: "20" },
                { name: "Due today", data: { "target_day": 30, "current_day": 30 }, expected: "0" }
            ],
            hints: ["{{ subtract target_day current_day }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s4",
            type: "challenge",
            title: "Concept: Numeric Logic",
            goal: "Check if balance is negative",
            description: "We can use comparison tools to check number status.\n\n**Refresher:**\n`less` checks if A < B.\n`geq` checks if A >= B.\n\n**Challenge:**\nIf the `balance` is **less than 0**, output `\"Overdrawn\"`. Otherwise, output `\"OK\"`.",
            testCases: [
                { name: "Safe", data: { "balance": 100 }, expected: "OK" },
                { name: "Overdrawn", data: { "balance": -5 }, expected: "Overdrawn" }
            ],
            hints: ["{{ if (less balance 0) \"Overdrawn\" \"OK\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s5",
            type: "challenge",
            title: "Practice: Overdue Alert",
            goal: "Flag overdue items",
            description: "Let's combine math and logic.\n\n**Scenario:**\nIf `days_left` (Target - Current) is **less than 0**, the item is `\"LATE\"`.\nOtherwise, it is `\"On Time\"`.\n\n**Challenge:**\nCalculate the days remaining, then check if it's negative.",
            testCases: [
                { name: "Late", data: { "target": 10, "current": 15 }, expected: "LATE" },
                { name: "Safe", data: { "target": 20, "current": 10 }, expected: "On Time" }
            ],
            hints: [
                "Calculate: subtract target current",
                "Check: less (calc) 0",
                "{{ if (less (subtract target current) 0) \"LATE\" \"On Time\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c10-s6",
            type: "challenge",
            title: "Concept: Date Formatting",
            goal: "Format the invoice date",
            description: "Raw dates like `2023-12-25` are ugly for humans.\n\n**New Tool: `formatDate`** (Arity 2)\n`{{ formatDate dateString pattern }}`\n\n*Example:* `{{ formatDate \"2023-01-01\" \"YYYY\" }}` -> `\"2023\"`\n\n**Patterns:**\n`YYYY` = Year (2023)\n`MMM` = Month (Jan, Feb)\n`DD` = Day (01, 31)\n`Do` = day with suffix (1st, 2nd)\n\n**Challenge:**\nFormat the `date` to look like `\"Jan 01, 2023\"` (`MMM DD, YYYY`).",
            testCases: [
                { name: "New Year", data: { "date": "2023-01-01" }, expected: "Jan 01, 2023" },
                { name: "Xmas", data: { "date": "2023-12-25" }, expected: "Dec 25, 2023" }
            ],
            hints: ["{{ formatDate date \"MMM DD, YYYY\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s6-practice",
            type: "challenge",
            title: "Practice: European Format",
            goal: "Reformat to DD/MM/YYYY",
            description: "Different regions use different date formats. In Europe, the day checks first.\n\n**Challenge:**\nFormat the `date` to look like `\"01/01/2023\"` (`DD/MM/YYYY`).",
            testCases: [
                { name: "New Year", data: { "date": "2023-01-01" }, expected: "01/01/2023" },
                { name: "Mid Year", data: { "date": "2023-06-15" }, expected: "15/06/2023" }
            ],
            hints: ["{{ formatDate date \"DD/MM/YYYY\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s7",
            type: "challenge",
            title: "Concept: Name Cleanup",
            goal: "Fix capitalization",
            description: "Names in databases are often messy, like `\"mary-anne\"`.\n\n**New Tool: `delimiterCapitalize`** (Arity 1)\n`{{ delimiterCapitalize string }}`\nCapitalizes the first letter of every word (splitting by spaces or hyphens).\n\n*Example:* `{{ delimiterCapitalize \"jean-luc\" }}` -> `\"Jean-Luc\"`\n\n**Challenge:**\nFix the `name` to be proper case.",
            testCases: [
                { name: "Hyphenated", data: { "name": "mary-anne" }, expected: "Mary-Anne" },
                { name: "Lowercase", data: { "name": "john doe" }, expected: "John Doe" }
            ],
            hints: ["{{ delimiterCapitalize name }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s7-practice",
            type: "challenge",
            title: "Practice: Book Titles",
            goal: "Fix title casing",
            description: "This function is great for titles too.\n\n**Challenge:**\nFix the `title` to look like a proper book title (Capitalize All Words).",
            testCases: [
                { name: "War/Peace", data: { "title": "war and peace" }, expected: "War And Peace" },
                { name: "Hobbit", data: { "title": "the-hobbit" }, expected: "The-Hobbit" }
            ],
            hints: ["{{ delimiterCapitalize title }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s7-initials",
            type: "challenge",
            title: "Practice: Report Header Initials",
            goal: "Create a compact report header",
            description: "In reports, we often use initials to save space while still identifying people.\n\n**Refresher: `initials`** (Arity 1)\n`{{ initials text }}` → extracts the first letter of each word.\n\n*Example:* `{{ initials \"John Doe\" }}` → `\"JD\"`\n\n**Challenge:**\nCreate a report header that shows the `analyst.name` as initials.\nOutput should be: `\"Report by: \"` followed by the initials.",
            testCases: [
                { name: "Jean-Luc Picard", data: { "analyst": { "name": "Jean-Luc Picard" } }, expected: "Report by: JLP" },
                { name: "Mary Jane Watson", data: { "analyst": { "name": "Mary Jane Watson" } }, expected: "Report by: MJW" }
            ],
            hints: [
                "Get initials: {{ initials analyst.name }}",
                "Combine with concat: {{ concat \"Report by: \" ... }}",
                "{{ concat \"Report by: \" (initials analyst.name) }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c10-s8",
            type: "challenge",
            title: "Validation: Safe ID",
            goal: "Ensure ID is alphanumeric",
            description: "Before printing IDs, we want to make sure they don't contain illegal symbols.\n\n**New Tool: `alphanumeric`** (Arity 1)\n`{{ alphanumeric string }}`\nReturns `true` if the text contains ONLY letters and numbers.\n\n*Example:* `{{ alphanumeric \"abc1\" }}` -> `true`\n\n**Challenge:**\nIf the `id` is alphanumeric, output `\"Valid\"`. Else `\"Invalid\"`.",
            testCases: [
                { name: "Good", data: { "id": "User123" }, expected: "Valid" },
                { name: "Bad", data: { "id": "User_123" }, expected: "Invalid" }
            ],
            hints: ["{{ if (alphanumeric id) \"Valid\" \"Invalid\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s8-practice",
            type: "challenge",
            title: "Practice: Security Check",
            goal: "Block special chars",
            description: "We are strict about `username` security. No special characters allowed!\n\n**Challenge:**\nCheck if the `username` is alphanumeric. If NOT (`false`), return `\"Error\"`. If it is (`true`), return `\"OK\"`.\n\n*Hint: Use the if tool.*",
            testCases: [
                { name: "Hacker", data: { "username": "admin!" }, expected: "Error" },
                { name: "User", data: { "username": "user1" }, expected: "OK" }
            ],
            hints: ["{{ if (alphanumeric username) \"OK\" \"Error\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c10-s9",
            type: "challenge",
            title: "Final Exam: The Statement",
            goal: "Generate a formatted financial report",
            description: "Combine everything!\n\n**Data:**\n`name`: \"acme-corp\"\n`due_date`: \"2023-11-01\"\n`amount`: 5000\n\n**Mission:**\nOutput a string: `\"Acme-Corp: $5000 due Nov 01, 2023\"`\n\n**Steps:**\n1. `delimiterCapitalize` the name.\n2. `formatDate` the date (`MMM DD, YYYY`).\n3. Combine them with `concat` and text.\n(Assume `amount` is just a number, you can concat `\"$\"` manually).",
            testCases: [
                {
                    name: "Acme",
                    data: { "name": "acme-corp", "due_date": "2023-11-01", "amount": 5000 },
                    expected: "Acme-Corp: $5000 due Nov 01, 2023",
                    matchRegex: "^Acme-Corp: \\$5000 due\\s+Nov 01, 2023$"
                },
                {
                    name: "Globex",
                    data: { "name": "globex inc", "due_date": "2024-01-05", "amount": 100 },
                    expected: "Globex Inc: $100 due Jan 05, 2024",
                    matchRegex: "^Globex Inc: \\$100 due\\s+Jan 05, 2024$"
                }
            ],
            hints: [
                "Step 1: {{ delimiterCapitalize name }}",
                "Step 2: {{ formatDate due_date \"MMM DD, YYYY\" }}",
                "Combine: concat (Step 1) \": $\"",
                "Then append amount...",
                "This is a big concat chain!"
            ],
            prefill: "{{}}"
        }
    ]
};
