import axios from 'axios'
import get from 'lodash/get'
import NotAuthorizedError from '@/errors/NotAuthorizedError'
import routerFromContext from '@/router/routerFromContext'
import storeFromContext from '@/store/storeFromContext'
import ErrorMatcher from '@/utils/ErrorMatcher'
import {
    LANDING
} from '@/constants-ts/routes'

const flatResponse = response => get(response, 'data.result')

const onError = error => {
    if (ErrorMatcher.isUnauthorize(error)) {
        const router = routerFromContext()
        const route = router.currentRoute
        const store = storeFromContext()
        if (!(route.name === LANDING && route.query.redirect)) {
            router.push({
                name: LANDING,
                query: {
                    redirect: route.fullPath
                }
            }).catch(() => {})
        }
        store.dispatch('app/setToken', null)
        store.dispatch('resetState')
    } else {
        throw error
    }
}
const BACKEND_URL = process.client ? process.env.VUE_APP_BACKEND_CLIENT_URL : process.env.VUE_APP_BACKEND_SERVER_URL

const BACKEND_PUBLIC = axios.create({
    baseURL: BACKEND_URL
})
const BACKEND_PRIVATE = axios.create({
    baseURL: BACKEND_URL
})
const BACKEND_LOYAL = axios.create({
    baseURL: BACKEND_URL
})

BACKEND_PUBLIC.interceptors.response.use(flatResponse)
BACKEND_PRIVATE.interceptors.response.use(flatResponse, onError)
BACKEND_LOYAL.interceptors.response.use(flatResponse)

BACKEND_PRIVATE.interceptors.request.use(request => {
    const store = storeFromContext()
    const token = get(store, 'state.user.accessToken')
    if (!token) {
        throw new NotAuthorizedError()
    }
    request.headers['Authorization'] = `Bearer ${token}`
    return request
})

BACKEND_LOYAL.interceptors.request.use(request => {
    const store = storeFromContext()
    const token = get(store, 'state.user.accessToken')
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
    }
    return request
})

export {
    BACKEND_PUBLIC,
    BACKEND_PRIVATE,
    BACKEND_LOYAL
}