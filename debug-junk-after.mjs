import { tokenize, parse } from './src/lib/parser.js';

const formula = '{{toUpper "hello"}}junk';
console.log('Testing formula:', formula);

try {
    const tokens = tokenize(formula);
    console.log('\nTokens:', JSON.stringify(tokens, null, 2));
    console.log('Token count:', tokens.length);

    const ast = parse(tokens);
    console.log('\n❌ UNEXPECTED: Formula was accepted!');
} catch (e) {
    console.log('\n✅ ERROR CAUGHT:', e.message);
}
