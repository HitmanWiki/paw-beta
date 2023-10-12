// import LogRocket from 'logrocket'
import Vue from 'vue'
import VueMeta from 'vue-meta'
// @ts-ignore
import Notifications from 'vue-notification/dist/ssr.js'
// @ts-ignore
import VueNumeric from 'vue-numeric'
// @ts-ignore
import VueTippy, { TippyComponent } from 'vue-tippy'
import { sync } from 'vuex-router-sync'
import Lazy from '@/directives/Lazy'
import scroll from '@/directives/scroll'
import App from './App.vue'
import Components from './components'
import Modals from './modals'
import Partials from './partials'
import routerFactory from './router'
import storeFactory from './store'
import breakpoints from './plugins/breakpoints'
import VeeValidate from './plugins/veeValidate'
import './polyfills/scrollIntoViewIfNeeded'
import smoothscroll from 'smoothscroll-polyfill'
import sentryClient from './servicies-ts/SentryClient'

// if (process.client && process.env.VUE_APP_MODE === 'prod') {
//   LogRocket.init('tyodrt/laborx', {
//     release: process.env.VUE_APP_VERSION,
//     network: {
//       requestSanitizer: request => {
//         if (request.headers.Authorization) {
//           request.headers.Authorization = ''
//         }
//         return request
//       },
//       responseSanitizer: response => {
//         return null
//       },
//     }
//   })
// }

Vue.use(VeeValidate)
Vue.use(VueMeta)
Vue.use(Components)
Vue.use(Modals)
Vue.use(Partials)
Vue.use(breakpoints)
Vue.use(Notifications)
Vue.use(VueNumeric)
Vue.use(VueTippy)
Vue.component('tippy', TippyComponent)
Vue.directive('lazy', Lazy)
Vue.directive('scroll', scroll)

if (process.client) {
  smoothscroll.polyfill()
}

declare module 'vue/types/vue' {
  interface Vue {
    $breakpoints: any
  }
}

export default () => {
  const store = storeFactory()
  const router = routerFactory(store)
  sync(store, router)
  if (process.client) {
    sentryClient.init(router)
  }
  return new Vue({
    router,
    store,
    created () {
      this.$breakpoints.init()
    },
    render: h => h(App)
  })
}
