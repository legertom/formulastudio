import { tokenize } from './src/lib/parser.js';

try {
    const input = '{{ "escaped \\"quote\\"" }}';
    console.log("Input:", input);
    const tokens = tokenize(input);
    console.log("Tokens:", JSON.stringify(tokens, null, 2));
} catch (e) {
    console.error("Error:", e.message);
}

try {
    const input2 = '{{ "{ id: 123 }" }}';
    console.log("Input2:", input2);
    const tokens2 = tokenize(input2);
    console.log("Tokens2:", JSON.stringify(tokens2, null, 2));
} catch (e) {
    console.error("Error2:", e.message);
}
