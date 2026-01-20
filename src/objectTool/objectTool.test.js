/* eslint-disable id-length */
import {
    isObject,
    mergeObjects,
    countProps,
    isEmptyObject,
    copyObjectProps,
    bind,
    sortKeys
} from './objectTool.js';

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

        test('should return false for undefined', () => {
            expect(isObject(undefined)).toBe(false);
        });

        test('should return false for primitive types', () => {
            expect(isObject('string')).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject(true)).toBe(false);
        });

        test('should return false for Date', () => {
            expect(isObject(new Date())).toBe(false);
        });

        test('should return false for Map and Set', () => {
            expect(isObject(new Map())).toBe(false);
            expect(isObject(new Set())).toBe(false);
        });
    });

    describe('isEmptyObject', () => {
        test('should return true for an empty object', () => {
            expect(isEmptyObject({})).toBe(true);
        });

        test('should return false for non-empty object', () => {
            expect(isEmptyObject({ a: 1 })).toBe(false);
        });

        test('should return false for non-objects', () => {
            expect(isEmptyObject([])).toBe(false);
            expect(isEmptyObject(null)).toBe(false);
            expect(isEmptyObject('string')).toBe(false);
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

        test('should return first object when second is empty', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = {};
            const merged = mergeObjects(obj1, obj2);
            expect(merged).toEqual({ a: 1, b: 2 });
        });

        test('should handle default empty objects', () => {
            const merged = mergeObjects();
            expect(merged).toEqual({});
        });

        test('should merge nested objects in strict mode', () => {
            const obj1 = { a: { b: 1, c: 2 } };
            const obj2 = { a: { b: 3, d: 4 } };
            const merged = mergeObjects(obj1, obj2, true);
            expect(merged).toEqual({ a: { b: 3, c: 2 } });
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

    describe('copyObjectProps', () => {
        test('should shallow copy objects with primitives, arrays, and nested objects', () => {
            const obj = { a: 1, str: 'hello', arr: [1, 2, 3], nested: { b: 2 } };
            const copy = copyObjectProps(obj);
            expect(copy).toEqual(obj);
            expect(copy).not.toBe(obj);
            expect(copy.arr).not.toBe(obj.arr);
            expect(copy.nested).not.toBe(obj.nested);
        });
    });

    describe('bind', () => {
        test('should bind methods to an object', () => {
            const obj = {
                value: 42,
                getValue() {
                    return this.value;
                }
            };
            bind(obj, 'getValue');
            const getValue = obj.getValue;
            expect(getValue()).toBe(42);
        });

        test('should bind multiple methods', () => {
            const obj = {
                value: 10,
                getValue() {
                    return this.value;
                },
                doubleValue() {
                    return this.value * 2;
                }
            };
            bind(obj, 'getValue', 'doubleValue');
            const { getValue, doubleValue } = obj;
            expect(getValue()).toBe(10);
            expect(doubleValue()).toBe(20);
        });

        test('should log error for non-function methods', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const obj = { notAFunction: 'string' };
            bind(obj, 'notAFunction');
            expect(consoleSpy).toHaveBeenCalledWith(
                'Method notAFunction is not a function in',
                obj
            );
            consoleSpy.mockRestore();
        });
    });

    describe('sortKeys', () => {
        test('should sort object keys alphabetically', () => {
            const obj = { c: 3, a: 1, b: 2 };
            const sorted = sortKeys(obj);
            expect(Object.keys(sorted)).toEqual(['a', 'b', 'c']);
        });

        test('should preserve values when sorting', () => {
            const obj = { z: 'last', a: 'first', m: 'middle' };
            const sorted = sortKeys(obj);
            expect(sorted).toEqual({ a: 'first', m: 'middle', z: 'last' });
        });

        test('should handle empty object', () => {
            const sorted = sortKeys({});
            expect(sorted).toEqual({});
        });
    });
});
