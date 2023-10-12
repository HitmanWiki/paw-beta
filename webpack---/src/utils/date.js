import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import {
    DATE_FORMAT,
    DATE_TIME_FORMAT
} from '@/constants/date'

dayjs.extend(advancedFormat)
dayjs.extend(utc)

/**
 * Returns the formatted date according to the string of tokens passed in.
 * @param {ConfigType} date
 * @param {String} format token
 * @returns {String}
 */
export function formatDate(date, format = DATE_FORMAT) {
    return date ? dayjs(date).format(format) : 'N/A'
}

export function convertToUTC(date, format = DATE_TIME_FORMAT) {
    return date && dayjs.utc(date).format(format)
}

/**
 * Converts date from UTC to local timezone and formats
 * @param {ConfigType} date
 * @param {*} format token
 * @returns {String}
 */
export function convertToLocal(date, format = DATE_TIME_FORMAT) {
    return date && dayjs.utc(date).local().format(format)
}
export function getHumanDate(date, format = 'MMMM D, YYYY') {
    if (date) {
        const elapsedMinutes = dayjs.utc().diff(dayjs.utc(date), 'minute')
        if (elapsedMinutes < 1) {
            return 'a few seconds ago'
        } else if (elapsedMinutes < 60) {
            return `${elapsedMinutes} minutes ago`
        } else if (elapsedMinutes < 60 * 24) {
            return `${Math.floor(elapsedMinutes / 60)} hours ago`
        }
        return convertToLocal(date, format)
    }
}
/**
 * Returns a cloned Day.js object with a specified amount of seconds added.
 * @param {ConfigType} date base date
 * @param {Number} seconds amount
 * @returns Day.js instance
 */
export function addSeconds(date, seconds) {
    return dayjs(date).add(seconds, 's')
}

/**
 * Returns a cloned Day.js object with a specified amount of days added.
 * @param {ConfigType} date base date
 * @param {Number} days amount
 * @returns Day.js instance
 */
export function addDays(date, days) {
    return dayjs(date).add(days, 'd')
}

/**
 * Returns a cloned Day.js object with a specified amount of days added.
 * @param {ConfigType} date base date
 * @param {Number} days amount
 * @returns Day.js instance
 */
export function addMonths(date, months) {
    return dayjs(date).add(months, 'M')
}

export function getDiff(dateA, dateB, unit = 'day') {
    return dayjs(dateA).diff(dayjs(dateB), 'day')
}

/**
 * Returns Date instance from date
 * @param {ConfigType} date
 * @param {Boolean} inUTC convert to UTC zone
 * @returns {Date}
 */
export function getDateFromString(date, inUTC = true) {
    return inUTC ? dayjs.utc(date).toDate() : dayjs(date).toDate()
}

/**
 * This indicates whether the Day.js object is before the other supplied date-time
 * @param {ConfigType} date
 * @param {String|Date|Number} compareDate
 * @returns {Boolean}
 */
export function isBefore(date, compareDate) {
    return dayjs(date).isBefore(compareDate)
}

/**
 * Checks if date is in the current year
 * @param {ConfigType} date
 * @returns {Boolean}
 */
export function isThisYear(date) {
    return getDateFromString(date, false).getFullYear() === new Date().getFullYear()
}