import { describe, it, expect } from 'vitest';
import { evaluateAndTrace } from './interpreter';
import { parse, tokenize } from './parser';

const evalExpr = (expr, data = {}) => {
    const tokens = tokenize(expr);
    const ast = parse(tokens);
    const { result } = evaluateAndTrace(ast, data);
    return result;
};

describe('Interpreter - New Functions', () => {
    describe('Chapter 9 Functions', () => {
        it('should handle textBefore', () => {
            expect(evalExpr('textBefore "user@example.com" "@"')).toBe('user');
            expect(evalExpr('textBefore "hello" "@"')).toBe('hello');
        });

        it('should handle textAfter', () => {
            expect(evalExpr('textAfter "user@example.com" "@"')).toBe('example.com');
            expect(evalExpr('textAfter "hello" "@"')).toBe('');
        });

        it('should handle textAfterLast', () => {
            expect(evalExpr('textAfterLast "report.final.v2.pdf" "."')).toBe('pdf');
            expect(evalExpr('textAfterLast "style.css" "."')).toBe('css');
        });

        it('should handle trimLeft', () => {
            // "   hello" -> "hello"
            expect(evalExpr('trimLeft "   hello"')).toBe('hello');
            // "hello   " -> "hello   "
            expect(evalExpr('trimLeft "hello   "')).toBe('hello   ');
        });

        it('should handle in', () => {
            // "Active" in "Status: Active" -> true
            expect(evalExpr('in "Active" "Status: Active"')).toBe(true);
            expect(evalExpr('in "Pending" "Status: Active"')).toBe(false);
        });
    });

    describe('Chapter 10 Functions', () => {
        it('should handle delimiterCapitalize', () => {
            expect(evalExpr('delimiterCapitalize "mary-anne"')).toBe('Mary-Anne');
            expect(evalExpr('delimiterCapitalize "john doe"')).toBe('John Doe');
            expect(evalExpr('delimiterCapitalize "alice"')).toBe('Alice');
        });

        it('should handle alphanumeric', () => {
            expect(evalExpr('alphanumeric "User123"')).toBe(true);
            expect(evalExpr('alphanumeric "User-123"')).toBe(false);
            expect(evalExpr('alphanumeric "123"')).toBe(true);
            expect(evalExpr('alphanumeric ""')).toBe(false);
        });

        it('should handle subtract', () => {
            expect(evalExpr('subtract 10 4')).toBe(6);
        });

        it('should handle formatDate', () => {
            // Basic check - exact format depends on implementation details
            expect(evalExpr('formatDate "2023-01-01" "MMM DD, YYYY"')).toBe('Jan 01, 2023');
        });
    });
});
