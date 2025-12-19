
import { tokenize, parse, stringify } from './src/lib/parser.js';

const tests = [
    '{{concat name.first " " name.last}}',
    '{{concat name.first concat " " name.last}}'
];

tests.forEach(test => {
    console.log(`\nParsing: ${test}`);
    try {
        const tokens = tokenize(test);
        console.log('Tokens:', tokens.map(t => t.type + '(' + t.value + ')').join(', '));
        const ast = parse(tokens);
        console.log('AST:', JSON.stringify(ast, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
});
