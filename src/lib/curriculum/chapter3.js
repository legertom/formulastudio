export const chapter3 = {
    id: "chapter-3",
    title: "Chapter 3: Advanced Strings",
    description: "Substrings and more complex operations.",
    functions: ["initials", "substr"],
    steps: [
        {
            id: "c3-s1",
            type: "challenge",
            title: "Concept: The Single Input",
            goal: "Use toLower to lowercase the first name",
            description: "Let's talk about **Arity**.\n\n**Definition**: The number of arguments (inputs) a function takes.\n\n`{{ toLower text }}`\n\n**Etymology**: It comes from words like Un**ary** (1), Bin**ary** (2), and Tern**ary** (3). Mathematics just kept the \"-ary\" part!\n\nSome functions, like `toLower`, have an **Arity of 1**. They are \"Unary\" functions and need exactly one input.\n\n**Challenge:**\nUse `toLower` on `name.first`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "jean" }
            ],
            hints: ["Type {{ toLower name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s2",
            type: "challenge",
            title: "Concept: The Double Input",
            goal: "Use concat to join 'Hello' and 'World'",
            description: "Other functions, like `concat`, have an **Arity of 2**.\n\n`{{ concat text1 text2 }}`\n\nThey have **two slots** and need exactly two inputs to work.\n\nIf you only give it one, it breaks. If you give it three, it breaks.\n\n**Challenge:**\nJoin \"Hello\" and \"World\".",
            testCases: [
                { name: "Test", data: {}, expected: "HelloWorld" }
            ],
            hints: ["Type {{ concat \"Hello\" \"World\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s3",
            type: "challenge",
            title: "New Tool: Initials",
            goal: "Get the initials of the first name",
            description: "Meet your new favorite tool.\n\n**New Tool: `initials`** (Arity 1)\n\n`{{ initials text }}`\n\nIt automatically grabs the first letter of every word (separating by **spaces** or **hyphens**).\n\n**Challenge:**\nGet the initials for `name.first`.",
            testCases: [
                { name: "Hyphenated", data: { "name": { "first": "Jean-Luc" } }, expected: "JL" },
                { name: "Space Separated", data: { "name": { "first": "Mary Jane" } }, expected: "MJ" }
            ],
            hints: ["Type {{ initials name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s4",
            type: "challenge",
            title: "Practice: Initials",
            goal: "Create an acronym from the 'system.phrase' variable",
            description: "Let's see how powerful `initials` really is. It handles mixed separators and long phrases perfectly.\n\n💡 **PRO TIP: Under The Hood**\n`initials` uses `toUpper` **automatically**. This is standard for ID Codes.\n\n**Challenge:**\nUse it on the `system.phrase` field to turn \"what you see is what you get\" into \"WYSIWYG\".",
            testCases: [
                { name: "Acronym", data: { "system": { "phrase": "what you see is what you get" } }, expected: "WYSIWYG" },
                { name: "Mixed Separators", data: { "system": { "phrase": "Hyper-Text Markup Language" } }, expected: "HTML" }
            ],
            hints: ["Type {{ initials system.phrase }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s5",
            type: "challenge",
            title: "New Tool: Substring",
            goal: "Extract the first letter of First Name",
            description: "Sometimes you need more control than `initials` gives you.\n\n**New Tool: `substr`** (Arity 3)\n\n`{{ substr text start length }}`\n\nIt works by counting **Positions** starting at **0**:\n\n| Position | 0 | 1 | 2 | 3 |\n|----------|---|---|---|---|\n| Letter   | J | e | a | n |\n\n**Challenge:**\nGet just the first letter (Start at **0**, take **1**) of `name.first`.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "J" }
            ],
            hints: ["Type {{ substr name.first 0 1 }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s6",
            type: "challenge",
            title: "The \"Zero\" Rule",
            goal: "Extract the SECOND letter of First Name",
            description: "In programming, we start counting at **0**, not 1.\n\n*   Position 0 = First Letter\n*   Position 1 = Second Letter\n*   Position 2 = Third Letter\n\n**Challenge:**\nUse `substr` to grab the **second** letter of `name.first` (Start at 1, take 1).",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "e" }
            ],
            hints: ["Type {{ substr name.first 1 1 }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s7",
            type: "challenge",
            title: "Substring Practice",
            goal: "Extract the year (2025) from the date",
            description: "Let's try extracting from the middle.\n\nThe date is \"05-20-2025\".\n\n*   \"05\" is at 0.\n*   \"20\" is at 3.\n*   \"2025\" starts at... 6!\n\n**Challenge:**\nExtract the 4 digits of the year from `student.enrollment_date`.",
            testCases: [
                { name: "Date", data: { "student": { "enrollment_date": "05-20-2025" } }, expected: "2025" }
            ],
            hints: ["Start at 6. Length is 4.", "Type {{ substr student.enrollment_date 6 4 }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s8",
            type: "challenge",
            title: "Concept: Nesting",
            goal: "Uppercase the First Name, then add 'HI '",
            description: "You can put functions inside functions.\n\nRules:\n1. The **Inner** function runs first.\n2. The **Outer** function uses that result as its Input.\n\n**Challenge:**\n1. `toUpper` the `name.first`.\n2. `concat` \"HI \" to the result.",
            testCases: [
                { name: "Jean", data: { "name": { "first": "Jean" } }, expected: "HI JEAN" }
            ],
            hints: ["Type {{ concat \"HI \" toUpper name.first }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s9",
            type: "challenge",
            title: "The Triple Chain",
            goal: "Join Area Code, Dash, and Phone Number",
            description: "Since `concat` only has **2 Slots**, how do we join 3 things?\n\nWe nest a `concat` inside a `concat`!\n\n`{{ concat Part1 (concat Part2 Part3) }}`\n\n**Challenge:**\nJoin `student.area_code`, `\"-\"`, and `student.phone`.",
            testCases: [
                { name: "Phone", data: { "student": { "area_code": "555", "phone": "1234" } }, expected: "555-1234" }
            ],
            hints: ["Type {{ concat student.area_code concat \"-\" student.phone }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s10",
            type: "challenge",
            title: "Blueprint: The Handle",
            goal: "Create the handle text: FirstInitial + LastName",
            description: "Let's build the username parts.\n\nCombine the **First Initial** (using `substr`) and the **Last Name**.\n\nExample: `J` + `Picard` = `JPicard`",
            testCases: [
                { name: "Jean-Luc", data: { "name": { "first": "Jean-Luc", "last": "Picard" } }, expected: "JPicard" }
            ],
            hints: ["{{ concat substr name.first 0 1 name.last }}"],
            prefill: "{{}}"
        },
        {
            id: "c3-s11",
            type: "challenge",
            title: "Final Exam: ID Generation",
            goal: "Create a template for FirstInitial + LastName + Year",
            description: "Put it all together!\n\nCreate a User ID consisting of:\n1. First Initial\n2. Last Name\n3. Graduation Year\n\n(No spaces)",
            testCases: [
                {
                    name: "Standard User",
                    data: { "name": { "first": "Jean-O'Luc", "last": "Picard" }, "student": { "graduation_year": "2030" } },
                    expected: "JPicard2030"
                }
            ],
            hints: [
                "You need nested concats.",
                "{{ concat (Initial+Last) Year }}",
                "{{ concat concat substr ... name.last student.graduation_year }}"
            ],
            prefill: "{{}}"
        }
    ]
};
