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
            goal: "Output the phrase: \"The global identity platform for education\"",
            description: "Computers are very strict.\n\nSpaces **inside** the quotes matter.\n\n`\" A \"` is different from `\"A\"`.\n\n**Challenge:**\nOutput the exact phrase below (don't forget the spaces!).",
            testCases: [{ name: "Test", data: {}, expected: "The global identity platform for education" }],
            hints: ["Type {{ \"The global identity platform for education\" }}"],
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
            description: "The previous step gave an **Error**.\n\nThat's because the computer looked for a variable named `Hello`, couldn't find it, and panicked.\n\n**Fix it:**\nAdd quotes around `\"Hello\"` to tell the computer: \"Relax, it's just text.\"",
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
            type: "challenge",
            title: "The Reference Panel",
            goal: "Locate the Reference Data panel below",
            description: "So far, we've just typed text.\n\nBut the real power of IDM is using **Data** that already exists.\n\nLook at the **Reference Data** panel below.\n\nThis is the \"Brain\" of the computer—everything it knows about the current user.",
            coachMark: {
                target: ".focus-reference-card",
                text: "This panel shows all available data.",
                placement: "top"
            },
            referenceDataPlacement: "top",
            testCases: [{ name: "Test", data: { name: { first: "Jean-Luc" } }, expected: "" }], // Just a reading step
            hints: ["Just hit Run to continue"],
            prefill: "{{}}"
        },
        {
            id: "c1-s8",
            type: "challenge",
            title: "Your First Variable",
            goal: "Output the user's name",
            description: "Data is like a Locker Room. Every locker has a **Name** and something inside.\n\n```\nName        Inside\n\"name\"  -> \"Jean-Luc\"\n```\n\nWe call the Name a **Key** because it **unlocks** the data.\n\nTo get the value `Jean-Luc`, use the Key: `name`.",
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
            description: "Now remove the quotes: `{{ name }}`.\n\nThis is a **Variable**. You are telling the computer: \"Don't write 'name'... go find what `name` **stands for**.\"\n\nIt's like the difference between a **Nametag** (Literal) and the **Person** wearing it (Variable).",
            referenceDataPlacement: "top",
            testCases: [{ name: "User", data: { "name": "Jean-Luc" }, expected: "Jean-Luc" }],
            hints: ["Type {{ name }}"],
            prefill: "{{ \"name\" }}"
        },
        {
            id: "c1-s11",
            type: "challenge",
            title: "Practice: Literal vs Variable",
            goal: "Output the student's grade value (11)",
            description: "Look at the data: `\"grade\": \"11\"`.\n\n*   `{{ \"grade\" }}` -> Prints \"grade\"\n*   `{{ grade }}` -> Prints \"11\"\n\n**Challenge:**\nOutput the student's grade.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "grade": "11" }, expected: "11" }],
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
            description: "Often, data is organized into **Groups** (or Folders).\n\nIn the data below, `student` is not just one text value. It's a Group that contains `grade`, `graduation_year`, etc.\n\n**Challenge:**\nTry to output the `student` variable directly.",
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
            description: "You got `[object Object]` because you asked for the whole folder.\n\nTo look **inside** a Group, we use a **Dot** `.`\n\n`{{ Group.Item }}`\n\n**Fix it:**\nType `{{ student.grade }}` to get the grade.",
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
            description: "Let's practice again.\n\nThe `school` group contains details about the school.\n\nUse dot notation to find the school's **name**.",
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
            description: "Groups can be inside other Groups!\n\nLook at the data path: `student` -> `credentials` -> `district_username`.\n\nWe just chain the dots together: `student.credentials.district_username`.",
            referenceDataPlacement: "top",
            testCases: [{ name: "Student", data: { "student": { "credentials": { "district_username": "username" } } }, expected: "username" }],
            hints: ["Type {{ student.credentials.district_username }}"],
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
