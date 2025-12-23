const fs = require('fs');
const path = require('path');

const documentedFunctions = [
    // Text Transform
    'toLower', 'toUpper', 'substr', 'alphanumeric', 'initials', 'trimLeft', 'delimiterCapitalize',
    // Logic
    'if', 'equals', 'greater', 'less', 'geq', 'leq', 'contains', 'in', 'not', 'and', 'or',
    // Math/Date
    'add', 'subtract', 'formatDate',
    // Search/Replace
    'replace',
    // Text Extraction
    'textBefore', 'textAfter', 'textAfterLast',
    // Utility
    'concat', 'ignoreIfNull', 'length'
];

// Add 'len' to check for usage of the alias vs the official name
const extraFunctions = ['len'];

const allFunctions = [...documentedFunctions, ...extraFunctions];
const functionCounts = {};
allFunctions.forEach(f => functionCounts[f] = 0);

// We also want to track breakdown by chapter for the report
const chapterCounts = {};

const curriculumDir = '/Users/tomleger/repo/formulastudio/src/lib/curriculum';
const chapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Added 9 and 10

console.log("Analyzing chapters 1-10...");

chapters.forEach(chapNum => {
    const filename = path.join(curriculumDir, `chapter${chapNum}.js`);
    if (!fs.existsSync(filename)) return;

    const content = fs.readFileSync(filename, 'utf8');

    chapterCounts[chapNum] = {};
    allFunctions.forEach(f => chapterCounts[chapNum][f] = 0);

    // Regex to find "hints: [ ... ]"
    const hintsRegex = /hints:\s*\[([\s\S]*?)\]/g;
    let match;

    while ((match = hintsRegex.exec(content)) !== null) {
        const hintsBlock = match[1];
        const stringRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
        let hintMatch;
        const hints = [];
        while ((hintMatch = stringRegex.exec(hintsBlock)) !== null) {
            let s = hintMatch[0];
            s = s.substring(1, s.length - 1);
            hints.push(s);
        }

        if (hints.length === 0) continue;
        const lastHint = hints[hints.length - 1];

        allFunctions.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b`, 'i');
            if (regex.test(lastHint)) {
                functionCounts[func]++;
                chapterCounts[chapNum][func]++;
            }
        });
    }
});

console.log("\nFunction Usage Counts (Documented vs Used):");
documentedFunctions.forEach(f => {
    // console.log(`${f}: ${functionCounts[f]}`);
});
console.table(functionCounts);

console.log("\nBreakdown by Chapter:");
Object.keys(chapterCounts).forEach(c => {
    console.log(`\nChapter ${c}:`);
    const activeFuncs = Object.entries(chapterCounts[c])
        .filter(([_, count]) => count > 0)
        .reduce((acc, [f, count]) => ({ ...acc, [f]: count }), {});
    if (Object.keys(activeFuncs).length === 0) {
        console.log("(No functions used)");
    } else {
        console.table(activeFuncs);
    }
});

const unused = documentedFunctions.filter(f => functionCounts[f] === 0);
console.log("\nUNUSED Documented Functions:");
console.log(unused);
