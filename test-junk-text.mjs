import { tokenize, parse } from './src/lib/parser.js';

console.log('=== Testing Junk Before and After Validation ===\n');

const testCases = [
    {
        desc: 'Junk before and after (from screenshot)',
        formula: 'asdasa{{concat "Hello, " toUpper name.last}}sdfdsdsf',
        shouldFail: true
    },
    {
        desc: 'Junk only before',
        formula: 'junk{{toUpper "hello"}}',
        shouldFail: true
    },
    {
        desc: 'Junk only after (already caught)',
        formula: '{{toUpper "hello"}}junk',
        shouldFail: true
    },
    {
        desc: 'Whitespace before (should be OK)',
        formula: '   {{toUpper "hello"}}',
        shouldFail: false
    },
    {
        desc: 'Valid formula',
        formula: '{{concat "Hello, " toUpper name.last}}',
        shouldFail: false
    },
];

let passCount = 0;
let failCount = 0;

testCases.forEach(({ desc, formula, shouldFail }) => {
    try {
        const tokens = tokenize(formula);
        const ast = parse(tokens);

        if (shouldFail) {
            console.log(`✗ FAIL - ${desc}`);
            console.log(`  Expected error, but formula was accepted`);
            failCount++;
        } else {
            console.log(`✓ PASS - ${desc}`);
            passCount++;
        }
    } catch (e) {
        if (shouldFail) {
            console.log(`✓ PASS - ${desc}`);
            console.log(`  Error: "${e.message}"`);
            passCount++;
        } else {
            console.log(`✗ FAIL - ${desc}`);
            console.log(`  Unexpected error: "${e.message}"`);
            failCount++;
        }
    }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Tests passed: ${passCount}`);
console.log(`Tests failed: ${failCount}`);
console.log(`\n${failCount === 0 ? '✓ All tests passed!' : '✗ Some tests failed!'}`);
