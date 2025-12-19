import { describe, it, expect } from 'vitest';
import { tokenize, parse, stringify, prettyStringify } from './parser';

describe('IDM Formula Parser', () => {
    it('parses a simple if-equals statement', () => {
        const input = '{{if equals staff.title "Admin" "Yes" "No"}}';
        const ast = parse(tokenize(input));

        expect(ast).toEqual({
            type: 'CallExpression',
            name: 'if',
            arguments: [
                {
                    type: 'CallExpression',
                    name: 'equals',
                    arguments: [
                        { type: 'Identifier', value: 'staff.title' },
                        { type: 'StringLiteral', value: 'Admin' }
                    ]
                },
                { type: 'StringLiteral', value: 'Yes' },
                { type: 'StringLiteral', value: 'No' }
            ]
        });
    });

    it('parses nested if statements', () => {
        const input = '{{if equals a "b" "c" if equals d "e" "f" "g"}}';
        const ast = parse(tokenize(input));

        // Check structure of the "else" branch
        const elseBranch = ast.arguments[2];
        expect(elseBranch.type).toBe('CallExpression');
        expect(elseBranch.name).toBe('if');
    });

    it('parses logical operators (AND/OR)', () => {
        const input = '{{if or equals a "b" equals c "d" "True" "False"}}';
        const ast = parse(tokenize(input));

        // or(equals(a,b), equals(c,d))
        const condition = ast.arguments[0];
        expect(condition.name).toBe('or');
        expect(condition.arguments).toHaveLength(2);
        expect(condition.arguments[0].name).toBe('equals');
    });

    it('parses empty braces', () => {
        const ast = parse(tokenize('{{}}'));
        expect(ast).toBeNull();
    });

    it('throws on unknown tokens', () => {
        expect(() => tokenize('{{if # equals}}')).toThrow();
    });

    it('parses ignoreIfNull correctly', () => {
        const input = '{{if ignoreIfNull name.middle ignoreIfNull name.middle "No Middle Name"}}';
        const ast = parse(tokenize(input));

        expect(ast.name).toBe('if');
        expect(ast.arguments[0].name).toBe('ignoreIfNull');
        expect(ast.arguments[1].name).toBe('ignoreIfNull');
        expect(ast.arguments[2].value).toBe('No Middle Name');
    });

    it('parses other new functions (not, greater, concat, etc)', () => {
        const input = '{{if greater len name.first 5 "Long" "Short"}}';
        const ast = parse(tokenize(input));

        expect(ast.name).toBe('if');
        // Condition: greater(len(name.first), 5)
        // Note: 5 is parsed as Identifier currently based on tokenization rules
        const condition = ast.arguments[0];
        expect(condition.name).toBe('greater');
        expect(condition.arguments[0].name).toBe('len');
    });
});

describe('IDM Formula Stringifier', () => {
    it('stringifies simple expressions', () => {
        const ast = {
            type: 'CallExpression',
            name: 'equals',
            arguments: [
                { type: 'Identifier', value: 'staff.title' },
                { type: 'StringLiteral', value: 'Admin' }
            ]
        };
        // Expected: equals staff.title "Admin"
        expect(stringify(ast)).toBe('equals staff.title "Admin"');
    });

    it('stringifies nested expressions', () => {
        const ast = {
            type: 'CallExpression', // if
            name: 'if',
            arguments: [
                { type: 'Identifier', value: 'cond' },
                { type: 'StringLiteral', value: 'true' },
                { type: 'StringLiteral', value: 'false' }
            ]
        };
        expect(stringify(ast)).toBe('if cond "true" "false"');
    });
});

describe('IDM Formula Pretty Printer', () => {
    it('formats nested expressions with indentation', () => {
        const input = 'if equals a "b" "true" "false"';
        // Parse it first to get AST
        const tokens = tokenize(`{{${input}}}`);
        const ast = parse(tokens);

        const formatted = prettyStringify(ast);

        // precise indentation matching might be tricky, let's verify structure
        // The implementation forces newlines for if/nested.
        // if equals a "b" "true" "false" => 
        // if
        //   equals a "b"
        //   "true"
        //   "false"

        expect(formatted).toContain('\n  equals a "b"');
        expect(formatted).toContain('\n  "true"');
        expect(formatted).toContain('\n  "false"');
    });

    it('formats deeply nested expressions', () => {
        const input = 'if equals a "b" if equals c "d" "e" "f" "g"';
        const tokens = tokenize(`{{${input}}}`);
        const ast = parse(tokens);
        const formatted = prettyStringify(ast);

        // Should have 2 levels of indentation
        expect(formatted).toContain('\n    equals c "d"');
        expect(formatted).toContain('\n    "e"');
    });
});
