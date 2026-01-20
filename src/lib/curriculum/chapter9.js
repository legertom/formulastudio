export const chapter9 = {
    id: "chapter-9",
    title: "Chapter 9: Messy Data",
    description: "Learn how to extract data when you don't know the exact position.",
    functions: ["textBefore", "textAfter", "textAfterLast"],
    steps: [
        {
            id: "c9-s1",
            type: "challenge",
            title: "Refresher: Exact Positions",
            goal: "Extract the code using substr",
            description: "It's been a while! Let's review `substr`.\n\n`{{ substr string start end }}`\n\n**Challenge:**\nExtract the 2-letter code from the string.\n\nText: `\"Item: A1\"`\n\nThe code `A1` starts at index **6** and ends before index **8**.",
            testCases: [
                { name: "First Item", data: { "text": "Item: A1" }, expected: "A1" },
                { name: "Second Item", data: { "text": "Item: B2" }, expected: "B2" }
            ],
            hints: ["{{ substr text 6 8 }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s2",
            type: "challenge",
            title: "Concept: Delimiters",
            goal: "Extract username from email",
            description: "To handle messy data, we use \"Delimiters\" - specific characters we know will be there.\n\n**New Tool: `textBefore`** (Arity 2)\n`{{ textBefore string delimiter }}`\nReturns everything *before* the delimiter.\n\n*Example:* `{{ textBefore \"john.doe@email.com\" \"@\" }}` -> `\"john.doe\"`\n\n**Challenge:**\nGet the username (everything before `@`) from the `email`.",
            testCases: [
                { name: "Standard", data: { "email": "jdoe@example.com" }, expected: "jdoe" },
                { name: "Short", data: { "email": "me@test.org" }, expected: "me" }
            ],
            hints: ["{{ textBefore email \"@\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s3",
            type: "challenge",
            title: "Concept: The Other Side",
            goal: "Extract the domain from email",
            description: "Now let's get the other side.\n\n**New Tool: `textAfter`** (Arity 2)\n`{{ textAfter string delimiter }}`\nReturns everything *after* the delimiter.\n\n*Example:* `{{ textAfter \"User: John\" \": \" }}` -> `\"John\"`\n\n**Challenge:**\nExtract the domain (everything *after* the `@`) from the `email`.",
            testCases: [
                { name: "Standard", data: { "email": "jdoe@example.com" }, expected: "example.com" },
                { name: "Corp", data: { "email": "admin@corrp.net" }, expected: "corrp.net" }
            ],
            hints: ["Use textAfter instead of textBefore.", "{{ textAfter email \"@\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s4",
            type: "challenge",
            title: "Concept: The Sandwich",
            goal: "Extract text between brackets",
            description: "Sometimes the text you want is stuck in the middle.\n\n**Pattern: The Sandwich**\nTo get text *between* `[` and `]`, you chain the functions:\n1. Get everything `textAfter` the `[`.\n2. Take the result, and get `textBefore` the `]`.\n\n**Challenge:**\nExtract the status code from `\"[OK] System Ready\"`. You want just `\"OK\"`.",
            testCases: [
                { name: "OK Status", data: { "log": "[OK] System Ready" }, expected: "OK" },
                { name: "Error Status", data: { "log": "[ERR] Connection Failed" }, expected: "ERR" }
            ],
            hints: [
                "Inner step: get after `[` -> {{ textAfter log \"[\" }}",
                "Outer step: get before `]`",
                "{{ textBefore (textAfter log \"[\") \"]\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c9-s5",
            type: "challenge",
            title: "Practice: DN Start",
            goal: "Extract the user portion (everything after CN=)",
            description: "Let's practice with real identity data.\n\n**Context:** Systems like Active Directory use a \"Distinguished Name\" (DN) to locate users. It's like a file path:\n*   **CN** (Common Name): The person (e.g. Jean-Luc)\n*   **OU** (Organizational Unit): The folder (e.g. Users)\n*   **DC** (Domain Component): The organization\n\nAt Clever, we often need to extract just the **CN** to get the real name.\n\n**Data:** `\"CN=Jean-Luc,OU=Users,DC=Enterprise\"`.\n\n**Challenge:**\nWe only want the part *after* `\"CN=\"`.\n\nExtract `\"Jean-Luc,OU=Users,DC=Enterprise\"`.",
            testCases: [
                { name: "Jean-Luc", data: { "dn": "CN=Jean-Luc,OU=Users,DC=Enterprise" }, expected: "Jean-Luc,OU=Users,DC=Enterprise" },
                { name: "Worf", data: { "dn": "CN=Worf,OU=Security,DC=Enterprise" }, expected: "Worf,OU=Security,DC=Enterprise" }
            ],
            hints: [
                "{{ textAfter dn \"CN=\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c9-s6",
            type: "challenge",
            title: "Practice: DN Finish",
            goal: "Isolate the Common Name",
            description: "Now let's finish the job.\n\n**Goal:**\nWe just want the name `\"Jean-Luc\"`.\n\n**Challenge:**\nTake your previous answer (which gave you `\"Jean-Luc,OU...\"`) and get the text **before** the first comma `\",\"`.",
            testCases: [
                { name: "Jean-Luc", data: { "dn": "CN=Jean-Luc,OU=Users,DC=Enterprise" }, expected: "Jean-Luc" },
                { name: "Worf", data: { "dn": "CN=Worf,OU=Security,DC=Enterprise" }, expected: "Worf" }
            ],
            hints: [
                "Your inner step is textAfter \"CN=\"",
                "Your outer step is textBefore \",\"",
                "{{ textBefore (textAfter dn \"CN=\") \",\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c9-s7",
            type: "challenge",
            title: "Concept: The Last Resort",
            goal: "Extract file extension",
            description: "What if there are multiple delimiters? \n`\"report.final.v2.pdf\"`\n\nIf we use `textAfter` \".\", we get `\"final.v2.pdf\"`. That's not what we want.\n\n**New Tool: `textAfterLast`** (Arity 2)\n`{{ textAfterLast string delimiter }}`\nFinds the *last* occurrence of the delimiter and takes everything after it.\n\n*Example:* `{{ textAfterLast \"a.b.c\" \".\" }}` -> `\"c\"`\n\n**Challenge:**\nExtract the file extension (e.g. `\"pdf\"`).",
            testCases: [
                { name: "PDF", data: { "file": "report.final.v2.pdf" }, expected: "pdf" },
                { name: "Simple", data: { "file": "image.png" }, expected: "png" }
            ],
            hints: ["{{ textAfterLast file \".\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s7-practice",
            type: "challenge",
            title: "Practice: Last Name",
            goal: "Extract the last name",
            description: "Let's try another one. Sometimes names are messy too.\n\n**Data:** `\"Startrek, Jean Luc\"` or `\"Picard\"` (no comma).\n\nWait, actually let's look at full names formatted as `First Middle Last`.\n\n**Data:** `\"Jean Luc Picard\"`\n\n**Challenge:**\nGet the text after the *last* space to find the surname.",
            testCases: [
                { name: "Picard", data: { "name": "Jean Luc Picard" }, expected: "Picard" },
                { name: "Riker", data: { "name": "William T. Riker" }, expected: "Riker" }
            ],
            hints: ["{{ textAfterLast name \" \" }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s8",
            type: "challenge",
            title: "Refinement: Cleaning Up",
            goal: "Clean up the dirty data",
            description: "Sometimes extraction leaves garbage behind.\n\n**Data:** `\"   Value: 100\"`\nWe might be lazy and just extract after `\"Value:\"`. But the result is `\" 100\"`. (Note the space).\n\n**New Tool: `trimLeft`** (Arity 1)\n`{{ trimLeft string }}`\nRemoves whitespace from the start of a string.\n\n*Example:* `{{ trimLeft \"  hello\" }}` -> `\"hello\"`\n\n**Challenge:**\nExtract after `\"Value:\"` and then trim the result.",
            testCases: [
                { name: "Spaced", data: { "raw": "   Value: 100" }, expected: "100" },
                { name: "Tight", data: { "raw": "Value:200" }, expected: "200" }
            ],
            hints: [
                "{{ textAfter raw \"Value:\" }} gives \" 100\" or \"200\"",
                "Wrap it in {{ trimLeft ... }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c9-s8-practice",
            type: "challenge",
            title: "Practice: System Logs",
            goal: "Parse and clean",
            description: "Logs are notoriously messy.\n\n**Data:** `\"ERROR -   Connection Timeout\"`\n\n**Challenge:**\nExtract the message after `\"-\"`, but make sure to remove those leading spaces so it looks clean.",
            testCases: [
                { name: "Timeout", data: { "log": "ERROR -   Connection Timeout" }, expected: "Connection Timeout" },
                { name: "Auth", data: { "log": "INFO - Auth Successful" }, expected: "Auth Successful" }
            ],
            hints: ["{{ trimLeft (textAfter log \"-\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s9",
            type: "challenge",
            title: "Refresher: Safety Check",
            goal: "Extract only if safe",
            description: "If a delimiter doesn't exist, these functions usually return the empty string or original string. But sometimes we want to check first.\n\n**Refresher: `contains`** (Arity 2)\n`{{ contains haystack needle }}`\nReturns `true` if the text contains the substring.\n\n*Example:* `{{ contains \"test@test.com\" \"@\" }}` -> `true`\n\n**Challenge:**\nCheck if the `email` **contains** `\"@\"`. If yes, output `\"Valid\"`. If no, output `\"Invalid\"`.",
            testCases: [
                { name: "Valid", data: { "email": "test@test.com" }, expected: "Valid" },
                { name: "Invalid", data: { "email": "notanemail" }, expected: "Invalid" }
            ],
            hints: [
                "This is just a boolean check.",
                "{{ if (contains email \"@\") \"Valid\" \"Invalid\" }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c9-s9-practice",
            type: "challenge",
            title: "Practice: Domain Check",
            goal: "Block bad domains",
            description: "We can also use `contains` for logic checks.\n\n**Scenario:**\nWe only want users from `.edu` addresses.\n\n**Challenge:**\nIf the `email` contains `\".edu\"`, return `\"Allowed\"`. Otherwise, return `\"Blocked\"`.",
            testCases: [
                { name: "Allowed", data: { "email": "student@college.edu" }, expected: "Allowed" },
                { name: "Blocked", data: { "email": "hacker@gmail.com" }, expected: "Blocked" }
            ],
            hints: ["{{ if (contains email \".edu\") \"Allowed\" \"Blocked\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c9-s10",
            type: "challenge",
            title: "Final Exam: The CSV Parser",
            goal: "Extract Status from pipe-delimited string",
            description: "Let's put it all together.\n\n**Data:** `\"ID: 452 | Status: Active | Role: Admin\"`\n\n**Mission:**\nExtract the word `\"Active\"`. \n\n**Requirements:**\n1. It must work even if the ID changes length.\n2. It must work even if the Role changes.\n3. You must handle the spaces around the pipes.",
            testCases: [
                { name: "Active", data: { "row": "ID: 452 | Status: Active | Role: Admin" }, expected: "Active" },
                { name: "Pending", data: { "row": "ID: 9 | Status: Pending | Role: User" }, expected: "Pending" }
            ],
            hints: [
                "Delimiter 1: \"Status: \"",
                "Delimiter 2: \" |\"",
                "Sandwich pattern: textBefore (textAfter ...)"
            ],
            prefill: "{{}}"
        }
    ]
};
