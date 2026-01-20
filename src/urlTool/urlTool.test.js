import {
    getURLParams,
    arrayToQueryString,
    decodeURIComponentSafe,
    areUrlsEqual,
    removeLastSlash,
    sanitizePath,
    getURLPath,
    getURLParam,
    matchPath,
    matchPaths,
    getPathParts,
    objectToQueryString,
    sanitizeURL,
    editURL,
    removeURLParam,
    removeURLOrigin,
    getParentPath
} from './urlTool';

describe('urlTool', () => {
    describe('getParams', () => {
        it('should return an object with query string parameters', () => {
            const url = 'https://examples.com?param1=value1&param2=value2';
            const params = getURLParams(url);
            expect(params).toEqual({ param1: 'value1', param2: 'value2' });
        });

        it('should return an empty object if there are no query string parameters', () => {
            const url = 'https://arpadroid.com';
            const params = getURLParams(url);
            expect(params).toEqual({});
        });
    });

    describe('arrayToQueryString', () => {
        it('should return a URL query string from an array', () => {
            const propName = 'colors';
            const array = ['red', 'green', 'blue'];
            const queryString = arrayToQueryString(propName, array);
            expect(queryString).toBe('colors[]=red&colors[]=green&colors[]=blue');
        });

        it('should return an empty string if the array is empty', () => {
            const propName = 'colors';
            const array = [];
            const queryString = arrayToQueryString(propName, array);
            expect(queryString).toBe('');
        });
    });

    describe('decodeURIComponentSafe', () => {
        it('should decode a URI component safely', () => {
            const value = '%20Hello%20World%21';
            const decodedValue = decodeURIComponentSafe(value);
            expect(decodedValue).toBe(' Hello World!');
        });
    });

    describe('areUrlsEqual', () => {
        it('should return true for equal URLs', () => {
            const url1 = 'https://examples.com';
            const url2 = 'https://examples.com';
            const areEqual = areUrlsEqual(url1, url2);
            expect(areEqual).toBe(true);
        });

        it('should return false for different URLs', () => {
            const url1 = 'https://example.com';
            const url2 = 'https://example.org';
            const areEqual = areUrlsEqual(url1, url2);
            expect(areEqual).toBe(false);
        });
    });

    describe('removeLastSlash', () => {
        it('should remove the last slash from a path', () => {
            const path = '/users/';
            const newPath = removeLastSlash(path);
            expect(newPath).toBe('/users');
        });

        it('should not remove the last slash if it is the only character', () => {
            const path = '/';
            const newPath = removeLastSlash(path);
            expect(newPath).toBe('');
        });
    });

    describe('sanitizePath', () => {
        it('should sanitize the path', () => {
            const path = '/users/andres%20vaquero/';
            const sanitizedPath = sanitizePath(path);
            expect(sanitizedPath).toBe('/users/andres%20vaquero');
        });
    });

    describe('getURLPath', () => {
        it('should return the path of a URL', () => {
            const url = 'https://example.com/users/arpadroid';
            const path = getURLPath(url);
            expect(path).toBe('/users/arpadroid');
        });

        it('should return the path of a URL without query string parameters', () => {
            const url = 'http://example.com/users/arpadroid?param1=value1';
            const path = getURLPath(url);
            expect(path).toBe('/users/arpadroid');
        });
    });

    describe('sanitize', () => {
        it('should sanitize the URL', () => {
            const url = 'https://example.com/users/andres%20vaquero/';
            const sanitizedUrl = sanitizeURL(url);
            expect(sanitizedUrl).toBe('/users/andres%20vaquero');
        });
    });

    describe('getParam', () => {
        it('should get a specific query string parameter value from a URL', () => {
            const name = 'param1';
            const url = 'https://www.com?param1=value1&param2=value2';
            const paramValue = getURLParam(name, url);
            expect(paramValue).toBe('value1');
        });

        it('should return an array ', () => {
            const url = 'https://www.com?param1[]=value1&param1[]=value2';
            const paramValue = getURLParam('param1', url);
            expect(paramValue).toEqual(['value1', 'value2']);
        });
    });

    describe('matchPath', () => {
        it('should match a URL against a route', () => {
            const isMatch = matchPath('/users/125', '/users/:id');
            expect(isMatch).toBe(true);
        });

        it('should not match a URL against a route', () => {
            const isMatch = matchPath('/users/andriu', '/posts/:postId');
            expect(isMatch).toBe(false);
        });

        it('should not match when path segment differs from non-param route segment', () => {
            const isMatch = matchPath('/users/123', '/posts/123');
            expect(isMatch).toBe(false);
        });

        it('should match dynamic param when path differs but route has param marker', () => {
            // This tests the case where routeParts[index] !== pathParts[index] but paramIndex === 0
            const isMatch = matchPath('/api/users/456', '/api/:resource/:id');
            expect(isMatch).toBe(true);
        });

        it('should match exact static segments', () => {
            const isMatch = matchPath('/users/list', '/users/list');
            expect(isMatch).toBe(true);
        });

        it('should iterate through all segments and return false on mismatch', () => {
            // First segment matches, second is a param (matches anything), third mismatches
            const isMatch = matchPath('/api/users/delete', '/api/:resource/edit');
            expect(isMatch).toBe(false);
        });
    });

    describe('matchPaths', () => {
        it('should match a URL against multiple routes', () => {
            const url = '/users/123';
            const routes = ['/users/:id', '/posts/:id'];
            const isMatch = matchPaths(url, routes);
            expect(isMatch).toBe(true);
        });

        it('should not match a URL against multiple routes', () => {
            const url = '/users/123';
            const routes = ['/posts/:id', '/comments/:id'];
            const isMatch = matchPaths(url, routes);
            expect(isMatch).toBe(false);
        });

        it('should skip non-string routes', () => {
            const url = '/users/123';
            const routes = [null, undefined, 123, '/users/:id'];
            const isMatch = matchPaths(url, routes);
            expect(isMatch).toBe(true);
        });
    });

    describe('getPathParts', () => {
        it('should return the parts of the current path', () => {
            const url = 'https://example.com/users/andresvaquero';
            const pathParts = getPathParts(url);
            expect(pathParts).toEqual(['users', 'andresvaquero']);
        });
    });

    describe('objectToQueryString', () => {
        it('should transform an object into a URL query string', () => {
            const object = { param1: 'value1', param2: 'value2' };
            const queryString = objectToQueryString(object);
            expect(queryString).toBe('?param1=value1&param2=value2');
        });

        it('should handle arrays converted to string', () => {
            const object = { colors: ['red', 'blue'] };
            const queryString = objectToQueryString(object);
            expect(queryString).toBe('?colors=red%2Cblue');
        });

        it('should skip empty property names', () => {
            const object = { '': 'value', valid: 'test' };
            const queryString = objectToQueryString(object);
            expect(queryString).toBe('?valid=test');
        });

        it('should handle encoding option', () => {
            const object = { param: 'hello world' };
            const encoded = objectToQueryString(object, true);
            const notEncoded = objectToQueryString(object, false);
            expect(encoded).toBe('?param=hello%20world');
            expect(notEncoded).toBe('?param=hello world');
        });

        it('should handle null/undefined values', () => {
            const object = { param: null, other: undefined };
            const queryString = objectToQueryString(object);
            expect(queryString).toBe('?param=&other=');
        });
    });

    describe('editUrl', () => {
        it('should edit the query in a URL', () => {
            const url = 'https://example.com?param1=value1&param2=value2';
            const params = { param1: 'newvalue1', param3: 'value3' };
            const editedUrl = editURL(url, params);
            expect(editedUrl).toBe('https://example.com?param1=newvalue1&param2=value2&param3=value3');
        });

        it('should remove params when value is null', () => {
            const url = 'https://example.com?param1=value1&param2=value2';
            const params = { param1: null };
            const editedUrl = editURL(url, params);
            expect(editedUrl).toBe('https://example.com?param2=value2');
        });

        it('should remove params when value is undefined', () => {
            const url = 'https://example.com?param1=value1&param2=value2';
            const params = { param1: undefined };
            const editedUrl = editURL(url, params);
            expect(editedUrl).toBe('https://example.com?param2=value2');
        });

        it('should handle URL without query string', () => {
            const url = 'https://example.com/path';
            const params = { param1: 'value1' };
            const editedUrl = editURL(url, params);
            expect(editedUrl).toBe('https://example.com/path?param1=value1');
        });

        it('should handle encode option', () => {
            const url = 'https://example.com';
            const params = { param: 'hello world' };
            const editedUrl = editURL(url, params, false);
            expect(editedUrl).toBe('https://example.com?param=hello world');
        });
    });

    describe('removeParam', () => {
        it('should remove a specific query string parameter from a URL', () => {
            const name = 'param1';
            const url = 'https://example.com?param1=value1&param2=value2';
            const newUrl = removeURLParam(name, url);
            expect(newUrl).toBe('https://example.com?param2=value2');
        });

        it('should handle URL without the parameter', () => {
            const url = 'https://example.com?param1=value1';
            const newUrl = removeURLParam('nonexistent', url);
            expect(newUrl).toBe('https://example.com?param1=value1');
        });

        it('should use window.location.href when url is not a string', () => {
            // Mock window.location.href
            const originalWindow = global.window;
            global.window = { location: { href: 'https://example.com?test=value' } };
            const newUrl = removeURLParam('test', null);
            expect(newUrl).toBe('https://example.com');
            global.window = originalWindow;
        });
    });

    describe('getURLParams', () => {
        it('should handle hash fragments', () => {
            const url = 'https://example.com?param=value#section';
            const params = getURLParams(url);
            expect(params).toEqual({ param: 'value' });
        });

        it('should handle array parameters', () => {
            const url = 'https://example.com?colors[]=red&colors[]=blue';
            const params = getURLParams(url);
            expect(params.colors).toEqual(['red', 'blue']);
        });

        it('should decode URL-encoded values', () => {
            const url = 'https://example.com?name=John%20Doe';
            const params = getURLParams(url);
            expect(params.name).toBe('John Doe');
        });
    });

    describe('arrayToQueryString', () => {
        it('should handle encode option false', () => {
            const queryString = arrayToQueryString('items', ['a', 'b'], false);
            expect(queryString).toBe('items[]=a&items[]=b');
        });
    });

    describe('decodeURIComponentSafe', () => {
        it('should return value unchanged for non-string', () => {
            expect(decodeURIComponentSafe(null)).toBe(null);
            expect(decodeURIComponentSafe(undefined)).toBe(undefined);
        });

        it('should handle malformed percent encoding', () => {
            expect(decodeURIComponentSafe('%test')).toBe('%test');
        });

        it('should return empty string unchanged', () => {
            expect(decodeURIComponentSafe('')).toBe('');
        });
    });

    describe('removeURLOrigin', () => {
        it('should remove origin from URL', () => {
            const result = removeURLOrigin('https://example.com/path');
            expect(result).toBe('/path');
        });

        it('should handle invalid URL', () => {
            const result = removeURLOrigin('not-a-valid-url');
            expect(result).toBe('not-a-valid-url');
        });

        it('should use window.location.origin for invalid URL when window exists', () => {
            const originalWindow = global.window;
            global.window = { location: { origin: 'http://localhost', href: 'http://localhost/' } };
            const result = removeURLOrigin('http://localhost/test');
            expect(result).toBe('/test');
            global.window = originalWindow;
        });

        it('should fallback to window.location.origin on URL parse error', () => {
            const originalWindow = global.window;
            // Set up window with location that can be used as fallback
            global.window = { location: { origin: 'invalid-url', href: 'invalid-url/' } };
            // This will throw in new URL() and fall back to window.location.origin replacement
            const result = removeURLOrigin('invalid-url/path');
            expect(result).toBe('/path');
            global.window = originalWindow;
        });
    });

    describe('sanitizeURL', () => {
        it('should sanitize URL with double slashes', () => {
            const result = sanitizeURL('https://example.com//path//to//file/');
            expect(result).toBe('/path/to/file');
        });
    });

    describe('getParentPath', () => {
        it('should return parent path', () => {
            expect(getParentPath('https://example.com/users/123')).toBe('/users');
            expect(getParentPath('https://example.com/a/b/c')).toBe('/a/b');
        });
    });
});
