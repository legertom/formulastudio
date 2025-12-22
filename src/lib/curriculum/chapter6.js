export const chapter6 = {
    id: "chapter-6",
    title: "Chapter 6: Advanced Logic",
    description: "Combine decisions with and, or, not, and contains.",
    steps: [
        {
            id: "c6-s1",
            type: "challenge",
            title: "Refresher: The If Check",
            goal: "Check if role is 'Manager'",
            description: "Let's warm up with a standard check.\n\n**Tool: `if`** (Arity 3)\n\n**Challenge:**\nIf the `role` is `\"Manager\"`, output `\"Approved\"`. Otherwise output `\"Pending\"`.",
            testCases: [
                { name: "Manager", data: { "role": "Manager" }, expected: "Approved" },
                { name: "Staff", data: { "role": "Staff" }, expected: "Pending" }
            ],
            hints: ["{{ if (equals role \"Manager\") \"Approved\" \"Pending\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s2",
            type: "challenge",
            title: "Concept: The Power of And",
            goal: "Check if Ready AND Steady",
            description: "Logic is about combining Truths. Let's look at `and` in its purest form.\n\n**New Tool: `and`** (Arity 2)\n\n`{{ and boolean1 boolean2 }}`\n\nIt returns `true` ONLY if both inputs are true.\n\n**Challenge:**\nCheck if the system is `ready` **AND** `steady`.",
            testCases: [
                { name: "All Systems Go", data: { "ready": true, "steady": true }, expected: "true" },
                { name: "Not Steady", data: { "ready": true, "steady": false }, expected: "false" },
                { name: "Not Ready", data: { "ready": false, "steady": true }, expected: "false" }
            ],
            hints: ["{{ and ready steady }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s3",
            type: "challenge",
            title: "Concept: Dual Requirements",
            goal: "Check if Admin AND Active",
            description: "Now let's apply `and` to calculated values.\n\n**Challenge:**\nWe need to check if a user is an `\"Admin\"` **AND** their status is `\"Active\"`.\n\nYou'll need to use `equals` inside the `and`.",
            testCases: [
                { name: "Admin Active", data: { "role": "Admin", "status": "Active" }, expected: "true" },
                { name: "Admin Inactive", data: { "role": "Admin", "status": "Inactive" }, expected: "false" },
                { name: "sales Active", data: { "role": "Sales", "status": "Active" }, expected: "false" }
            ],
            hints: [
                "Check role: (equals role \"Admin\")",
                "Check status: (equals status \"Active\")",
                "Combine: {{ and (equals role \"Admin\") (equals status \"Active\") }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s4",
            type: "challenge",
            title: "Practice: Secure Access",
            goal: "Grant Access only to Active Admins",
            description: "Now let's use that `and` check inside an `if`.\n\n**Challenge:**\nIf the user is an `\"Admin\"` **AND** `\"Active\"`, output `\"Access Granted\"`. Otherwise output `\"Locked\"`.",
            testCases: [
                { name: "Admin Active", data: { "role": "Admin", "status": "Active" }, expected: "Access Granted" },
                { name: "Admin Inactive", data: { "role": "Admin", "status": "Inactive" }, expected: "Locked" },
                { name: "Staff Active", data: { "role": "Staff", "status": "Active" }, expected: "Locked" }
            ],
            hints: ["{{ if (and (equals role \"Admin\") (equals status \"Active\")) \"Access Granted\" \"Locked\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s5",
            type: "challenge",
            title: "Concept: The Power of Or",
            goal: "Check if Fast OR Cheap",
            description: "Let's look at `or` simply.\n\n**New Tool: `or`** (Arity 2)\n\n`{{ or boolean1 boolean2 }}`\n\nReturns `true` if *at least one* input is true.\n\n*(Note: `or` can also be used for text defaults, but we will come back to that later. For now, think of it as a Logic Gate.)*\n\n**Challenge:**\nCheck if the project is `fast` **OR** `cheap`.",
            testCases: [
                { name: "Fast", data: { "fast": true, "cheap": false }, expected: "true" },
                { name: "Cheap", data: { "fast": false, "cheap": true }, expected: "true" },
                { name: "Neither", data: { "fast": false, "cheap": false }, expected: "false" }
            ],
            hints: ["{{ or fast cheap }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s6",
            type: "challenge",
            title: "Concept: Mixing Checks",
            goal: "Check if VIP OR has Ticket",
            description: "We can mix calculated results with simple variables. You don't always need two functions.\n\n**Challenge:**\nA user can enter if they are a `\"VIP\"` **OR** if they `hasTicket` (Boolean).\n\nCombine the `equals` check with the boolean variable.",
            testCases: [
                { name: "VIP", data: { "type": "VIP", "hasTicket": false }, expected: "true" },
                { name: "Ticket Holder", data: { "type": "Guest", "hasTicket": true }, expected: "true" },
                { name: "Empty Handed", data: { "type": "Guest", "hasTicket": false }, expected: "false" }
            ],
            hints: ["{{ or (equals type \"VIP\") hasTicket }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s7",
            type: "challenge",
            title: "Concept: Flexible Entry",
            goal: "Check for VIP OR Member",
            description: "Now let's apply `or` to two calculated values.\n\n**Challenge:**\nCheck if the `type` is `\"VIP\"` **OR** `\"Member\"`.",
            testCases: [
                { name: "is VIP", data: { "type": "VIP" }, expected: "true" },
                { name: "is Member", data: { "type": "Member" }, expected: "true" },
                { name: "is Guest", data: { "type": "Guest" }, expected: "false" }
            ],
            hints: ["{{ or (equals type \"VIP\") (equals type \"Member\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s8",
            type: "challenge",
            title: "Practice: The Club Door",
            goal: "Welcome VIPs and Members",
            description: "Let's put `or` into action.\n\n**Challenge:**\nIf the user is a `\"VIP\"` or a `\"Member\"`, output `\"Welcome In\"`. All others get `\"Pay Entry\"`.",
            testCases: [
                { name: "VIP", data: { "type": "VIP" }, expected: "Welcome In" },
                { name: "Member", data: { "type": "Member" }, expected: "Welcome In" },
                { name: "Guest", data: { "type": "Guest" }, expected: "Pay Entry" }
            ],
            hints: ["{{ if (or (equals type \"VIP\") (equals type \"Member\")) \"Welcome In\" \"Pay Entry\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s9",
            type: "challenge",
            title: "Concept: Simple Negation",
            goal: "Flip the switch",
            description: "Sometimes it's easier to say what we *don't* want.\n\n**New Tool: `not`** (Arity 1)\n\n`{{ not boolean }}`\n\nFlips a Boolean value. `true` becomes `false`, `false` becomes `true`.\n\n**Challenge:**\nThe door `isLocked`. Use `not` to unlock it (return `false`).",
            testCases: [
                { name: "Locked", data: { "isLocked": true }, expected: "false" },
                { name: "Unlocked", data: { "isLocked": false }, expected: "true" }
            ],
            hints: ["{{ not isLocked }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s10",
            type: "challenge",
            title: "Practice: Negating a Check",
            goal: "Check if NOT Banned",
            description: "We can also negate the result of a function.\n\n**Challenge:**\nCheck if the `status` is **NOT** `\"Banned\"`.\n\n1. `equals status \"Banned\"` will be true if they are banned.\n2. Wrap that in `not` to flip it.",
            testCases: [
                { name: "Banned User", data: { "status": "Banned" }, expected: "false" },
                { name: "Active User", data: { "status": "Active" }, expected: "true" }
            ],
            hints: ["{{ not (equals status \"Banned\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s11",
            type: "challenge",
            title: "Practice: Exclusion List",
            goal: "Allow everyone except Banned users",
            description: "Let's use `not` to filter out bad actors.\n\n**Challenge:**\nIf the `status` is **NOT** `\"Banned\"`, output `\"Allow\"`. Otherwise output `\"Block\"`.",
            testCases: [
                { name: "Banned", data: { "status": "Banned" }, expected: "Block" },
                { name: "Active", data: { "status": "Active" }, expected: "Allow" },
                { name: "Pending", data: { "status": "Pending" }, expected: "Allow" }
            ],
            hints: ["{{ if (not (equals status \"Banned\")) \"Allow\" \"Block\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s12",
            type: "challenge",
            title: "Concept: Substring Search",
            goal: "Check if email contains @",
            description: "We can also get Booleans from text functions.\n\n**New Tool: `contains`** (Arity 2)\n\n`{{ contains haystack needle }}`\n\nReturns `true` if the `needle` text is found inside the `haystack`.\n\n**Challenge:**\nCheck if the `email` field contains the `@` symbol.",
            testCases: [
                { name: "Valid Email", data: { "email": "a@b.com" }, expected: "true" },
                { name: "Invalid Email", data: { "email": "ab.com" }, expected: "false" }
            ],
            hints: ["{{ contains email \"@\" }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s13",
            type: "challenge",
            title: "The Logic Chain",
            goal: "Complex Permission Check",
            description: "We can chain these logic gates together.\n\n**Pattern:** `{{ and condition1 (or condition2 condition3) }}`\n\n**Challenge:**\nA user can edit IF:\n\n• They are `\"Active\"`\n**AND**\n• They are EITHER `\"Editor\"` **OR** `\"Admin\"`\n\nOutput `\"Can Edit\"` or `\"View Only\"`.",
            testCases: [
                { name: "Active Admin", data: { "status": "Active", "role": "Admin" }, expected: "Can Edit" },
                { name: "Active Editor", data: { "status": "Active", "role": "Editor" }, expected: "Can Edit" },
                { name: "Inactive Admin", data: { "status": "Inactive", "role": "Admin" }, expected: "View Only" },
                { name: "Active Guest", data: { "status": "Active", "role": "Guest" }, expected: "View Only" }
            ],
            hints: [
                "Build the OR first: (or (equals role \"Admin\") (equals role \"Editor\"))",
                "Combine with AND: (and (equals status \"Active\") ...)",
                "Wrap in IF"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s14",
            type: "challenge",
            title: "Concept: The Triple And",
            goal: "Check if One AND Two AND Three",
            description: "To check 3 things, we just nest an `and` inside another `and`.\n\n**Structure:** `{{ and one (and two three) }}`\n\n**Challenge:**\nReturn true only if all three variables (`one`, `two`, `three`) are true.",
            testCases: [
                { name: "All True", data: { "one": true, "two": true, "three": true }, expected: "true" },
                { name: "One False", data: { "one": false, "two": true, "three": true }, expected: "false" },
                { name: "Two False", data: { "one": true, "two": false, "three": true }, expected: "false" }
            ],
            hints: ["{{ and one (and two three) }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s15",
            type: "challenge",
            title: "Practice: Length and Hash",
            goal: "Build Part 1 of Validator",
            description: "Let's build the Password Validator one piece at a time.\n\n**Challenge:**\nCheck if the password:\n\n• Length is **greater** than 8\n• **AND** Contains `\"#\"`",
            testCases: [
                { name: "Valid", data: { "pass": "secure#1234" }, expected: "true" },
                { name: "Short", data: { "pass": "short#" }, expected: "false" },
                { name: "No Hash", data: { "pass": "longpassword" }, expected: "false" }
            ],
            hints: ["{{ and (greater (len pass) 8) (contains pass \"#\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s16",
            type: "challenge",
            title: "Practice: The Forbidden Word",
            goal: "Build Part 2 of Validator",
            description: "Now let's handle the negative check.\n\n**Challenge:**\nCheck if the password does **NOT** contain the word `\"password\"`.",
            testCases: [
                { name: "Secure", data: { "pass": "mysecret" }, expected: "true" },
                { name: "Forbidden", data: { "pass": "mypassword123" }, expected: "false" }
            ],
            hints: ["{{ not (contains pass \"password\") }}"],
            prefill: "{{}}"
        },
        {
            id: "c6-s17",
            type: "challenge",
            title: "Practice: The Core Logic",
            goal: "Combine Part 1 and Part 2",
            description: "Now combine the two previous steps into one logic check.\n\n**Challenge:**\nReturn `true` if the password meets **ALL** criteria:\n\n• Length > 8 AND contains \"#\"\n• AND does NOT contain \"password\"\n\nUse the Triple And structure: `and (Part 1) (Part 2)`.",
            testCases: [
                { name: "Perfect", data: { "pass": "secure#123456" }, expected: "true" },
                { name: "Failed Part 1", data: { "pass": "short#" }, expected: "false" },
                { name: "Failed Part 2", data: { "pass": "mypassword#123" }, expected: "false" }
            ],
            hints: [
                "Part 1: (and (greater (len pass) 8) (contains pass \"#\"))",
                "Part 2: (not (contains pass \"password\"))",
                "Combine: {{ and (Part 1) (Part 2) }}"
            ],
            prefill: "{{}}"
        },
        {
            id: "c6-s18",
            type: "challenge",
            title: "Final Exam: Password Validator",
            goal: "Final Output",
            description: "You have built the engine. Now give it a voice.\n\n**Challenge:**\nOutput `\"Strong\"` if the password meets **all** these criteria:\n\n• Length is greater than 8\n• Contains `\"#\"`\n• Does NOT contain `\"password\"`\n\nOtherwise, output `\"Weak\"`.\n\n**(Tip: Reuse the logic you just built!)**",
            testCases: [
                { name: "Strong", data: { "pass": "secure#12345" }, expected: "Strong" },
                { name: "No Hash", data: { "pass": "secure123456" }, expected: "Weak" },
                { name: "Short", data: { "pass": "#short" }, expected: "Weak" },
                { name: "Forbidden Word", data: { "pass": "mypassword#123" }, expected: "Weak" }
            ],
            hints: [
                "Copy your answer from the previous step.",
                "Wrap it: {{ if (PASTE_LOGIC_HERE) \"Strong\" \"Weak\" }}"
            ],
            prefill: "{{}}"
        }
    ]
};
