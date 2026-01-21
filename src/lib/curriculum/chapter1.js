export const chapter1 = {
    id: "chapter-1",
    title: "Chapter 1: The Foundation",
    description: "Master the basics: primitives, variables, and data access.",
    steps: [
        {
            id: "c1-s1",
            type: "challenge",
            title: "The Wrapper",
            goal: "Type two opening braces {{ and two closing braces }}",
            description: "Every IDM formula is wrapped in **double curly braces**.\n\n`{{ ... }}`\n\nThis is the **Switch** that turns on the computer brain.\n\nWithout them, the computer just sees plain text.\n\n**Challenge:**\nType an empty wrapper to get started.",
            testCases: [{ name: "Test", data: {}, expected: "" }],
            hints: ["Type {{ }}"],
            prefill: ""
        },
        {
            id: "c1-s2",
            type: "challenge",
            title: "Literals",
            goal: "Output the text \"Hello\"",
            description: "To use text, we must wrap it in **double quotes** `\" \"`.\n\n`{{ \"Hello\" }}`\n\n**Why?**\nQuotes tell the computer: \"I mean **Literally** this text.\"\n\nIf you want the computer to say exactly what you type, you MUST use quotes.",
            testCases: [{ name: "Test", data: {}, expected: "Hello" }],
            hints: ["Type {{ \"Hello\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s3",
            type: "challenge",
            title: "The Space Rule",
            goal: "Output the phrase: \"A B C\"",
            description: "Computers are very strict.\n\nSpaces **inside** the quotes matter.\n\n`\"Cat Dog\"` is different from `\"CatDog\"`.\n\n**Challenge:**\nOutput the exact phrase below (don't forget the spaces!).",
            testCases: [{ name: "Test", data: {}, expected: "A B C" }],
            hints: ["Type {{ \"A B C\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s4",
            type: "challenge",
            title: "The Quote Rule (Part 1)",
            goal: "Try to type Hello WITHOUT quotes",
            description: "What happens if you forget the quotes?\n\nType `{{ Hello }}` and see what happens.\n\n(Spoiler: It won't work, because the computer thinks `Hello` is a command or a variable name!)",
            testCases: [{ name: "Test", data: {}, expectedError: "does not exist" }],
            hints: ["Type {{ Hello }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s5",
            type: "challenge",
            title: "The Quote Rule (Part 2)",
            goal: "Fix it by adding quotes",
            description: "The previous step gave an **Error**.\n\nThat's because the computer looked for a variable named `Hello`, couldn't find it, and panicked.\n\n**Fix it:**\nAdd quotes around `\"Hello\"` to tell the computer: \"Relax, it's just text.\"\n\n**Note:** The quotes wrap just the text—no extra spaces needed.",
            testCases: [{ name: "Test", data: {}, expected: "Hello" }],
            hints: ["Type {{ \"Hello\" }}"],
            prefill: "{{ Hello }}"
        },
        {
            id: "c1-s6",
            type: "challenge",
            title: "Numbers vs Strings",
            goal: "Output the number 2025",
            description: "Numbers don't *strictly* need quotes, but there is a rule:\n\n*   **Numbers** (Math): Age, Quantity, Score. Use `{{ 2025 }}`.\n*   **Strings** (Labels): Zip Codes, Phone Numbers, IDs. Use `{{ \"90210\" }}`.\n\nEven if a Zip Code is made of digits, it's not \"Math\". You don't subtract Phone Numbers!\n\n**Challenge:**\nOutput the year 2025 as a Number.",
            testCases: [{ name: "Test", data: {}, expected: "2025" }],
            hints: ["Type {{ 2025 }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s7",
            type: "multiple-choice",
            title: "The Reference Panel",
            goal: "Find the value stored in the data",
            description: "So far, we've just typed text.\n\nBut the real power of IDM is using **Data** that already exists.\n\nLook at the **Reference Data** panel below. This is the \"Brain\" of the computer—everything it knows about the current user.",
            question: "What is the value of `first`?",
            options: ["Jean-Luc", "name", "first", "Picard"],
            correctAnswer: "Jean-Luc",
            referenceData: { name: { first: "Jean-Luc", last: "Picard" } },
            hints: ["Look at the JSON data in the Reference Data panel", "Find the key called `first` and look at its value"]
        },
        {
            id: "c1-s8",
            type: "challenge",
            title: "Your First Variable",
            goal: "Output the user's name",
            description: "Data is like a Locker Room. Every locker has a **Key** (the label) and a **Value** (what's inside).\n\n```\nKey         Value\n\"name\"  ->  \"Jean-Luc\"\n```\n\nThe **Key** unlocks the data. To get the value `Jean-Luc`, use the key: `name`.",
            referenceDataPlacement: "top",
            testCases: [{ name: "User", data: { "name": "Jean-Luc" }, expected: "Jean-Luc" }],
            hints: ["Type {{ name }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s9",
            type: "challenge",
            title: "Literals (The Label)",
            goal: "Output the word \"name\"",
            description: "Let's pause and see the difference.\n\nType `{{ \"name\" }}` **WITH QUOTES**.\n\nThis is a **Literal**. You are telling the computer to literally write the word \"name\".",
            referenceDataPlacement: "top",
            testCases: [{ name: "User", data: { "name": "Jean-Luc" }, expected: "name" }],
            hints: ["Type {{ \"name\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s10",
            type: "challenge",
            title: "Variables (The Value)",
            goal: "Output the data inside name",
            description: "**Fix the formula** by removing the quotation marks around `name`.\n\nWithout quotes, `name` becomes a **Variable**. The computer will look up the value for that key.\n\n**Key Concept:**\nThe Variable `name` changes for every person. Click the different users above to see it change!",
            coachMark: {
                target: ".ref-avatar-1",
                text: "Click here to see Beverly's data.",
                placement: "top"
            },
            referenceDataPlacement: "top",
            testCases: [
                { name: "Jean-Luc", data: { "name": "Jean-Luc" }, expected: "Jean-Luc" },
                { name: "Beverly", data: { "name": "Beverly" }, expected: "Beverly" }
            ],
            hints: ["Remove the quotes around name", "Type {{ name }}"],
            prefill: "{{ \"name\" }}"
        },
        {
            id: "c1-s11",
            type: "challenge",
            title: "Practice: Literal vs Variable",
            goal: "Output the student's grade",
            description: "Look at the data: `\"grade\": \"11\"`.\n\n*   `{{ \"grade\" }}` -> Prints \"grade\" (Always)\n*   `{{ grade }}` -> Prints \"11\" (or \"12\", or \"10\"... it depends!)\n\n**Challenge:**\nOutput the student's grade. Check both students to see the value change.",
            coachMark: {
                target: ".ref-avatar-1",
                text: "See the Senior's grade.",
                placement: "top"
            },
            referenceDataPlacement: "top",
            testCases: [
                { name: "Junior", data: { "grade": "11" }, expected: "11" },
                { name: "Senior", data: { "grade": "12" }, expected: "12" }
            ],
            hints: ["We want the value, so NO quotes.", "Type {{ grade }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s12",
            type: "challenge",
            title: "Case Sensitivity",
            goal: "Fix the capitalization error",
            description: "Computers are extremely picky about capitalization.\n\n`Name` is NOT the same as `name`.\n\nThe variable below is broken because of a capital letter. Fix it to match the data exactly.",
            referenceDataPlacement: "top",
            testCases: [{ name: "User", data: { "name": "Jean-Luc" }, expected: "Jean-Luc" }],
            hints: ["Change Name to name"],
            prefill: "{{ Name }}"
        },
        {
            id: "c1-s13",
            type: "challenge",
            title: "Whitespace Freedom",
            goal: "Type {{   name   }} with extra spaces",
            description: "Spaces **around** variables don't matter.\n\n`{{name}}` is the same as `{{   name   }}`.\n\n**Challenge:**\nType `name` with a LOT of spaces to prove it still works.",
            referenceDataPlacement: "top",
            testCases: [{ name: "User", data: { "name": "Jean-Luc" }, expected: "Jean-Luc" }],
            hints: ["Type {{   name   }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s14",
            type: "challenge",
            title: "Groups",
            goal: "Type {{ student }} to see what happens",
            description: "Look at the data below. The key `student` doesn't have a simple value like `\"11\"`. Instead, it contains **more keys inside it**.\n\nWhen a key contains other keys, we call it a **Group** (programmers call it an **Object**).\n\n**Challenge:**\nTry to output `student` directly and see what happens.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "student": { "grade": "11", "graduation_year": "2027" } }, matchRegex: "\\[object Object\\]", expected: "[object Object]" }],
            hints: ["Type {{ student }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s15",
            type: "challenge",
            title: "Fixing the Error",
            goal: "Get the student's grade",
            description: "You got `[object Object]}` — that's the computer saying: \"This is a Group, not a simple value. I don't know how to display it as text.\"\n\nWe need to tell the computer **which key inside the Group** we want.\n\nTo look inside a Group, use a **Dot** `.`\n\n**Fix it:**\nType `{{ student.grade }}` to get the grade.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "student": { "grade": "11", "graduation_year": "2027" } }, expected: "11" }],
            hints: ["Type {{ student.grade }}"],
            prefill: "{{ student }}"
        },
        {
            id: "c1-s17",
            type: "challenge",
            title: "Practice: Dot Notation",
            goal: "Get the school's name",
            description: "Let's practice again.\n\nLook at the data: `school` is a Group (notice the `{ }` curly braces — that's how you spot an Object).\n\nUse dot notation to find the school's **name**.",
            referenceDataPlacement: "top",
            testCases: [{ name: "School", data: { "school": { "name": "Formula High" } }, expected: "Formula High" }],
            hints: ["Type {{ school.name }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s18",
            type: "challenge",
            title: "Deep Nesting",
            goal: "Get the district username",
            description: "Objects can contain other Objects, which can contain more Objects — it can go as deep as you want!\n\nHow do we access values nested deep inside? **More dots!**\n\nLook at the path: `student` → `credentials` → `district_username`\n\nJust chain the dots: `student.credentials.district_username`",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "student": { "credentials": { "district_username": "username" } } }, expected: "username" }],
            hints: ["Type {{ student.credentials.district_username }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s18b",
            type: "challenge",
            title: "Practice: Deep Nesting",
            goal: "Get the teacher's preferred first name",
            description: "Your turn! Use dot notation to dig into the nested data.\n\nFind the path: `teacher` → `ext` → `preferredfirstname`",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Teacher 1", data: { "teacher": { "ext": { "preferredfirstname": "Joanne" } } }, expected: "Joanne" },
                { name: "Teacher 2", data: { "teacher": { "ext": { "preferredfirstname": "Ali" } } }, expected: "Ali" }
            ],
            hints: ["Chain the dots together", "Type {{ teacher.ext.preferredfirstname }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s19",
            type: "challenge",
            title: "Missing Data",
            goal: "Trigger a missing field error",
            description: "What happens if you ask for something that isn't there?\n\nTry to get the `student.sport` field.\n\n(It doesn't exist, so the computer should panic!)",
            referenceDataPlacement: "top",
            testCases: [{ name: "Missing", data: { "student": { "grade": "11" } }, expectedError: "'student.sport' does not exist" }],
            hints: ["Type {{ student.sport }}"],
            prefill: "{{}}"
        },
        {
            id: "c1-s20",
            type: "challenge",
            title: "Final Exam",
            goal: "Get the last name",
            description: "Time to show what you know.\n\nThe `name` group contains `first` and `last`.\n\nOutput only the **Last Name**.",
            referenceDataPlacement: "top",
            testCases: [
                { name: "Jean-Luc", data: { "name": { "first": "Jean-Luc", "last": "Picard" } }, expected: "Picard" }
            ],
            hints: ["Type {{ name.last }}"],
            prefill: "{{}}"
        }
    ]
};
