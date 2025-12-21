export const chapter7 = {
    id: "chapter-7",
    title: "Chapter 7: Nested Logic",
    description: "Chaining multiple if statements.",
    steps: [
        {
            id: "c7-s1",
            type: "challenge",
            title: "Final Exam: Graduation Status",
            goal: "Output \"New Student\" (2037), \"Former Student\" (2025), or \"Current Student\" (Checked in that order).",
            description: "Nested logic.",
            testCases: [
                {
                    name: "New Student",
                    data: { "student": { "graduation_year": "2037" } },
                    expected: "New Student"
                },
                {
                    name: "Former Student",
                    data: { "student": { "graduation_year": "2025" } },
                    expected: "Former Student"
                },
                {
                    name: "Current Student",
                    data: { "student": { "graduation_year": "2030" } },
                    expected: "Current Student"
                }
            ],
            hints: [
                "Nest your if statements.",
                "Structure: {{if cond1 val1 if cond2 val2 val3}}"
            ]
        }
    ]
};
