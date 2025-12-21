export const chapter10 = {
    id: "chapter-10",
    title: "Chapter 10: Master Challenge",
    description: "Combining everything you've learned.",
    steps: [
        {
            id: "c10-s1",
            type: "challenge",
            title: "Final Exam: Full Name with Optional Middle",
            goal: "Create a template that checks for a middle name. If it exists, include it between first and last names. If not, just First Last.",
            description: "The ultimate challenge! Combine all your skills. Complex concatenation with optional logic.",
            testCases: [
                {
                    name: "User with Middle Name",
                    data: { "name": { "first": "James", "middle": "Tiberius", "last": "Kirk" } },
                    expected: "James Tiberius Kirk"
                },
                {
                    name: "User without Middle Name",
                    data: { "name": { "first": "Jean-O'Luc", "last": "Picard" } },
                    expected: "Jean-O'Luc Picard"
                }
            ],
            hints: [
                "You need to conditionally add the middle name AND the extra space.",
                "Try: {{concat name.first concat \" \" ...}}",
                "Think about how to return an empty string if the middle name is missing."
            ]
        }
    ]
};
