export const chapter4 = {
    id: "chapter-4",
    title: "Chapter 4: Cleaning Data",
    description: "Replacing characters and sanitizing inputs.",
    steps: [
        {
            id: "c4-s1",
            type: "challenge",
            title: "Final Exam: Hyphen Replacement",
            goal: "Create a template to replace hyphens with spaces in a first name.",
            description: "Data cleanup challenge.",
            testCases: [
                {
                    name: "Hyphenated Name",
                    data: { "name": { "first": "Jean-O'Luc" } },
                    expected: "Jean O'Luc"
                },
                {
                    name: "No Hyphen",
                    data: { "name": { "first": "William" } },
                    expected: "William"
                }
            ],
            hints: [
                "Use the {{replace}} function."
            ]
        }
    ]
};
