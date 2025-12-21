export const chapter8 = {
    id: "chapter-8",
    title: "Chapter 8: Data Safety",
    description: "Handling missing or null values.",
    steps: [
        {
            id: "c8-s1",
            type: "challenge",
            title: "Final Exam: Middle Name Handling",
            goal: "Output the middle name if it exists, otherwise nothing.",
            description: "Handling nulls without errors.",
            testCases: [
                {
                    name: "User with Middle Name",
                    data: { "name": { "middle": "Tiberius" } },
                    expected: "Tiberius"
                },
                {
                    name: "User with No Middle Name",
                    data: { "name": { "first": "Jean" } }, // missing middle
                    expected: ""
                }
            ],
            hints: [
                "Direct access to a missing field throws an error.",
                "Use {{ignoreIfNull name.middle}}"
            ]
        }
    ]
};
