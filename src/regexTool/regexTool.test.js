import { RegexTool } from './regexTool.js';

describe('RegexTool', () => {
    describe('alphaLower', () => {
        test('should match lowercase alphanumeric and reject others', () => {
            expect(RegexTool.alphaLower.test('abc123')).toBe(true);
            expect(RegexTool.alphaLower.test('ABC')).toBe(false);
            expect(RegexTool.alphaLower.test('abc-123')).toBe(false);
        });
    });

    describe('alphaLowerEnforce', () => {
        test('should match non-lowercase alphanumeric characters', () => {
            expect(RegexTool.alphaLowerEnforce.test('ABC')).toBe(true);
            expect(RegexTool.alphaLowerEnforce.test('-')).toBe(true);
            expect(RegexTool.alphaLowerEnforce.test('!')).toBe(true);
        });

        test('should not match lowercase alphanumeric strings', () => {
            expect(RegexTool.alphaLowerEnforce.test('abc123')).toBe(false);
        });
    });

    describe('alphaLowerCommas', () => {
        test('should match lowercase alphanumeric strings with commas', () => {
            expect(RegexTool.alphaLowerCommas.test('abc,def,123')).toBe(true);
            expect(RegexTool.alphaLowerCommas.test('test')).toBe(true);
        });

        test('should not match uppercase or special characters except commas', () => {
            expect(RegexTool.alphaLowerCommas.test('ABC')).toBe(false);
            expect(RegexTool.alphaLowerCommas.test('test-123')).toBe(false);
        });
    });

    describe('alphaLowerCommasEnforce', () => {
        test('should match characters not allowed in alphaLowerCommas', () => {
            expect(RegexTool.alphaLowerCommasEnforce.test('ABC')).toBe(true);
            expect(RegexTool.alphaLowerCommasEnforce.test('-')).toBe(true);
        });

        test('should not match lowercase alphanumeric with commas', () => {
            expect(RegexTool.alphaLowerCommasEnforce.test('abc,123')).toBe(false);
        });
    });

    describe('email', () => {
        test('should match valid email addresses', () => {
            expect(RegexTool.email.test('test@example.com')).toBe(true);
            expect(RegexTool.email.test('user.name@domain.org')).toBe(true);
            expect(RegexTool.email.test('user+tag@example.co.uk')).toBe(true);
        });

        test('should not match invalid email addresses', () => {
            expect(RegexTool.email.test('invalid')).toBe(false);
            expect(RegexTool.email.test('invalid@')).toBe(false);
            expect(RegexTool.email.test('@domain.com')).toBe(false);
        });
    });

    describe('float', () => {
        test('should match valid float numbers and reject invalid', () => {
            expect(RegexTool.float.test('123.45')).toBe(true);
            expect(RegexTool.float.test('-123.45')).toBe(true);
            expect(RegexTool.float.test('.45')).toBe(true);
            expect(RegexTool.float.test('abc')).toBe(false);
            expect(RegexTool.float.test('12.34.56')).toBe(false);
        });
    });

    describe('hourFormat', () => {
        test('should match valid hour formats', () => {
            expect(RegexTool.hourFormat.test('00:00')).toBe(true);
            expect(RegexTool.hourFormat.test('12:30')).toBe(true);
            expect(RegexTool.hourFormat.test('23:59')).toBe(true);
            expect(RegexTool.hourFormat.test('9:30')).toBe(true);
        });

        test('should not match invalid hour formats', () => {
            expect(RegexTool.hourFormat.test('12:60')).toBe(false);
            expect(RegexTool.hourFormat.test('abc')).toBe(false);
        });
    });

    describe('machineName', () => {
        test('should match valid machine names', () => {
            expect(RegexTool.machineName.test('my_variable')).toBe(true);
            expect(RegexTool.machineName.test('test123')).toBe(true);
            expect(RegexTool.machineName.test('a_b_c')).toBe(true);
        });

        test('should not match invalid machine names', () => {
            expect(RegexTool.machineName.test('my-variable')).toBe(false);
            expect(RegexTool.machineName.test('MyVariable')).toBe(false);
            expect(RegexTool.machineName.test('test 123')).toBe(false);
        });
    });

    describe('machineNameEnforce', () => {
        test('should find characters not allowed in machine names', () => {
            // machineNameEnforce is global and finds invalid chars
            expect('my-variable'.match(RegexTool.machineNameEnforce)).toEqual(['-']);
            expect('My Variable'.match(RegexTool.machineNameEnforce)).toEqual(['M', ' ', 'V']);
        });

        test('should not match valid machine name characters', () => {
            expect(RegexTool.machineNameEnforce.test('abc_123')).toBe(false);
        });
    });

    describe('numeric', () => {
        test('should match numeric strings and reject non-numeric', () => {
            expect(RegexTool.numeric.test('123')).toBe(true);
            expect(RegexTool.numeric.test('0')).toBe(true);
            expect(RegexTool.numeric.test('12.34')).toBe(false);
            expect(RegexTool.numeric.test('abc')).toBe(false);
        });
    });

    describe('numericEnforce', () => {
        test('should find non-numeric characters in strings', () => {
            // numericEnforce is global and finds sequences of non-numeric chars (except -)
            expect('12.34'.match(RegexTool.numericEnforce)).toEqual(['.']);
            expect('1a2b3'.match(RegexTool.numericEnforce)).toEqual(['a', 'b']);
        });

        test('should not match numeric characters and minus', () => {
            expect(RegexTool.numericEnforce.test('123')).toBe(false);
            expect(RegexTool.numericEnforce.test('-123')).toBe(false);
        });
    });

    describe('telephone', () => {
        test('should match valid telephone numbers', () => {
            expect(RegexTool.telephone.test('012345678')).toBe(true);
            expect(RegexTool.telephone.test('123456789012')).toBe(true);
        });

        test('should not match invalid telephone numbers', () => {
            expect(RegexTool.telephone.test('+12345678')).toBe(false);
            expect(RegexTool.telephone.test('1234567')).toBe(false);
        });
    });

    describe('telephoneEnforce', () => {
        test('should find characters not allowed in telephone numbers', () => {
            // telephoneEnforce is global and finds sequences of chars that aren't + or digits
            expect('123-456-7890'.match(RegexTool.telephoneEnforce)).toEqual(['-', '-']);
            expect('phone: 123'.match(RegexTool.telephoneEnforce)).toEqual(['phone: ']);
        });

        test('should not match valid telephone characters', () => {
            expect(RegexTool.telephoneEnforce.test('+123')).toBe(false);
        });
    });

    describe('password', () => {
        test('should match valid passwords and reject invalid', () => {
            expect(RegexTool.password.test('Password1!')).toBe(true);
            expect(RegexTool.password.test('password')).toBe(false); // no uppercase or special
            expect(RegexTool.password.test('Pass1')).toBe(false); // too short
            expect(RegexTool.password.test('Password1')).toBe(false); // no special char
        });
    });

    describe('time', () => {
        test('should match valid time formats', () => {
            expect(RegexTool.time.test('12')).toBe(true);
            expect(RegexTool.time.test('12:30')).toBe(true);
            expect(RegexTool.time.test('12:30:45')).toBe(true);
            expect(RegexTool.time.test('1:05')).toBe(true);
        });

        test('should not match invalid time formats', () => {
            expect(RegexTool.time.test('12:60')).toBe(false);
            expect(RegexTool.time.test('12:30:60')).toBe(false);
            expect(RegexTool.time.test('abc')).toBe(false);
        });
    });

    describe('timeEnforce', () => {
        test('should match characters not allowed in time', () => {
            expect(RegexTool.timeEnforce.test('a')).toBe(true);
            expect(RegexTool.timeEnforce.test('-')).toBe(true);
        });
    });

    describe('url', () => {
        test('should match valid URLs and reject invalid', () => {
            expect(RegexTool.url.test('https://example.com')).toBe(true);
            expect(RegexTool.url.test('https://www.example.com/path')).toBe(true);
            expect(RegexTool.url.test('invalid')).toBe(false);
            expect(RegexTool.url.test('://example.com')).toBe(false);
        });
    });
});
