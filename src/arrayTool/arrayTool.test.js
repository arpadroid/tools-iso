import {
    arrayUnique,
    arrayEmpty,
    arrayToNumbers,
    areArraysEqual,
    sortObjectArrayByKey,
    searchObjectArray,
    paginateArray
} from './arrayTool';

describe('ArrayTool', () => {
    describe('arrayUnique', () => {
        it('should return an array with unique values', () => {
            expect(arrayUnique([1, 2, 3, 2, 4])).toEqual([1, 2, 3, 4]);
            expect(arrayUnique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
            expect(arrayUnique([])).toEqual([]);
        });
    });

    describe('arrayEmpty', () => {
        it('should return true if the array is empty', () => {
            expect(arrayEmpty([])).toBe(true);
            expect(arrayEmpty([1, 2, 3])).toBe(false);
        });

        it('should return false for non-array values', () => {
            expect(arrayEmpty(null)).toBe(false);
            expect(arrayEmpty(undefined)).toBe(false);
            expect(arrayEmpty('string')).toBe(false);
        });
    });

    describe('arrayToNumbers', () => {
        it('should convert each element in the array to a number', () => {
            expect(arrayToNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);
            expect(arrayToNumbers(['4', '5', '6'])).toEqual([4, 5, 6]);
            expect(arrayToNumbers([])).toEqual([]);
        });
    });

    describe('arraysAreEqual', () => {
        it('should return true if the arrays are equal', () => {
            expect(areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        });

        it('should return false if arrays differ in values or length', () => {
            expect(areArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
            expect(areArraysEqual([1, 2], [1, 2, 3])).toBe(false);
        });
    });

    describe('sortObjectArrayByKey', () => {
        it('should sort array of objects by key in ascending order', () => {
            const arr = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
            const sorted = sortObjectArrayByKey(arr, 'name', 'asc');
            expect(sorted).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
        });

        it('should sort array of objects by key in descending order', () => {
            const arr = [{ age: 25 }, { age: 30 }, { age: 20 }];
            const sorted = sortObjectArrayByKey(arr, 'age', 'desc');
            expect(sorted).toEqual([{ age: 30 }, { age: 25 }, { age: 20 }]);
        });

        it('should return original array when key is not provided', () => {
            const arr = [{ name: 'Charlie' }, { name: 'Alice' }];
            const result = sortObjectArrayByKey(arr, null);
            expect(result).toBe(arr);
        });

        it('should handle empty array', () => {
            const sorted = sortObjectArrayByKey([], 'name');
            expect(sorted).toEqual([]);
        });

        it('should handle equal values', () => {
            const arr = [{ name: 'Alice', age: 30 }, { name: 'Alice', age: 25 }];
            const sorted = sortObjectArrayByKey(arr, 'name');
            expect(sorted.length).toBe(2);
        });
    });

    describe('searchObjectArray', () => {
        const items = [
            { name: 'Apple', category: 'Fruit' },
            { name: 'Banana', category: 'Fruit' },
            { name: 'Carrot', category: 'Vegetable' }
        ];

        it('should filter objects matching the query in default field', () => {
            const results = searchObjectArray(items, 'Apple');
            expect(results).toEqual([{ name: 'Apple', category: 'Fruit' }]);
        });

        it('should return copy of array when query is empty', () => {
            const results = searchObjectArray(items, '');
            expect(results).toEqual(items);
            expect(results).not.toBe(items);
        });

        it('should search in multiple fields', () => {
            const results = searchObjectArray(items, 'Fruit', ['name', 'category']);
            expect(results).toEqual([
                { name: 'Apple', category: 'Fruit' },
                { name: 'Banana', category: 'Fruit' }
            ]);
        });

        it('should be case-insensitive', () => {
            const results = searchObjectArray(items, 'APPLE');
            expect(results).toEqual([{ name: 'Apple', category: 'Fruit' }]);
        });

        it('should return empty array when no matches', () => {
            const results = searchObjectArray(items, 'Orange');
            expect(results).toEqual([]);
        });

        it('should handle empty array', () => {
            const results = searchObjectArray([], 'test');
            expect(results).toEqual([]);
        });

        it('should handle missing fields in objects', () => {
            const items = [{ name: 'Apple' }, { title: 'Book' }];
            const results = searchObjectArray(items, 'Apple', ['name']);
            expect(results).toEqual([{ name: 'Apple' }]);
        });

        it('should handle numeric queries', () => {
            const items = [{ name: 'Item', price: 100 }, { name: 'Other', price: 200 }];
            const results = searchObjectArray(items, 100, ['price']);
            expect(results).toEqual([{ name: 'Item', price: 100 }]);
        });

        it('should handle objects with undefined field values', () => {
            const items = [{ name: undefined }, { name: 'Apple' }];
            const results = searchObjectArray(items, 'Apple', ['name']);
            expect(results).toEqual([{ name: 'Apple' }]);
        });
    });

    describe('paginateArray', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        it('should return first page with default settings', () => {
            const page = paginateArray(items);
            expect(page).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });

        it('should paginate with custom perPage', () => {
            const page = paginateArray(items, 3, 1);
            expect(page).toEqual([1, 2, 3]);
        });

        it('should return correct page', () => {
            const page = paginateArray(items, 3, 2);
            expect(page).toEqual([4, 5, 6]);
        });

        it('should return last page with remaining items', () => {
            const page = paginateArray(items, 3, 4);
            expect(page).toEqual([10]);
        });

        it('should return empty array for page beyond bounds', () => {
            const page = paginateArray(items, 3, 10);
            expect(page).toEqual([]);
        });

        it('should handle empty array', () => {
            const page = paginateArray([], 10, 1);
            expect(page).toEqual([]);
        });

        it('should handle perPage larger than array', () => {
            const page = paginateArray(items, 20, 1);
            expect(page).toEqual(items);
        });

        it('should use default values when called without parameters', () => {
            const page = paginateArray();
            expect(page).toEqual([]);
        });
    });
});
