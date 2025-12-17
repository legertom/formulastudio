import { describe, it, expect } from 'vitest';
import { tokenize, parse, stringify } from './parser';

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

    it('throws on unknown tokens', () => {
        expect(() => tokenize('{{if # equals}}')).toThrow();
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
