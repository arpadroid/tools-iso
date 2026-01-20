import {
    validateRequired,
    validateMaxLength,
    validateMinLength,
    validateLength,
    validateSize,
    validateRegex,
    validateNumber
} from './validationTool';

describe('Validation Tool', () => {
    describe('validateRequired', () => {
        it('should return true if value is not empty', () => {
            expect(validateRequired('hello')).toBe(true);
        });

        it('should return false if value is empty', () => {
            expect(validateRequired('')).toBe(false);
        });

        it('should return true for boolean true', () => {
            expect(validateRequired(true)).toBe(true);
        });

        it('should return true for boolean false', () => {
            expect(validateRequired(false)).toBe(true);
        });

        it('should return true for non-empty arrays', () => {
            expect(validateRequired([1, 2, 3])).toBe(true);
        });

        it('should return false for empty arrays', () => {
            expect(validateRequired([])).toBe(false);
        });

        it('should return true for non-empty objects', () => {
            expect(validateRequired({ key: 'value' })).toBe(true);
        });

        it('should return false for empty objects', () => {
            expect(validateRequired({})).toBe(false);
        });

        it('should return true for numbers including zero and negative', () => {
            expect(validateRequired(0)).toBe(true);
            expect(validateRequired(-1)).toBe(true);
        });

        it('should return false for NaN, null, and undefined', () => {
            expect(validateRequired(NaN)).toBe(false);
            expect(validateRequired(null)).toBe(false);
            expect(validateRequired(undefined)).toBe(false);
        });
    });

    describe('validateMaxLength', () => {
        it('should return true if value length is less than or equal to maxLength', () => {
            expect(validateMaxLength('hello', 10)).toBe(true);
        });

        it('should return false if value length is greater than maxLength', () => {
            expect(validateMaxLength('hello', 3)).toBe(false);
        });

        it('should work with numbers', () => {
            expect(validateMaxLength(50, 100)).toBe(true);
            expect(validateMaxLength(150, 100)).toBe(false);
        });

        it('should work with arrays', () => {
            expect(validateMaxLength([1, 2, 3], 5)).toBe(true);
            expect(validateMaxLength([1, 2, 3], 2)).toBe(false);
        });

        it('should return undefined for values without length', () => {
            expect(validateMaxLength(null, 10)).toBe(undefined);
            expect(validateMaxLength(undefined, 10)).toBe(undefined);
        });
    });

    describe('validateMinLength', () => {
        it('should return true if value length is greater than or equal to minLength', () => {
            expect(validateMinLength('hello', 3)).toBe(true);
        });

        it('should return false if value length is less than minLength', () => {
            expect(validateMinLength('hello', 10)).toBe(false);
        });

        it('should work with numbers', () => {
            expect(validateMinLength(100, 50)).toBe(true);
            expect(validateMinLength(30, 50)).toBe(false);
        });

        it('should work with arrays', () => {
            expect(validateMinLength([1, 2, 3], 2)).toBe(true);
            expect(validateMinLength([1], 3)).toBe(false);
        });

        it('should return undefined for values without length', () => {
            expect(validateMinLength(null, 10)).toBe(undefined);
        });
    });

    describe('validateLength', () => {
        it('should return true if value length is equal to length', () => {
            expect(validateLength('hello', 5)).toBe(true);
        });

        it('should return false if value length is not equal to length', () => {
            expect(validateLength('hello', 10)).toBe(false);
        });

        it('should work with arrays', () => {
            expect(validateLength([1, 2, 3], 3)).toBe(true);
            expect(validateLength([1, 2], 3)).toBe(false);
        });

        it('should work with numbers (value equals length)', () => {
            expect(validateLength(5, 5)).toBe(true);
            expect(validateLength(5, 10)).toBe(false);
        });

        it('should return undefined for values without length', () => {
            expect(validateLength(null, 5)).toBe(undefined);
        });
    });

    describe('validateSize', () => {
        it('should return true if value size is within the range', () => {
            expect(validateSize([1, 2, 3], [1, 3])).toBe(true);
        });

        it('should return false if value size is not within the range', () => {
            expect(validateSize([1, 2, 3], [4, 6])).toBe(false);
        });

        it('should return true for invalid size array', () => {
            expect(validateSize('test', [NaN, NaN])).toBe(true);
            expect(validateSize('test', [])).toBe(true);
        });

        it('should work with string length', () => {
            expect(validateSize('hello', [3, 10])).toBe(true);
            expect(validateSize('hi', [3, 10])).toBe(false);
        });

        it('should work with number values', () => {
            expect(validateSize(50, [0, 100])).toBe(true);
            expect(validateSize(150, [0, 100])).toBe(false);
        });
    });

    describe('validateRegex', () => {
        it('should return true if value matches the regular expression', () => {
            expect(validateRegex('hello', /^h.*o$/)).toBe(true);
        });

        it('should return false if value does not match the regular expression', () => {
            expect(validateRegex('hello', /^a.*z$/)).toBe(false);
        });

        it('should work with preset string from RegexTool', () => {
            expect(validateRegex('test@example.com', 'email')).toBe(true);
            expect(validateRegex('invalid', 'email')).toBe(false);
        });

        it('should handle number values', () => {
            expect(validateRegex(123, /^\d+$/)).toBe(true);
        });
    });

    describe('number', () => {
        it('should return true if value is a number', () => {
            expect(validateNumber(42)).toBe(true);
        });

        it('should return false if value is not a number', () => {
            expect(validateNumber('hello')).toBe(false);
        });

        it('should return true for numeric strings', () => {
            expect(validateNumber('42')).toBe(true);
            expect(validateNumber('3.14')).toBe(true);
        });

        it('should return true for zero, negative, and float numbers', () => {
            expect(validateNumber(0)).toBe(true);
            expect(validateNumber(-10)).toBe(true);
            expect(validateNumber(3.14159)).toBe(true);
        });
    });
});
