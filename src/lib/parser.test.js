import { describe, it, expect } from 'vitest';
import { tokenize, parse, stringify, prettyStringify } from './parser';

describe('IDM Formula Parser', () => {
    it('parses a simple if-equals statement', () => {
        const input = '{{if equals staff.title "Admin" "Yes" "No"}}';
        const ast = parse(tokenize(input));

        expect(ast).toMatchObject({
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
        const input = '{{if greater length name.first 5 "Long" "Short"}}';
        const ast = parse(tokenize(input));

        expect(ast.name).toBe('if');
        // Condition: greater(length(name.first), 5)
        // Note: 5 is parsed as Identifier currently based on tokenization rules
        const condition = ast.arguments[0];
        expect(condition.name).toBe('greater');
        expect(condition.arguments[0].name).toBe('length');
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

describe('AST Range Tracking', () => {
    it('tracks range for simple string literal', () => {
        // Index: 0123456789
        //        {{ "foo" }}
        const input = '{{ "foo" }}';
        const tokens = tokenize(input);
        const ast = parse(tokens);

        // "foo" starts at index 3. Length is 3 + 2 quotes = 5. End is 8.
        expect(ast.range).toEqual([3, 8]);
    });

    it('tracks range for identifiers', () => {
        // Index: 0123456789
        //        {{ bar }}
        const input = '{{ bar }}';
        const tokens = tokenize(input);
        const ast = parse(tokens);

        expect(ast.type).toBe('Identifier');
        // bar start 3. len 3. end 6.
        expect(ast.range).toEqual([3, 6]);
    });

    it('tracks range for function calls', () => {
        // Index: 012345678901234567890123456789
        //        {{ equals a "b" }}
        // equals: start 3.
        // a: Identifier [10, 11]
        // "b": String [12, 15]
        // CallExpression end should be 15.
        const input = '{{ equals a "b" }}';
        const tokens = tokenize(input);
        const ast = parse(tokens);

        expect(ast.type).toBe('CallExpression');
        expect(ast.range).toEqual([3, 15]);
    });

    it('tracks range for nested calls', () => {
        //        012345678901234567890123456789012345
        //        {{ if cond "true" equals a "b" }}
        // if starts 3.
        // cond: 6-10
        // "true": 11-17
        // equals a "b": 18-30 (equals at 18, "b" ends at 30)
        // range should be [3, 30]
        const input = '{{ if cond "true" equals a "b" }}';
        const tokens = tokenize(input);
        const ast = parse(tokens);

        expect(ast.name).toBe('if');
        expect(ast.range).toEqual([3, 30]);

        const elseBranch = ast.arguments[2];
        expect(elseBranch.name).toBe('equals');
        expect(elseBranch.range).toEqual([18, 30]);
    });
});
