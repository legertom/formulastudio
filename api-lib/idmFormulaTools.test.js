import { describe, it, expect } from 'vitest';
import { lintFormula, validateFormula, formatFormula } from './idmFormulaTools.js';

describe('idmFormulaTools', () => {
    it('formats and canonicalizes aliases', () => {
        const formatted = formatFormula('{{if equal school_name "A" "Group A" "uncategorized"}}', {
            pretty: false,
            canonicalize: true
        });
        expect(formatted).toContain('equals');
        expect(formatted).not.toContain('equal school_name');
    });

    it('validates unencoded foreach arg3 as error', () => {
        const result = validateFormula('{{forEach "s" schools "{{s.name}}"}}');
        expect(result.valid).toBe(false);
        expect(result.errors.join(' ')).toMatch(/unencoded|URL-encoded/i);
    });

    it('lints unreachable duplicate branch in if chain', () => {
        const formula = '{{if equals school_name "A" "G1" if equals school_name "A" "G2" "Other"}}';
        const result = lintFormula(formula);
        expect(result.valid).toBe(true);
        expect(result.findings.some((f) => f.ruleId === 'L003')).toBe(true);
    });

    it('lints broader-before-specific branch pattern', () => {
        const formula = '{{if equals school_name "A" "G1" if and equals school_name "A" equals student.grade "09" "G2" "Other"}}';
        const result = lintFormula(formula);
        expect(result.findings.some((f) => f.ruleId === 'L004')).toBe(true);
    });
});
