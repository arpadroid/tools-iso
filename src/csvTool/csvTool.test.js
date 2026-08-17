import { encodeValueCommas, decodeValueCommas, csvToJson } from './csvTool.js';
import { describe, it, expect } from '@jest/globals';

describe('CsvTool', () => {
    describe('encodeValueCommas', () => {
        it.each([
            ['John,Doe,"Hello, World",42', 'John,Doe,"Hello[valueComma] World",42'],
            ['John,Doe,Hello, World, 42', 'John,Doe,Hello, World, 42'],
            ['"first, value","second, value"', '"first[valueComma] value","second[valueComma] value"']
        ])('should encode %s to %s', (text, expected) => {
            expect(encodeValueCommas(text)).toBe(expected);
        });
    });

    describe('decodeValueCommas', () => {
        it.each([
            ['John,Doe,"Hello[valueComma] World",42', 'John,Doe,"Hello, World",42'],
            ['John,Doe,Hello, World,42', 'John,Doe,Hello, World,42'],
            ['a[valueComma]b[valueComma]c', 'a,b,c']
        ])('should decode %s to %s', (text, expected) => {
            expect(decodeValueCommas(text)).toBe(expected);
        });
    });

    describe('csvToJson', () => {
        it('should convert a CSV string to JSON object array', () => {
            const csv = 'name,age\nJohn,42\nJane,35';
            const json = csvToJson(csv);
            expect(json).toEqual([
                { name: 'John', age: '42' },
                { name: 'Jane', age: '35' }
            ]);
        });

        it('should convert a CSV string to JSON object array with key mapping', () => {
            const csv = 'name,age\nJohn,42\nJane,35';
            const map = { name: 'firstName', age: 'years' };
            const json = csvToJson(csv, map);
            expect(json).toEqual([
                { firstName: 'John', years: '42' },
                { firstName: 'Jane', years: '35' }
            ]);
        });

        it('should handle values with embedded quotes', () => {
            const csv = 'name,quote\nJohn,"Hello, World"';
            const json = csvToJson(csv);
            expect(json).toEqual([{ name: 'John', quote: 'Hello, World' }]);
        });

        it('should handle empty CSV with only headers', () => {
            const csv = 'name,age';
            const json = csvToJson(csv);
            expect(json).toEqual([]);
        });

        it('should handle values without surrounding quotes', () => {
            const csv = 'name,value\nJohn,unquoted';
            const json = csvToJson(csv);
            expect(json).toEqual([{ name: 'John', value: 'unquoted' }]);
        });

        it('should handle non-string map values (ignore them)', () => {
            const csv = 'name,age\nJohn,42';
            const map = { name: 123, age: 'years' };
            const json = csvToJson(csv, map);
            expect(json).toEqual([{ name: 'John', years: '42' }]);
        });

        it('should handle CSV with multiple lines and commas in values', () => {
            const csv = 'name,address\nJohn,"123 Main St, City"\nJane,"456 Oak Ave, Town"';
            const json = csvToJson(csv);
            expect(json).toEqual([
                { name: 'John', address: '123 Main St, City' },
                { name: 'Jane', address: '456 Oak Ave, Town' }
            ]);
        });
    });
});
