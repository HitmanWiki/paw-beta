import Cookies from 'js-cookie'
import {
    getRates
} from '@/api/rates'
import {
    cryptoAuth,
    signIn,
    signOut
} from '@/api/usersAndProfiles/auth'

export default () => ({
    namespaced: true,
    state: {
        authorized: false,
        redirect: '',
        notFound: false,
        rates: [],
    },
    mutations: {
        setAuthorized(state, flag) {
            state.authorized = flag
        },
        setNotFound: (state, flag) => {
            state.notFound = flag
        },
        setRedirect: (state, path) => {
            state.redirect = path
        },
        setRates: (state, rates) => {
            state.rates = rates
        },
    },
    actions: {
        setToken({
            commit
        }, token) {
            commit('setAuthorized', !!token)
            if (process.client) {
                if (token) {
                    Cookies.set('accessToken', !!token, {
                        expires: 30,
                        samesite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                    })
                } else {
                    Cookies.remove('accessToken')
                }
                commit('user/setToken', token, {
                    root: true
                })
            }
        },
        async login({
            dispatch
        }, {
            email,
            password,
            reCaptcha,
            key
        }) {
            const {
                token
            } = await signIn({
                login: email,
                password,
                reCaptcha,
                key
            })
            return dispatch('setToken', token)
        },
        async cryptoLogin({
            dispatch
        }, {
            reCaptcha,
            ...payload
        }) {
            const response = await cryptoAuth(payload, reCaptcha)
            dispatch('setToken', response ? .token)
            return response ? .redirect_url
        },
        async logout({
            commit,
            dispatch
        }) {
            try {
                commit('setAuthorized', false)
                await signOut()
            } catch (e) {
                console.error(e)
            } finally {
                dispatch('setToken', null)
                dispatch('resetState', null, {
                    root: true
                })
            }
        },
        async getRates({
            commit,
            state
        }) {
            if (state.rates.length) {
                return state.rates
            }
            let rates = await getRates()
            commit('setRates', rates || [])
            return rates
        },
    }
})