import {
    BACKEND_PUBLIC,
    BACKEND_PRIVATE
} from '../base'
import {
    TOKEN_RESET
} from '@/constants/token'

/**
 * Sign Up User
 * @param fields
 * @param reCaptcha
 * @returns {AxiosPromise<any>}
 */
export async function signUp(fields, reCaptcha) {
    return BACKEND_PUBLIC.post('/users/register', {
        payload: {
            ...fields,
            reCaptcha,
        }
    })
}

/**
 * Sign Up User (Social)
 * @param fields
 * @param token
 * @returns {AxiosPromise<any>}
 */
export async function signUpSocial(fields, token) {
    return BACKEND_PUBLIC.post(
        '/users/social-register', {
            payload: {
                ...fields,
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

/**
 * Sign In User
 * @param login
 * @param password
 * @param reCaptcha
 * @returns {Promise<*>}
 */
export async function signIn({
    login,
    password,
    reCaptcha,
    key
}) {
    return BACKEND_PUBLIC.post('/users/temp-auth', {
        payload: {
            login,
            password,
            reCaptcha,
            key,
        }
    })
}

/**
 * Sign Out User
 * @returns {Promise<*>}
 */
export async function signOut() {
    return BACKEND_PRIVATE.post('/users/logout')
}

/**
 * Activate User Account
 * @param token
 * @returns {AxiosPromise<any>}
 */
export function activate(token) {
    return BACKEND_PUBLIC.post('/users/activate', {
        payload: {
            token
        }
    })
}

/**
 * Resend Password
 * @param email
 * @param reCaptcha
 * @returns {AxiosPromise<any>}
 */
export function resend(email, reCaptcha) {
    return BACKEND_PUBLIC.post('/users/resend-activation-mail', {
        payload: {
            email,
            reCaptcha,
        }
    })
}

/**
 * Forgot Password
 * @param email
 * @param reCaptcha
 * @returns {AxiosPromise<any>}
 */
export function forgot(email, reCaptcha) {
    return BACKEND_PUBLIC.post('/users/forgot', {
        payload: {
            email,
            reCaptcha,
        }
    })
}

export function reset(token, password, key) {
    return BACKEND_PUBLIC.post('/users/reset-password', {
        payload: {
            token,
            password,
            passwordConfirm: password,
            key
        }
    })
}

export function isValidToken(token) {
    return BACKEND_PUBLIC.post('/users/token-is-valid', {
        payload: {
            token,
            type: TOKEN_RESET
        }
    })
}

export async function exchangeSocialTemporaryToken(token, key) {
    return BACKEND_PUBLIC.post('/users/exchange-social-temporary-token', {
        payload: {
            token,
            key,
        },
    })
}

/**
 * Sign Up and Login User by signature
 * @param fields
 * @param reCaptcha
 * @returns {AxiosPromise<any>}
 */
export async function cryptoAuth(fields, reCaptcha) {
    return BACKEND_PUBLIC.post('users/crypto-auth', {
        payload: {
            ...fields,
            reCaptcha,
        }
    })
}