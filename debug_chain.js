import { tokenize, parse } from './src/lib/parser.js';

// Inlined from quizUtils.jsx (stripped of JSX)
const evaluateAst = (ast, data) => {
    if (!ast) return "";

    const evalNode = (node) => {
        if (!node) return "";

        if (node.type === 'CallExpression') {
            const args = node.arguments.map(evalNode);
            switch (node.name) {
                case 'if': return args[0] ? args[1] : args[2];
                case 'equals': return args[0] === args[1];
                // Added these from my recent fix
                case 'greater': return Number(args[0]) > Number(args[1]);
                case 'less': return Number(args[0]) < Number(args[1]);
                case 'geq': return Number(args[0]) >= Number(args[1]);
                case 'leq': return Number(args[0]) <= Number(args[1]);

                // ... other cases relevant to the test ...
                // Logic
                case 'and': return args[0] && args[1];
                case 'or': return args[0] || args[1];
                case 'not': return !args[0];

                default: return "";
            }
        }

        if (node.type === 'Identifier') {
            return node.value.split('.').reduce((obj, key) => obj?.[key], data) ?? "";
        }

        if (node.type === 'StringLiteral') {
            return node.value;
        }

        if (Array.isArray(node)) {
            return node.map(evalNode).join('');
        }

        return "";
    };

    if (Array.isArray(ast)) {
        return ast.map(evalNode).join('');
    }
    return evalNode(ast);
};

const formula = `{{if equals role "Admin" "Full Access"
if equals role "Editor" "Edit Access"
"View Only" }}`;

const data = { role: "Admin" };

console.log("Tokenizing...");
try {
    const tokens = tokenize(formula);
    console.log("Tokens found:", tokens.length);

    console.log("Parsing...");
    const ast = parse(tokens);
    console.log("AST type:", ast.type);
    if (ast.type === 'CallExpression') {
        console.log("Function:", ast.name);
        console.log("Args:", ast.arguments.length);
    }

    console.log("Evaluating...");
    const result = evaluateAst(ast, data);
    console.log("RESULT:", result);
} catch (e) {
    console.error("ERROR:", e.message);
    if (e.stack) console.error(e.stack);
}
