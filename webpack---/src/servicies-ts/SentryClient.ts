import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import VueRouter from 'vue-router'

class SentryClient {
  private dsn
  private initialized: boolean

  constructor () {
    this.dsn = process.env.VUE_APP_SENTRY_DSN
  }

  init (router: VueRouter) {
    if (this.dsn) {
      Sentry.init({
        Vue,
        dsn: this.dsn,
        release: process.env.VUE_APP_VERSION,
        environment: process.env.VUE_APP_MODE,
        integrations: [
          new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
          new Sentry.Replay(),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })
      if (process.client && window) {
        window.onerror = this.capture
      }
      this.initialized = true
    }
  }

  capture (err: any) {
    if (err) {
      console.log(err)
      if (this.initialized) {
        Sentry.captureException(err)
      } else {
        console.warn('Error capture service not initialized')
      }
    }
  }
}

export default new SentryClient()
