import { tokenize, parse } from './src/lib/parser.js';

console.log('=== Testing Multiple Expression Detection ===\n');

const testCases = [
    {
        desc: 'Two complete formulas',
        formula: '{{ "Hello" }}{{sdfsdff}}',
        shouldFail: true
    },
    {
        desc: 'Formula with text after',
        formula: '{{ "Hello" }} extra text',
        shouldFail: true
    },
    {
        desc: 'Two formulas side by side',
        formula: '{{ toUpper "a" }}{{ toLower "B" }}',
        shouldFail: true
    },
    {
        desc: 'Valid single formula',
        formula: '{{ "Hello" }}',
        shouldFail: false
    },
    {
        desc: 'Valid nested formula',
        formula: '{{ concat "Hello, " toUpper name.last }}',
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
