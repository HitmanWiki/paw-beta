import Vue from 'vue'
import get from 'lodash/get'
import each from 'lodash/each'
import { LANDING } from '@/constants-ts/routes'
import NotAuthorizedError from '@/errors/NotAuthorizedError'
import { AxiosError } from 'axios'
import SentryClient from '@/servicies-ts/SentryClient'

export default Vue.extend({
  methods: {
    parseError (error: AxiosError, scope = '') {
      console.error(error)
      const validationErrors = get(error, 'response.data.validation')
      const errorName = get(error, 'response.data.name')

      if (errorName === 'Unauthorized' || error instanceof NotAuthorizedError) {
        if (!(this.$route.name === LANDING && this.$route.query.redirect)) {
          this.$router.push({ name: LANDING, query: { redirect: this.$route.fullPath } }).catch(() => {})
        }
        this.$store.dispatch('app/setToken', null)
        this.$store.dispatch('resetState')
      } else if (validationErrors) {
        each(validationErrors, (msg, field) => {
          this.errors?.add({
            field: (scope ? `${scope}.` : '') + field,
            msg: Array.isArray(msg) ? msg[0] : msg
          })
        })
      } else {
        SentryClient.capture(error)
      }
    }
  }
})
