import get from 'lodash/get'

class ErrorMatcher {
    static FA2_ERROR_MSG = '2FA Key is invalid'

    /**
     * Check 2FA key missing error
     */
    static is2FA(e) {
        return get(e, 'response.data.validation.key') === ErrorMatcher.FA2_ERROR_MSG
    }

    /**
     * Check 401 response status code
     */
    static isUnauthorize(e) {
        return get(e, 'response.status') === 401
    }

    /**
     * Check 404 response status code
     */
    static isNotFound(e) {
        return get(e, 'response.status') === 404
    }

    /**
     * Check 403 response status code
     */
    static isForbidden(e) {
        return get(e, 'response.status') === 403
    }

    /**
     * Check 409 response status code
     */
    static isConflict(e) {
        return get(e, 'response.status') === 409
    }

    /**
     * Check 410 response status code
     */
    static isGone(e) {
        return get(e, 'response.status') === 410
    }

    /**
     * Check 422 response status code
     */
    static isUnprocessableEntity(e) {
        return get(e, 'response.status') === 422
    }

    /**
     * Check 429 response status code
     */
    static isTooManyRequests(e) {
        return get(e, 'response.status') === 429
    }

    /**
     * Check 500 response status code
     */
    static isServerError(e) {
        return get(e, 'response.status') === 500
    }
}

export default ErrorMatcher