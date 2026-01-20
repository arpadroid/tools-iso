import {
    dashedToCamel,
    camelToDashed,
    ucFirst,
    lcFirst,
    truncate,
    getSafeID,
    parseOutlookEmails,
    mechanize,
    removeWhiteSpace,
    removeSlashes,
    extractCurrency,
    sanitizeSearchInput,
    getInitials,
    timeStringToSeconds,
    getStringBetween,
    escapeHtml
} from './stringTool';

describe('dashedToCamel', () => {
    describe('dashedToCamel', () => {
        test('converts a dashed string to camel case', () => {
            expect(dashedToCamel('hello-world')).toBe('helloWorld');
            expect(dashedToCamel('foo-bar-baz')).toBe('fooBarBaz');
        });

        test('handles single word', () => {
            expect(dashedToCamel('hello')).toBe('hello');
        });
    });

    describe('camelToDashed', () => {
        test('converts a camel case string to dashed', () => {
            expect(camelToDashed('helloWorld')).toBe('hello-world');
            expect(camelToDashed('fooBarBaz')).toBe('foo-bar-baz');
        });

        test('handles lowercase string', () => {
            expect(camelToDashed('hello')).toBe('hello');
        });

        test('handles multiple uppercase letters', () => {
            expect(camelToDashed('myURLParser')).toBe('my-u-r-l-parser');
        });
    });

    describe('ucFirst', () => {
        test('converts the first character of a string to uppercase', () => {
            expect(ucFirst('hello')).toBe('Hello');
        });
    });

    describe('lcFirst', () => {
        test('converts the first character of a string to lowercase', () => {
            expect(lcFirst('Hello')).toBe('hello');
        });
    });

    describe('truncate', () => {
        test('truncates a string to a specified length', () => {
            expect(truncate('Lorem ipsum dolor sit amets', 10)).toBe('Lorem ipsu ...');
            expect(truncate('Hello, gang!', 5)).toBe('Hello ...');
        });

        test('returns original string if shorter than length', () => {
            expect(truncate('Hi', 10)).toBe('Hi');
            expect(truncate('Hello', 5)).toBe('Hello');
        });
    });

    describe('getSafeID', () => {
        test('removes unsafe characters from a string to create a safe ID', () => {
            expect(getSafeID('Hello, droid!')).toBe('hellodroid');
            expect(getSafeID('Some text')).toBe('sometext');
        });

        test('removes percent-encoded characters', () => {
            expect(getSafeID('test%20value')).toBe('testvalue');
        });
    });

    describe('parseOutlookEmails', () => {
        test('parses email addresses from a string', () => {
            expect(parseOutlookEmails('john@example.com; mary@example.com')).toEqual([
                'john@example.com',
                'mary@example.com'
            ]);
            expect(parseOutlookEmails('No emails found')).toEqual([]);
        });

        test('parses Outlook-style emails with angle brackets', () => {
            expect(parseOutlookEmails('John Doe <john@example.com>')).toEqual(['john@example.com']);
            expect(
                parseOutlookEmails('John <john@example.com>; Mary <mary@example.com>')
            ).toEqual(['john@example.com', 'mary@example.com']);
        });

        test('handles comma-separated emails', () => {
            expect(parseOutlookEmails('john@example.com, mary@example.com')).toEqual([
                'john@example.com',
                'mary@example.com'
            ]);
        });
    });

    describe('mechanize', () => {
        test('converts a string to a URL-friendly format', () => {
            expect(mechanize('Hello world!')).toBe('hello-world');
            expect(mechanize('Lorem ipsum dolor sit amet')).toBe('lorem-ipsum-dolor-sit-amet');
        });

        test('handles empty string', () => {
            expect(mechanize('')).toBe('');
        });

        test('uses custom separator', () => {
            expect(mechanize('Custom test!', '_')).toBe('custom_test');
        });

        test('returns memoized result for same input', () => {
            const input = 'memoization test';
            const first = mechanize(input);
            const second = mechanize(input);
            expect(first).toBe(second);
        });

        test('returns cached result on subsequent calls with same key', () => {
            // Use a unique string to ensure fresh cache entry
            const uniqueInput = 'unique cache test string';
            const firstResult = mechanize(uniqueInput);
            // Second call should hit the cache (line 98)
            const secondResult = mechanize(uniqueInput);
            expect(firstResult).toBe(secondResult);
            expect(secondResult).toBe('unique-cache-test-string');
        });
    });

    describe('removeWhiteSpace', () => {
        test('removes white spaces from a string', () => {
            expect(removeWhiteSpace('Hello, world!')).toBe('Hello,world!');
            expect(removeWhiteSpace('Lorem ipsum dolor sit amet')).toBe('Loremipsumdolorsitamet');
        });
    });

    describe('removeSlashes', () => {
        test('removes leading and trailing slashes', () => {
            expect(removeSlashes('/path/to/file/')).toBe('path/to/file');
            expect(removeSlashes('//path//')).toBe('path');
        });

        test('handles string without slashes', () => {
            expect(removeSlashes('path')).toBe('path');
        });
    });

    describe('extractCurrency', () => {
        test('extracts the currency symbol from a string', () => {
            expect(extractCurrency('Price: $10')).toBe('$');
            expect(extractCurrency('Total: €20')).toBe('€');
            expect(extractCurrency('No currency symbol')).toBeNull();
        });

        test('extracts pound symbol', () => {
            expect(extractCurrency('Cost: £50')).toBe('£');
        });
    });

    describe('sanitizeSearchInput', () => {
        test('sanitizes a search input by removing special characters and limiting the length', () => {
            expect(sanitizeSearchInput('Hello, world!')).toBe('Hello world');
        });

        test('limits length to 50 characters', () => {
            const longString = 'a'.repeat(100);
            expect(sanitizeSearchInput(longString).length).toBe(50);
        });
    });

    describe('getInitials', () => {
        test('retrieves the initials from a string', () => {
            expect(getInitials('John Doe')).toBe('JD');
            expect(getInitials('Jane Smith')).toBe('JS');
        });

        test('handles single name', () => {
            expect(getInitials('John')).toBe('J');
        });

        test('handles multiple names', () => {
            expect(getInitials('John Michael Doe')).toBe('JMD');
        });
    });

    describe('timeStringToSeconds', () => {
        test('converts hours:minutes:seconds to seconds', () => {
            expect(timeStringToSeconds('01:30:00')).toBe(5400);
            expect(timeStringToSeconds('00:01:30')).toBe(90);
        });

        test('handles minutes:seconds format', () => {
            // 05:30 with multipliers [3600, 60, 1] = 5*3600 + 30*60 = 19800
            expect(timeStringToSeconds('05:30')).toBe(19800);
        });

        test('handles just seconds', () => {
            // 45 with multiplier 3600 = 162000
            expect(timeStringToSeconds('45')).toBe(162000);
        });
    });

    describe('getStringBetween', () => {
        test('extracts string between two markers', () => {
            expect(getStringBetween('Hello [world] there', '[', ']')).toBe('world');
            expect(getStringBetween('<tag>content</tag>', '<tag>', '</tag>')).toBe('content');
        });

        test('returns null when start marker not found', () => {
            expect(getStringBetween('Hello world', '[', ']')).toBeNull();
        });

        test('returns null when end marker not found', () => {
            expect(getStringBetween('Hello [world', '[', ']')).toBeNull();
        });

        test('handles empty content between markers', () => {
            expect(getStringBetween('[]', '[', ']')).toBe('');
        });
    });

    describe('escapeHtml', () => {
        test('escapes individual special characters', () => {
            expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
            expect(escapeHtml('a < b')).toBe('a &lt; b');
            expect(escapeHtml("it's")).toBe('it&#039;s');
        });

        test('escapes all special characters in complex string', () => {
            expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
                '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
            );
        });
    });
});
