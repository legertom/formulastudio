import { tokenize, parse, stringify } from './src/lib/parser.js';

const formulas = [
    '{{ if equals role "Manager" "Approved" "Pending" }}',
    '{{ and equals role "Admin" equals status "Active" }}',
    '{{ if and equals role "Admin" equals status "Active" "Access Granted" "Locked" }}',
    '{{ or equals type "VIP" equals type "Member" }}',
    '{{ and one and two three }}',
    '{{ and greater length pass 8 contains pass "#" }}'
];

formulas.forEach(f => {
    try {
        const tokens = tokenize(f);
        const ast = parse(tokens);
        console.log(`PASS: ${f}`);
    } catch (e) {
        console.error(`FAIL: ${f}`);
        console.error(e.message);
    }
});
