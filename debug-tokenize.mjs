import { tokenize, parse } from './src/lib/parser.js';

const formula = '{{ "Hello" }} extra text';
console.log('Testing formula:', formula);

const tokens = tokenize(formula);
console.log('\nTokens:', JSON.stringify(tokens, null, 2));
console.log('\nToken count:', tokens.length);
