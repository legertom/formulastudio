export const chapter9 = {
    id: "chapter-9",
    title: "Chapter 9: Existence Checks",
    description: "Logic based on whether fields exist.",
    steps: [
        {
            id: "c9-s1",
            type: "challenge",
            title: "Final Exam: Middle Name with Fallback",
            goal: "Output the middle name if it exists, otherwise \"No Middle Name\".",
            description: "Conditional logic based on field existence.",
            testCases: [
                {
                    name: "User with middle name",
                    data: { "name": { "middle": "Beth" } },
                    expected: "Beth"
                },
                {
                    name: "User with no middle name",
                    data: { "name": { "first": "Amy" } },
                    expected: "No Middle Name"
                }
            ],
            hints: [
                "Try using the 'if' and 'ignoreIfNull' functions together",
                "An empty value is interpreted as false by the 'if' function while a non-empty value is interpreted as true",
                "{{if <middle name exists> <middle name> <No Middle Name>}}"
            ]
        }
    ]
};
