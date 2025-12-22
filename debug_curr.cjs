const fs = require('fs');
const path = require('path');

const functions = [
    'if', 'ignoreifnull',
    'concat', 'upper', 'lower', 'len', 'contains', 'replace', 'substr', 'trim',
    'equals', 'greater', 'less', 'geq', 'leq', 'and', 'or', 'not',
    'add', 'subtract',
    'textbefore', 'textafter', 'textafterlast', 'formatdate'
];

const chapterCounts = {};
const curriculumDir = '/Users/tomleger/repo/formulastudio/src/lib/curriculum';

// Debug Chapter 1
const chapters = [1];

chapters.forEach(chapNum => {
    const filename = path.join(curriculumDir, `chapter${chapNum}.js`);
    const content = fs.readFileSync(filename, 'utf8');

    chapterCounts[chapNum] = {};
    functions.forEach(f => chapterCounts[chapNum][f] = 0);

    const hintsRegex = /hints:\s*\[([\s\S]*?)\]/g;
    let match;

    while ((match = hintsRegex.exec(content)) !== null) {
        const hintsBlock = match[1];
        // console.log(`BLOCK: ${hintsBlock}`);

        const stringRegex = /"([^"]*)"|'([^']*)'/g;
        let hintMatch;
        const hints = [];
        while ((hintMatch = stringRegex.exec(hintsBlock)) !== null) {
            hints.push(hintMatch[1] || hintMatch[2]);
        }

        if (hints.length === 0) continue;

        const lastHint = hints[hints.length - 1];
        console.log(`Hint: "${lastHint}"`); // DEBUG

        functions.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b`, 'i');
            if (regex.test(lastHint)) {
                console.log(`  -> Found: ${func}`);
                chapterCounts[chapNum][func]++;
            }
        });
    }
});
