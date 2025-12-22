export const chapter4 = {
    id: "chapter-4",
    title: "Chapter 4: Cleaning Data",
    description: "Master the art of the Data Janitor: trimming, replacing, and analyzing.",
    steps: [
        {
            id: "c4-s1",
            type: "challenge",
            title: "Refresher: Length",
            goal: "Check the length of the dirty string",
            description: "It's time to become a **Data Janitor**.\n\nData often comes in \"dirty\"—with extra spaces, weird symbols, or typos. Before we clean it, let's analyze it.\n\n**Challenge:**\nUse the `length` function (Arity 1) to count the characters in the `name` field.\n\n(It looks like \"Jean\", but is it?)",
            testCases: [
                { name: "Dirty Name", data: { "name": "   Jean   " }, expected: "10" }
            ],
            hints: ["Type {{ length name }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s2",
            type: "challenge",
            title: "Tool: Edge Cleaning",
            goal: "Remove the leading spaces",
            description: "See? The length was 10, but \"Jean\" only has 4 letters! That means there are hidden spaces.\n\n**New Tool: `trimLeft`**\n\nThis function removes all empty spaces from the **start** (left side) of a string.\n\n**Challenge:**\nClean up the `name` field.",
            testCases: [
                { name: "Dirty Name", data: { "name": "   Jean   " }, expected: "Jean   " }
            ],
            hints: ["Type {{ trimLeft name }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s3",
            type: "challenge",
            title: "Tool: The Nuke",
            goal: "Remove symbols/spaces and convert to UPPERCASE",
            description: "Sometimes you need to scrub EVERYTHING except the letters and numbers.\n\n**New Tool: `alphanumeric`**\n\nIt destroys spaces, punctuation, symbols—leaving only A-Z and 0-9.\n\n**Reinforcement:**\nLet's combine this with `toUpper` to create a standard, clean ID code.\n\n1. `alphanumeric` the `id_code`.\n2. `toUpper` the result.",
            testCases: [
                { name: "Messy Code", data: { "id_code": "User #123 (active)" }, expected: "USER123ACTIVE" }
            ],
            hints: ["Type {{ toUpper alphanumeric id_code }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s4",
            type: "challenge",
            title: "Concept: Intro to Replace",
            goal: "Replace the dots with exclamation points",
            description: "Sometimes you don't want to destroy characters, you want to **swap** them.\n\n**New Tool: `replace`** (Arity 3)\n\n`{{ replace text string_to_find string_to_replace_with }}`\n\nThink of it like \"Find and Replace\" in a word processor.\n\n**Challenge:**\nChange the dots `...` to `!!!` in the `status` message.",
            testCases: [
                { name: "Loading", data: { "status": "Loading..." }, expected: "Loading!!!" }
            ],
            hints: ["Type {{ replace status \"...\" \"!!!\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s5",
            type: "challenge",
            title: "Practice: Target Fixes",
            goal: "Fix the typo in the email domain",
            description: "A common job for the Data Janitor is fixing typos.\n\nOur user works at \"gmil.com\". That's wrong.\n\n**Challenge:**\nUse `replace` to change \"gmil\" to \"gmail\".",
            testCases: [
                { name: "Typo", data: { "email": "jean@gmil.com" }, expected: "jean@gmail.com" }
            ],
            hints: ["Type {{ replace email \"gmil\" \"gmail\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s6",
            type: "challenge",
            title: "Challenge: The Double Replace",
            goal: "Remove the brackets [ ] from the tag",
            description: "What if you need to remove TWO different things?\n\nYou can **Nest** a replace inside another replace!\n\n1. Inner: Replace `[` with `\"\"` (empty string).\n2. Outer: Replace `]` with `\"\"` (empty string) **using the result of step 1**.\n\n**Challenge:**\nClean the `tag` field so `[Admin]` becomes just `Admin`.",
            testCases: [
                { name: "Tagged", data: { "tag": "[Admin]" }, expected: "Admin" }
            ],
            hints: [
                "Replace [ first.",
                "Then wrap that whole formula in another replace for ].",
                "{{ replace (replace tag \"[\" \"\") \"]\" \"\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c4-s7",
            type: "challenge",
            title: "Concept: Summing Up",
            goal: "Calculate total length of First + Last",
            description: "Great cleanup work! Now let's analyze the data.\n\n**New Tool: `add`** (Arity 2)\n\n`{{ add number1 number2 }}`\n\nWe want to know the **Total Character Count** of the user's full name.\n\n**Challenge:**\n1. Get `length` of `name.first`.\n2. Get `length` of `name.last`.\n3. `add` them together.",
            testCases: [
                { name: "Jean Picard", data: { "name": { "first": "Jean", "last": "Picard" } }, expected: "10" }
            ],
            hints: [
                "Calculate the lengths first.",
                "{{ add (length first) (length last) }}",
                "{{ add length name.first length name.last }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c4-s7b",
            type: "challenge",
            title: "Practice: Score Bonus",
            goal: "Add 50 to the player score",
            description: "Let's practice `add` one more time.\n\nImagine a game where the player gets a **50 point bonus**.\n\n**Challenge:**\nTake the `score` from the data and `add` 50 to it.",
            testCases: [
                { name: "Player 1", data: { "score": 100 }, expected: "150" }
            ],
            hints: ["Type {{ add score 50 }}"],
            prefill: "{{}}"
        },
        {
            id: "c4-s7c",
            type: "challenge",
            title: "Challenge: The Chain",
            goal: "Sum 5 numbers: Base + Bonus + 30 + 40 + Ten",
            description: "The `add` function only takes **2 inputs**, but we need to add **5 things**.\n\n**The Inputs:**\n1. `score.base` (Data)\n2. `score.bonus.round` (Nested Data)\n3. Literal `30`\n4. Literal `40`\n5. The `glitch` field (It says \"ten\"... you need to `replace` it with \"10\"!)\n\n**The Strategy:**\nChain them all together! `add (1) add (2) add (3) ...`\n\n**Challenge:**\nCalculate the total (10 + 20 + 30 + 40 + 10 = 110).",
            testCases: [
                {
                    name: "Complex Sum",
                    data: {
                        "score": { "base": 10, "bonus": { "round": 20 } },
                        "glitch": "ten"
                    },
                    expected: "110"
                }
            ],
            hints: [
                "Start with: add score.base ...",
                "Chain the next add: ... add score.bonus.round ...",
                "Don't forget to fix the glitch: ... replace glitch \"ten\" \"10\"",
                "{{ add score.base add score.bonus.round add 30 add 40 replace glitch \"ten\" \"10\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c4-s8",
            type: "challenge",
            title: "Master Challenge: The Clean Sweep",
            goal: "Sanitize, Replace, and Finalize the First Name",
            description: "Put all your skills together for the Final Exam.\n\nThe input name is messy: `\"  Jean-Luc  \"`.\n\n**Your Mission:**\n1. `trimLeft` to clean the start.\n2. `replace` the hyphen `-` with a space ` `.\n3. Output the clean result: `\"Jean Luc  \"` (Don't worry about the trailing spaces for now).",
            testCases: [
                {
                    name: "Messy Hyphen",
                    data: { "name": { "first": "  Jean-Luc  " } },
                    expected: "Jean Luc  "
                },
                {
                    name: "Messy Standard",
                    data: { "name": { "first": "  William  " } },
                    expected: "William  "
                }
            ],
            hints: [
                "Trim it first.",
                "Then replace the hyphen.",
                "{{ replace trimLeft name.first \"-\" \" \" }}"
            ],
            prefill: "{{}}"
        }
    ]
};
