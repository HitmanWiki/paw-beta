import Vue from 'vue'
import Router from 'vue-router'
import {
    googleAnalyticsV2
} from '@/servicies-ts/analytics'
import privateRoutes from './routes/private'
import publicRoutes from './routes/public'
import otherRoutes from './routes/other'
import animateScrollTo from '@/utils/animateScrollTo'

Vue.use(Router)

const checkUser = ({
    store,
    route,
    redirect
}) => {
    if (!store.state.app.authorized) {
        redirect(`/?redirect=${route.fullPath}`)
    }
}
const markAuth = (route) => ({ ...route,
    meta: {
        requiresAuth: true,
        middlewares: [checkUser],
        ...route.meta
    }
})

export default (store) => {
    const router = new Router({
        mode: 'history',
        base: process.env.BASE_URL,
        routes: [
            ...privateRoutes.map(route => ({
                ...markAuth(route),
                children: (route.children || []).map(markAuth),
            })),
            ...publicRoutes,
            ...otherRoutes,
        ],
        scrollBehavior(to, from, savedPosition) {
            if (to.hash) {
                const el = document.getElementById(CSS.escape(to.hash.slice(1)))
                if (el) {
                    return animateScrollTo(el)
                }
                return {
                    selector: to.hash
                }
            }
            if (savedPosition) {
                return savedPosition
            }
            if (to.meta.containsTabs && to.name === from.name) {
                return {
                    x: 0,
                    y: window.scrollY
                }
            }
            return {
                x: 0,
                y: 0
            }
        }
    })

    router.afterEach((to, from) => {
        if (process.client) {
            sendAnalytics(to, from)
        }
    })

    return router
}

function sendAnalytics(to, from) {
    googleAnalyticsV2.send({
        event: 'pageview',
        url: to.fullPath,
        location: window.location.href,
    })
}