export const chapter11 = {
    id: "chapter-11",
    title: "Chapter 11: Working with Lists",
    description: "Master the art of loops with forEach to process multiple items.",
    functions: ["forEach"],
    steps: [
        // === Part 1: The "Box" vs The "Folders" (S1-6) ===
        {
            id: "c11-s1",
            type: "challenge",
            title: "The Container Mystery",
            goal: "Observe the new data structure",
            description: `So far, we've worked with single values like \`student.name\`. But look at the data panel for something new: **schools**.

It doesn't have a single value. It has **square brackets** \`[]\`. This is an **Array** (also called a **List**).

Think of an Array as a **box**. Inside the box are multiple items.

**Challenge:**
Output the student's name to move forward, but keep your eyes on that \`schools\` box in the data panel!`,
            testCases: [
                { name: "Test", data: { "student": { "name": "Jean-Luc", "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Jean-Luc" }
            ],
            hints: ["{{ student.name }}"],
            prefill: "{{}}"
        },
        {
            id: "c11-s2",
            type: "challenge",
            title: "The Classroom Mistake",
            goal: "Understand why direct access fails",
            description: `A common mistake is trying to get a name directly from the list: \`student.schools.name\`.

Imagine a **Classroom** full of students. If you shout "What is your name?" at the room, you get silence. The *Classroom* doesn't have a name—the *Students* inside do.

**Challenge:**
Try to output \`student.schools.name\` and see what happens (it will be empty!). This proves we can't talk to the box; we have to talk to the items inside.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "" }
            ],
            hints: ["{{ student.schools.name }}"],
            prefill: "{{}}"
        },
        {
            id: "c11-s3",
            type: "challenge",
            title: "Checking the First Folder",
            goal: "Use an index for the first time",
            description: `To get to an item inside the box, we use its **position** (called an **index**).

In computer logic, we start counting at **0**.
- \`schools[0]\` is the first item.
- \`schools[1]\` is the second item.

**New Syntax:** \`array[index].property\`

**Challenge:**
Reach into the box and get the name of the **first** school: \`student.schools[0].name\`.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet Academy" }
            ],
            hints: ["{{ student.schools[0].name }}"],
            prefill: "{{}}"
        },
        {
            id: "c11-s4",
            type: "challenge",
            title: "The Second Folder",
            goal: "Practice indexing",
            description: `Great! You've successfully "opened" the first folder in the box. Now let's grab the second one.

Remember: the second item is at position **1**.

**Challenge:**
Output the name of the **second** school in the list.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Command School" }
            ],
            hints: ["{{ student.schools[1].name }}"],
            prefill: "{{}}"
        },
        {
            id: "c11-s5",
            type: "challenge",
            title: "Same Item, Different Data",
            goal: "Access a different property using an index",
            description: `Each "Student" in our "Classroom" (each item in our array) is an object with multiple fields.

For the first school (\`[0]\`), we can get the name OR the year.

**Challenge:**
Find out when Picard attended his first school. Output the \`year\` of \`student.schools[0]\`.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "2323" }
            ],
            hints: ["{{ student.schools[0].year }}"],
            prefill: "{{}}"
        },
        {
            id: "c11-s6",
            type: "challenge",
            title: "Scaling the Problem",
            goal: "Recognize the need for loops",
            description: `Now, try to output **all** the school names in the list by typing them out manually.

**Challenge:**
Output both school names by using index \`[0]\` and index \`[1]\` together.

Notice how much typing this is? Imagine if Picard had attended 50 schools. We need a way to automate this!`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet AcademyCommand School" }
            ],
            hints: ["{{ student.schools[0].name }}{{ student.schools[1].name }}"],
            prefill: "{{}}"
        },

        // === Part 2: Meet forEach - Simple Arrays (S7-9) ===
        {
            id: "c11-s7",
            type: "challenge",
            title: "The Automation Solution",
            goal: "See a loop in action",
            description: `Here's the solution: a **Loop**!

Instead of typing \`[0]\`, \`[1]\`, \`[2]\`, we tell the computer: "For every item in this list, do this action."

**forEach Syntax:**
\`{{forEach "variableName" array whatToOutput}}\`

**Challenge:**
The loop below works, but it's "smushing" the course names together. Use \`concat\` to add a comma and a space (\`", "\`) to the end of each course.`,
            testCases: [
                { name: "Test", data: { "student": { "courses": ["Navigation", "Tactics", "Diplomacy"] } }, expected: "Navigation, Tactics, Diplomacy, " }
            ],
            hints: [
                "Use concat to add \", \" to the variable c",
                "{{forEach \"c\" student.courses concat c \", \"}}"
            ],
            prefill: "{{forEach \"c\" student.courses c}}"
        },
        {
            id: "c11-s8",
            type: "challenge",
            title: "Naming the Variable",
            goal: "Understand the loop variable",
            description: `The first argument in quotes (\`"c"\`) is just a temporary label for "the item I'm currently looking at."

You can name it anything! It's like saying "For every **Student** in this classroom, tell me that **Student's** name."

**Challenge:**
Change the label from \`"c"\` to \`"item"\`. Make sure to update it in both the first and third arguments!`,
            testCases: [
                { name: "Test", data: { "student": { "courses": ["Navigation", "Tactics", "Diplomacy"] } }, expected: "NavigationTacticsDiplomacy" }
            ],
            hints: ["{{forEach \"item\" student.courses item}}"],
            prefill: "{{forEach \"c\" student.courses c}}"
        },
        {
            id: "c11-s9",
            type: "challenge",
            title: "Complete the Automation",
            goal: "Write the logic part of a forEach",
            description: `The third argument is the logic that runs for every item in the list.

**Challenge:**
Complete the formula by adding \`c\` as the third argument to output all the course names.`,
            testCases: [
                { name: "Test", data: { "student": { "courses": ["Navigation", "Tactics", "Diplomacy"] } }, expected: "NavigationTacticsDiplomacy" }
            ],
            hints: ["{{forEach \"c\" student.courses c}}"],
            prefill: "{{forEach \"c\" student.courses }}"
        },

        // === Part 3: forEach with Object Arrays (S10-12) ===
        {
            id: "c11-s10",
            type: "challenge",
            title: "Looping over Folders",
            goal: "Access properties inside a loop",
            description: `Now we return to our \`schools\` box. Because each item is a folder (an object), we use dot notation inside the loop.

If our label is \`"s"\`, then:
- \`s.name\` gets the school name.
- \`s.year\` gets the year.

**Challenge:**
The code outputs the whole folder (\`s\`). Change the logic to output just \`s.name\`.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet AcademyCommand School" }
            ],
            hints: ["{{forEach \"s\" student.schools s.name}}"],
            prefill: "{{forEach \"s\" student.schools s}}"
        },
        {
            id: "c11-s11",
            type: "challenge",
            title: "Switching the View",
            goal: "Access a different property in a loop",
            description: `Just like before, we can change which property we look at for every item in the box.

**Challenge:**
Change the logic to output \`s.year\` for every school Picard attended.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "23232333" }
            ],
            hints: ["{{forEach \"s\" student.schools s.year}}"],
            prefill: "{{forEach \"s\" student.schools s.name}}"
        },
        {
            id: "c11-s12",
            type: "challenge",
            title: "Write the Logic",
            goal: "Build object loop logic from scratch",
            description: `Time to apply what you've learned. The loop is missing its logic.

**Challenge:**
Complete the loop to output the name of every school in the list.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet AcademyCommand School" }
            ],
            hints: ["{{forEach \"s\" student.schools s.name}}"],
            prefill: "{{forEach \"s\" student.schools }}"
        },

        // === Part 4: Building Complex Output (S13-18) ===
        {
            id: "c11-s13",
            type: "challenge",
            title: "Combined Fields",
            goal: "Merge Name and Year inside a loop",
            description: `You can use any function inside a loop! Let's combine the school name and year directly.

**Challenge:**
Update the logic to \`concat s.name s.year\`. Try to anticipate what the output will look like!`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet Academy2323Command School2333" }
            ],
            hints: ["{{forEach \"s\" student.schools concat s.name s.year}}"],
            prefill: "{{forEach \"s\" student.schools }}"
        },
        {
            id: "c11-s14",
            type: "challenge",
            title: "Adding the Space",
            goal: "Intro to nested concat inside a loop",
            description: `That was hard to read. To add a space, we need a "nested" concat:

\`concat s.name (concat " " s.year)\`

**Challenge:**
Add the space so the school name and year are separated.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet Academy 2323Command School 2333" }
            ],
            hints: ["{{forEach \"s\" student.schools concat s.name (concat \" \" s.year)}}"],
            prefill: "{{forEach \"s\" student.schools concat s.name s.year}}"
        },
        {
            id: "c11-s15",
            type: "challenge",
            title: "The Wrapper Pattern",
            goal: "Practice punctuation wrapping",
            description: `Let's practice wrapping a value in parentheses.
            
Formula: \`concat "(\" (concat s.year \")\")\`

**Challenge:**
Change the logic to ONLY output the year wrapped in parentheses: \`(2323)\`(2333).`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "(2323)(2333)" }
            ],
            hints: ["{{forEach \"s\" student.schools concat \"(\" (concat s.year \")\")}}"],
            prefill: "{{forEach \"s\" student.schools }}"
        },
        {
            id: "c11-s16",
            type: "challenge",
            title: "Professional Formatting",
            goal: "Combine Name + (Year)",
            description: `Now combined Name and (Year). This requires three \`concat\` functions layered together.

**Challenge:**
Output: \`Starfleet Academy (2323)Command School (2333)\`.

Think of it as: Name + Space + Opening Parenthesis + Year + Closing Parenthesis.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet Academy (2323)Command School (2333)" }
            ],
            hints: ["{{forEach \"s\" student.schools concat s.name (concat \" (\" (concat s.year \")\"))}}"],
            prefill: "{{forEach \"s\" student.schools }}"
        },
        {
            id: "c11-s17",
            type: "challenge",
            title: "The Final Divider",
            goal: "Add a separator after each item",
            description: `To make this a real list, we need a divider between entries, like a vertical bar \` | \`.

**Challenge:**
Add the literal string \`" | "\` to the very end of your formatting logic.`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "Starfleet Academy (2323) | Command School (2333) | " }
            ],
            hints: ["{{forEach \"s\" student.schools concat s.name (concat \" (\" (concat s.year \") | \"))}}"],
            prefill: "{{forEach \"s\" student.schools concat s.name (concat \" (\" (concat s.year \")\"))}}"
        },
        {
            id: "c11-s18",
            type: "challenge",
            title: "Graduation",
            goal: "The Final Challenge",
            description: `You've mastered Lists! For your final task, create this exact report format:

\`STARFLEET ACADEMY - 2323 | COMMAND SCHOOL - 2333 | \`

**Requirements:**
1. Loop through \`student.schools\`.
2. Use \`toUpper\` on the name.
3. \`concat\` everything with the dash and the bar.

**Good luck, Captain!**`,
            testCases: [
                { name: "Test", data: { "student": { "schools": [{ "name": "Starfleet Academy", "year": "2323" }, { "name": "Command School", "year": "2333" }] } }, expected: "STARFLEET ACADEMY - 2323 | COMMAND SCHOOL - 2333 | " }
            ],
            hints: ["{{forEach \"s\" student.schools concat (toUpper s.name) (concat \" - \" (concat s.year \" | \"))}}"],
            prefill: "{{}}"
        }
    ]

};
