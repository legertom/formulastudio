import { tokenize, parse } from './src/lib/parser.js';

// Test the exact case from the screenshot
const formula = '{{ "Hello" }}{{sdfsdff}}';
console.log('Testing exact formula from screenshot:', formula);
console.log('');

try {
    const tokens = tokenize(formula);
    console.log('Tokens:', tokens.map(t => `${t.type}:${t.value}`).join(' | '));

    const ast = parse(tokens);
    console.log('\n❌ UNEXPECTED: Formula was accepted without error!');
} catch (e) {
    console.log('\n✅ SUCCESS: Error caught correctly');
    console.log('Error message:', e.message);
}
