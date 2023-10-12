import Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate'
import get from 'lodash/get'
import * as modulesClient from '@/store/client'
import * as modulesServer from '@/store/server'

function initAuth({
    store,
    req
}) {
    let isAuthorized = false
    try {
        if (process.client) {
            isAuthorized = Cookies.get('accessToken') === 'true'
        } else {
            isAuthorized = get(req, 'cookies.accessToken') === 'true'
        }
    } catch (e) {
        console.error(e) // ToDo: throw oops
    } finally {
        store.commit('app/setAuthorized', isAuthorized)
    }
}

function clearTokenStorage(store) {
    if (process.client) {
        const isAuthorized = Cookies.get('accessToken') === 'true'
        if (!isAuthorized) {
            store.dispatch('app/setToken', false)
        }
    }
}

export default {
    beforeCreate(context) {
        initAuth(context)
    },
    async beforeReady({
        store,
        router,
        req
    }) {
        try {
            initAuth({
                store,
                req
            })
            if (process.client) {
                for (const [key, factory] of Object.entries(modulesClient)) {
                    await store.registerModule(key, factory({
                        store,
                        router
                    }))
                }
                createPersistedState({
                    key: 'lx',
                    paths: [
                        'user.id',
                        'user.referrerId',
                        'user.utm',
                        'user.accessToken',
                        'user.activeRole',
                        'user.contest',
                        'chat.mode',
                        'ui.accountType',
                        'pendingTxs.txs',
                        'analytics.params',
                        'analytics.triggerCondition',
                    ],
                    storage: window.localStorage || window.sessionStorage,
                })(store)
                const BEFORE_READY_HOOK = 'beforeReady'
                const beforeReadyHooks = Object.keys(store._mutations).filter(name => name.includes(BEFORE_READY_HOOK))
                beforeReadyHooks.forEach(mutation => store.commit(mutation))
                clearTokenStorage(store)
            } else {
                for (const [key, factory] of Object.entries(modulesServer)) {
                    await store.registerModule(key, factory({
                        store,
                        router
                    }))
                }
            }
        } catch (e) {
            console.error(e) // ToDo: throw oops
        }
    }
}