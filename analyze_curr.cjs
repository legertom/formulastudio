const fs = require('fs');
const path = require('path');

const functions = [
    'if', 'ignoreifnull',
    'concat', 'upper', 'lower', 'len', 'contains', 'replace', 'substr', 'trim',
    'equals', 'greater', 'less', 'geq', 'leq', 'and', 'or', 'not',
    'add', 'subtract',
    'textbefore', 'textafter', 'textafterlast', 'formatdate'
];

const functionCounts = {};
functions.forEach(f => functionCounts[f] = 0);

const chapterCounts = {};

const curriculumDir = '/Users/tomleger/repo/formulastudio/src/lib/curriculum';

// Only Chapters 1-8 have content now (9 and 10 are empty)
const chapters = [1, 2, 3, 4, 5, 6, 7, 8];

console.log("Analyzing chapters...");

chapters.forEach(chapNum => {
    const filename = path.join(curriculumDir, `chapter${chapNum}.js`);
    if (!fs.existsSync(filename)) return;

    const content = fs.readFileSync(filename, 'utf8');

    // Initialize chapter counts
    chapterCounts[chapNum] = {};
    functions.forEach(f => chapterCounts[chapNum][f] = 0);

    // Regex to find "hints: [ ... ]"
    const hintsRegex = /hints:\s*\[([\s\S]*?)\]/g;
    let match;

    while ((match = hintsRegex.exec(content)) !== null) {
        const hintsBlock = match[1];

        // Improved regex for strings handling escaped quotes
        const stringRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
        let hintMatch;
        const hints = [];
        while ((hintMatch = stringRegex.exec(hintsBlock)) !== null) {
            // Remove the surrounding quotes
            let s = hintMatch[0];
            s = s.substring(1, s.length - 1); // remove outer quotes
            // Unescape quotes if needed (simple Replace is enough for typical cases here)
            // But we don't strictly need to unescape to find function names usually.
            // Let's keep it raw but without outer quotes.
            hints.push(s);
        }

        if (hints.length === 0) continue;

        const lastHint = hints[hints.length - 1];

        functions.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b`, 'i');
            if (regex.test(lastHint)) {
                functionCounts[func]++;
                chapterCounts[chapNum][func]++;
            }
        });
    }
});

console.log("\nTotal Function Usage:");
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
