/**
 * Produces a random string of n length
 * @param {Number} n string length
 */
export function getRandomString(n = 64) {
    var arr = new Uint8Array(n / 2)
    const crypto = window.crypto || window.msCrypto

    function dec2hex(dec) {
        return dec.toString(16).padStart(2, '0')
    }
    crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

/**
 * Trims string if necessary, otherwise returns str
 */
export function trim(str) {
    return typeof str === 'string' ? str.trim() : str
}