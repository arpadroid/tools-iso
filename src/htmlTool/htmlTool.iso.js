/**
 * @typedef {import('./htmlTool.types.js').ClassNamesValueType} ClassNamesValueType
 */
import { camelToDashed } from '../stringTool/stringTool.js';

/**
 * Returns class names from an object.
 * @param {unknown | Record<string, boolean>} obj
 * @returns {string}
 */
export function getObjectClassNames(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return '';
    }
    let out = '';
    for (const [key, value] of Object.entries(obj)) {
        if (value) out += ` ${key || ''}`;
    }
    return out.trim();
}

/**
 * Renders a class attribute.
 * @param {...ClassNamesValueType} classes
 * @returns {string}
 */
export function classNames(...classes) {
    /**
     * Maps a class to a string.
     * @param {ClassNamesValueType} _class
     * @returns {string[] | string | undefined}
     */
    const classArr = classes
        .map(item => {
            if (typeof item === 'function') item = item();
            if (typeof item === 'string') return item.trim();
            if (Array.isArray(item)) return classNames(...item);
            return getObjectClassNames(item);
        })
        .filter(Boolean)
        .join(' ')
        .split(' ')
        .filter(val => !['true', 'false'].includes(val));

    return [...new Set(classArr)].join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Renders attributes to a node.
 * @param {Record<string, unknown>} attributes
 * @returns {string}
 */
export function attrString(attributes = {}) {
    const attrArray = [];

    for (const [key, value] of Object.entries(attributes)) {
        const attrName = camelToDashed(key);
        if (key === 'class') {
            attrArray.push(`${attrName}="${classNames(value)}"`);
        } else if (value === true) {
            attrArray.push(attrName);
        } else if (typeof value === 'string' && value.length > 0) {
            attrArray.push(`${attrName}="${value}"`);
        } else if (typeof value === 'number' && value !== 0) {
            attrArray.push(`${attrName}="${value}"`);
        } else if (Array.isArray(value) && value.length > 0) {
            attrArray.push(`${attrName}="${value.join(',')}"`);
        }
    }

    return attrArray.join(' ');
}

/**
 * Renders attributes to a node.
 * @param {Record<string, unknown>} attributes
 * @returns {string}
 */
export function $attr(attributes = {}) {
    return attrString(attributes);
}
