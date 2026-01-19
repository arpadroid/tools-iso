/* eslint-disable id-length */
import { isObject, mergeObjects, countProps } from './objectTool.js';
describe('Object Tool', () => {
    describe('isObject', () => {
        test('should return true for an object', () => {
            expect(isObject({})).toBe(true);
        });

        test('should return false for an array', () => {
            expect(isObject([])).toBe(false);
        });

        test('should return false for null', () => {
            expect(isObject(null)).toBe(false);
        });
    });

    describe('mergeObjects', () => {
        test('should merge two objects recursively', () => {
            const obj1 = { a: 1, string: 'string', b: { c: 2, d: ['a'] } };
            const obj2 = { b: { e: 3, c: 1, d: ['b'] }, string: 'stringUpdated' };
            const merged = mergeObjects(obj1, obj2);
            expect(merged).toEqual({ a: 1, b: { e: 3, c: 1, d: ['b'] }, string: 'stringUpdated' });
        });

        test('should filter out properties not in the original object in strict mode', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            const merged = mergeObjects(obj1, obj2, true);
            expect(merged).toEqual({ a: 1, b: 3 });
        });
    });

    describe('countProps', () => {
        test('should return the number of properties in an object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            expect(countProps(obj)).toBe(3);
        });

        test('should return 0 for an empty object', () => {
            expect(countProps({})).toBe(0);
        });
    });
});
