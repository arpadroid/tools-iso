import { camelToDashed } from '../stringTool/stringTool.js';

/**
 * Renders attributes to a node.
 * @param {Record<string, unknown>} attributes
 * @returns {string}
 */
export function attrString(attributes = {}) {
    const attrArray = [];

    for (const [key, value] of Object.entries(attributes)) {
        const attrName = camelToDashed(key);

        if (value === true) {
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
