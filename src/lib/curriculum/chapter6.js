export const chapter6 = {
    id: "chapter-6",
    title: "Chapter 6: Equality Checks",
    description: "Checking if values match exactly.",
    steps: [
        {
            id: "c6-s1",
            type: "challenge",
            title: "Final Exam: Secret ID",
            goal: "Output \"secret\" if id is \"secret-id\", else \"not so secret\".",
            description: "Checking equality.",
            testCases: [
                {
                    name: "Regular ID",
                    data: { "id": "12345" },
                    expected: "not so secret"
                },
                {
                    name: "Secret ID",
                    data: { "id": "secret-id" },
                    expected: "secret"
                }
            ],
            hints: [
                "Use {{if equals id ... }}"
            ]
        }
    ]
};
