/**
 * Adds zero values if missing from seconds/minutes/hours.
 * @param {number | string} time - The time value.
 * @returns {string} - The normalized time string.
 */
export function normalizeTimeZeroes(time) {
    const timeStr = time?.toString();
    time = parseFloat(timeStr);
    return time < 10 ? '0' + time : timeStr;
}

/**
 * Returns a string representation of the current time hh:mm:ss.
 * @param {Date} date - The date object.
 * @param {boolean} hasSeconds - Whether to include seconds in the time string.
 * @returns {string} - The formatted time string.
 */
export function getTimeString(date = new Date(), hasSeconds = true) {
    const hours = normalizeTimeZeroes(date.getHours());
    const minutes = normalizeTimeZeroes(date.getMinutes());
    const seconds = normalizeTimeZeroes(date.getSeconds());
    let time = `${hours}:${minutes}`;
    if (hasSeconds) {
        time += `:${seconds}`;
    }
    return time;
}

/**
 * Returns the timezone offset in hours.
 * @param {Date} date - The date object.
 * @returns {number} - The timezone offset in hours.
 */
export function getTimezoneOffset(date = new Date()) {
    return date.getTimezoneOffset() / 60;
}

/**
 * Checks if a given date is in the future.
 * @param {Date | string} dateTime - The date and time to compare.
 * @returns {boolean} - True if the date is in the future, false otherwise.
 */
export function isFuture(dateTime) {
    return new Date() < new Date(dateTime);
}

/**
 * Checks if one date is before another date.
 * @param {Date | string} dateTime - The first date and time to compare.
 * @param {Date | string} dateTime2 - The second date and time to compare.
 * @returns {boolean} - True if the first date is before the second date, false otherwise.
 */
export function isBefore(dateTime, dateTime2) {
    return new Date(dateTime) < new Date(dateTime2);
}

/**
 * Checks if one date is after another date.
 * @param {Date | string} dateTime - The first date and time to compare.
 * @param {Date | string} dateTime2 - The second date and time to compare.
 * @returns {boolean} - True if the first date is after the second date, false otherwise.
 */
export function isAfter(dateTime, dateTime2) {
    return new Date(dateTime) > new Date(dateTime2);
}

/**
 * Checks if a given date is in the past.
 * @param {Date | string} dateTime - The date and time to compare.
 * @returns {boolean} - True if the date is in the past, false otherwise.
 */
export function isPast(dateTime) {
    return new Date() > new Date(dateTime);
}

/**
 * Checks if a given date is today.
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isToday(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const today = new Date(now);
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

/**
 * Checks if a given date is yesterday (relative to optional reference date).
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isYesterday(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const ref = new Date(now);
    const yesterday = new Date(ref);
    yesterday.setDate(ref.getDate() - 1);
    return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
}

/**
 * Checks if a given date is tomorrow (relative to optional reference date).
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isTomorrow(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const ref = new Date(now);
    const tomorrow = new Date(ref);
    tomorrow.setDate(ref.getDate() + 1);
    return (
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear()
    );
}

/**
 * Checks if a given date is within the same week as the reference date (week starts on Monday).
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isThisWeek(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const ref = new Date(now);

    // normalize to midnight for robust day comparisons
    const _date = new Date(date);
    _date.setHours(0, 0, 0, 0);
    const _ref = new Date(ref);
    _ref.setHours(0, 0, 0, 0);

    const dayOfWeek = (_ref.getDay() + 6) % 7; // 0 = Monday, 6 = Sunday
    const monday = new Date(_ref);
    monday.setDate(_ref.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return _date >= monday && _date <= sunday;
}

/**
 * Checks if a given date is within the same month as the reference date.
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isThisMonth(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const ref = new Date(now);
    return date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear();
}

/**
 * Checks if a given date is within the same year as the reference date.
 * @param {Date} dateTime
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isThisYear(dateTime, now = new Date()) {
    const date = new Date(dateTime);
    const ref = new Date(now);
    return date.getFullYear() === ref.getFullYear();
}

/**
 * Adds the timezone offset to a given date.
 * @param {Date} date - The date object to modify.
 * @returns {Date} - The date object with the timezone offset added.
 */
export function addTimezoneOffset(date) {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
}

/**
 * Formats a given date into a specified format.
 * @param {Date | string} _date - The date object to format.
 * @param {string} format - The format string.
 * @param {boolean} addOffset - Whether to add the timezone offset to the date.
 * @param {string} locale - The locale to use for formatting.
 * @returns {string} - The formatted date string.
 */
export function formatDate(_date, format = 'DD-MM-YYYY HH:mm:ss', addOffset = false, locale = 'en-US') {
    let date = new Date(_date);
    if (addOffset) {
        date = addTimezoneOffset(date);
    }
    const year = date.getFullYear();
    const month = normalizeTimeZeroes(date.getMonth() + 1);
    const day = normalizeTimeZeroes(date.getDate());
    const hours = normalizeTimeZeroes(date.getHours());
    const minutes = normalizeTimeZeroes(date.getMinutes());
    const seconds = normalizeTimeZeroes(date.getSeconds());
    const rv = format
        .replace('YYYY', year.toString())
        .replace('YY', year.toString().substr(-2))
        .replace('MMMM', date.toLocaleString(locale, { month: 'long' }))
        .replace('MMM', date.toLocaleString(locale, { month: 'short' }))
        .replace('MM', month)
        .replace('DD', day)
        .replace('D', parseFloat(day).toString())
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    if (rv === 'NaN') return '';
    return rv;
}

/**
 * Returns a formatted string representing the time elapsed since the given date.
 * @param {Date | string | null} date - The date to compare.
 * @param {Date} [referenceDate] - The reference date to compare against.
 * @param {string} format - The format string.
 * @returns {string} - The formatted time elapsed string.
 */
export function getTimeAgo(date, referenceDate, format = '[D] [MON] YY at HH:mm') {
    if (!date) return '';
    date = new Date(date);
    const now = new Date(referenceDate || Date.now());
    const time = date.getTime();
    const secondsAgo = (now.getTime() - time) / 1000;
    const minutesAgo = secondsAgo / 60;
    const hoursAgo = minutesAgo / 60;

    if (secondsAgo < 10) {
        return 'Just now';
    } else if (secondsAgo < 60) {
        return 'A few seconds ago';
    } else if (minutesAgo < 60) {
        return `${Math.round(minutesAgo)} ${minutesAgo < 2 ? 'minute' : 'minutes'} ago`;
    } else if (hoursAgo < 12) {
        return `${Math.round(hoursAgo)} ${hoursAgo < 2 ? 'hour' : 'hours'} ago`;
    } else if (isToday(date, now)) {
        return `Today at ${getTimeString(date, false)}`;
    } else if (isYesterday(date, now)) {
        return `Yesterday at ${getTimeString(date, false)}`;
    } else if (isThisWeek(date, now)) {
        return date.toLocaleString('en-US', { weekday: 'long' }) + ' at ' + formatDate(date, 'HH:mm');
    }
    return formatDate(date, format);
}

/**
 * Validates a date format string.
 * @param {string} format - The format string to validate.
 * @returns {boolean} - True if the format is valid, false otherwise.
 */
export function validateDateFormat(format) {
    const regex = /YYYY|MM|DD|HH|mm|ss/g;
    return regex.test(format);
}

/**
 * Returns the number of days in a given month.
 * @param {number} month
 * @param {number} year
 * @returns {number} - The number of days in the month.
 */
export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

/**
 * Sets a date to the first day of the week.
 * @param {Date} date - The date object.
 * @returns {Date} - The number of days in the month.
 */
export function setDateToMonday(date) {
    const day = date.getDay() || 7;
    if (day !== 1) {
        date.setHours(-24 * (day - 1));
    }
    return date;
}
