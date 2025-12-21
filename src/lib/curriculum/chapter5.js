export const chapter5 = {
    id: "chapter-5",
    title: "Chapter 5: Basic Logic",
    description: "Introduction to conditional logic.",
    steps: [
        {
            id: "c5-s1",
            type: "challenge",
            title: "Final Exam: Length Conditional",
            goal: "Output \"Long name\" if first name length > 5, else \"Short name\".",
            description: "Logic based on string length.",
            testCases: [
                {
                    name: "Long Name",
                    data: { "name": { "first": "Jean-O'Luc" } },
                    expected: "Long name"
                },
                {
                    name: "Short Name",
                    data: { "name": { "first": "Data" } },
                    expected: "Short name"
                }
            ],
            hints: [
                "Use {{len}} to get the length.",
                "Combine {{if}}, {{greater}}, and {{len}}."
            ]
        }
    ]
};
