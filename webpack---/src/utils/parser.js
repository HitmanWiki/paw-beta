import isEmpty from 'lodash/isEmpty'

/**
 * Parse string in JSON without exceptions
 * @param {String} str JSON
 * @param {} defaultValue
 * @returns result of JSON.parse or defaultValue
 */
export function parseJson(str, defaultValue = {}) {
    try {
        return JSON.parse(str || JSON.stringify(defaultValue))
    } catch (e) {
        return defaultValue
    }
}

/**
 * Replaces all occurrences {name} with appropriate property from params
 * @param {String} template
 * @param {Object} params
 */
export function parseTemplate(template, params) {
    return isEmpty(params) ? template : template.replace(/{(\w*)}/g, (m, key) => params.hasOwnProperty(key) ? params[key] : '')
}

/**
 * Extracts slug without id from backend slug
 * @param {String} slug slug from backend
 * @returns {String}
 */
export function parseSlug(slug = '') {
    try {
        return slug.match(/^(.*)(-\d*$)/)[1]
    } catch (e) {
        return slug
    }
}