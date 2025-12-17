import { tokenize, parse } from './src/lib/parser.js';

// Simple Test
const simple = '{{if equals staff.title "SECRETARY" "Business" "Unknown"}}';
console.log('Testing Simple Formula:');
try {
    const tokens = tokenize(simple);
    console.log('Tokens:', JSON.stringify(tokens, null, 2));
    const ast = parse(tokens);
    console.log('AST:', JSON.stringify(ast, null, 2));
} catch (e) {
    console.error('Simple Test Failed:', e);
}

// Logic Test
const logic = '{{if equals a "b" "c" if equals d "e" "f" "g"}}';
// if (a==b) -> "c" else if (d==e) -> "f" else "g"
console.log('\nTesting Logic Chain:');
try {
    const ast = parse(tokenize(logic));
    console.log('AST:', JSON.stringify(ast, null, 2));
} catch (e) {
    console.error('Logic Test Failed:', e);
}
