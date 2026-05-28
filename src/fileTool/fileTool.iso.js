/**
 * Format bytes to a human-readable string.
 * @param {number} bytes
 * @param {number} [precision]
 * @returns {string}
 */
export function formatBytes(bytes, precision = 1) {
    if (bytes === 0) {
        return '0 bytes';
    }
    if (typeof bytes === 'undefined' || !isFinite(bytes)) {
        return '';
    }
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const $number = Math.floor(Math.log(bytes) / Math.log(1024));
    const unit = units[$number] ?? 'bytes';
    if (['KB', 'bytes'].includes(unit)) {
        precision = 0;
    }
    const value = (bytes / Math.pow(1024, Math.floor($number))).toFixed(precision);
    return (value.match(/\.0*$/) ? value.substr(0, value.indexOf('.')) : value) + ' ' + unit;
}
