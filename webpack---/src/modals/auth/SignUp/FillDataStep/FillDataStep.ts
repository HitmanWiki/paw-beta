/* eslint-disable max-len */
import Vue, { PropType } from 'vue'
import camelCase from 'lodash/camelCase'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import recaptchaMixin from '@/mixins/recaptchaMixin'
import responseMixin from '@/mixins/responseMixin'
import snackMixin from '@/mixins/snackMixin'
import { DASHBOARD } from '@/constants-ts/routes'
import { Roles, USER_TYPE_CUSTOMER_PERSON } from '@/constants-ts/user/roles'
import { linkedInAnalytics, googleAnalyticsV2 } from '@/servicies-ts/analytics'
import { isActive as isActiveMetamask, getSignPhrase } from '@/servicies/blockchain/metamask'
import { getOAuthLink } from '@/utils-ts/strings'
import { signUp } from '@/api/usersAndProfiles/auth'

export default Vue.extend<any, any, any, any>({
  mixins: [responseMixin, recaptchaMixin, snackMixin],
  props: {
    meta: {} as PropType<any>,
    fromType: String,
    role: Number as PropType<typeof Roles.FREELANCER | typeof Roles.CUSTOMER>,
  },
  data: () => ({
    metamaskProcessing: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    loading: false,
    signData: null,
    loadingCaptcha: false,
    recaptchaTimeout: null,
  }),
  computed: {
    ...mapGetters({
      tokenInfo: 'user/tokenInfo',
    }),
    ...mapState('user', {
      referrerId: (state: any): string => state.referrerId,
      contest: (state: any) => state.contest,
      utm: (state: any): string => state.utm,
    }),
    textRole () {
      switch (this.role) {
        case Roles.CUSTOMER: {
          return 'Customer'
        }
        default: {
          return 'Talent'
        }
      }
    },
    withSocials () {
      return !this.meta
    },
    isMetamaskLoading () {
      return this.metamaskProcessing
    },
    baseFields () {
      return {
        ...this.utm,
        email: this.email,
        password: this.password,
        referrer_id: this.referrerId || undefined,
        contest: this.contest || undefined,
        source: document.referrer,
        after_register: this.meta,
      }
    },
    apiFieldMetamask () {
      const utm = Object.entries(this.utm || {})
        .reduce((utm, [key, value]) => ({ ...utm, [camelCase(key)]: value }), {})
      const payload = {
        ...utm,
        ...this.signData,
        referrer_id: this.referrerId || undefined,
        contest: this.contest || undefined,
        source: document.referrer,
        afterRegister: this.meta,
        accountType: this.role,
      }
      if (this.role === Roles.CUSTOMER) {
        payload.employerType = USER_TYPE_CUSTOMER_PERSON
      }
      return payload
    },
    apiField () {
      if (this.metamaskProcessing) {
        return this.apiFieldMetamask
      }
      return { ...this.baseFields, account_type: this.role }
    },
    isFreelancer () {
      return this.role === Roles.FREELANCER
    },
  },
  beforeDestroy () {
    if (this.recaptchaTimeout) {
      clearTimeout(this.recaptchaTimeout)
    }
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      cryptoLogin: 'app/cryptoLogin',
    }),
    ...mapMutations({
      setParams: 'analytics/setParams',
      setTriggerCondition: 'analytics/setTriggerCondition',
    }),
    getSocialAuthLink (social: string): string {
      return this.metamaskProcessing ? '#' : getOAuthLink(social, this.role, false) as string
    },
    onClickLogin () {
      const analyticParams = {
        event: 'popup-auth-open',
        'event-content': '',
      }
      if (this.$route.query.createGigFrom === 'gig') {
        analyticParams['event-content'] = 'add-gig-from-another-gig'
      } else if (this.fromType === 'anotherJob') {
        analyticParams['event-content'] = 'from-job'
      } else if (this.fromType === 'fromJob') {
        analyticParams['event-content'] = 'add-job-from-another-job'
      }
      googleAnalyticsV2.send(analyticParams)
      this.$emit('close')
      this.openModal({
        component: 'lx-login-modal',
        id: 'lx-login-modal',
        props: {
          fromType: this.fromType
        },
      })
    },
    async googleRegister () {
      if (this.fromType === 'landing-copy') {
        this.setParams({ event: 'new-lp-1-register-success' })
        this.setTriggerCondition('register-success')
      }
    },
    onContinue () {
      this.$emit('continue', {
        data: this.apiField,
        isMetamask: this.metamaskProcessing,
      })
    },
    async onClickMetamask () {
      try {
        this.metamaskProcessing = true
        this.errors.clear()
        let isValid = true
        if (!this.firstName) {
          this.errors.add({
            field: 'first_name',
            msg: 'The First Name field is required'
          })
          isValid = false
        }
        if (!this.lastName) {
          this.errors.add({
            field: 'last_name',
            msg: 'The Last Name field is required'
          })
          isValid = false
        }
        if (isValid) {
          if (!isActiveMetamask()) {
            this.openModal({
              component: 'lx-composite-modal',
              props: {
                title: 'Metamask not installed',
                text: `To continue, you need to install and configure
                <a class="lx-link" href="https://metamask.io" target="_blank" rel="nofollow noopener">Metamask</a>
                ${this.isTabletLx ? '<br><br>If you have Meta Mask mobile application installed, please go to the application and use Browser feature' : ''}`,
                onClose: () => { this.metamaskProcessing = false }
              }
            })
            return
          }
          this.signData = await getSignPhrase()
          this.signUp()
        } else {
          this.metamaskProcessing = false
        }
      } catch (e) {
        this.metamaskProcessing = false
        throw e
      }
    },
    async onSubmitSignUp () {
      this.loading = true
      if (this.metamaskProcessing) {
        return false
      }
      this.errors.clear()
      let isValid = true
      if (!await this.$validator.validateAll()) {
        isValid = false
      }
      if (isValid) {
        this.loadingCaptcha = true
        this.executeRecaptcha(this.signUp)
        this.recaptchaTimeout = setTimeout(() => {
          this.loadingCaptcha = false
        }, 3000)
      } else {
        this.loading = false
      }
    },
    async signUp (reCaptcha: string) {
      try {
        this.loading = true
        if (this.metamaskProcessing) {
          this.errors.clear()
          const redirectUrl = await this.cryptoLogin({
            ...this.apiField,
            firstName: this.firstName.trim(),
            lastName: this.lastName.trim(),
          })
          this.onMetamaskRegistered()
          this.$emit('close')
          this.redirect(redirectUrl || DASHBOARD)
          if (this.role !== Roles.CUSTOMER) {
            this.openModal({
              component: 'lx-lazy-modal',
              props: {
                factory: import(/* webpackChunkName: "welcome-modal" */ '@/modals/WelcomeModal/WelcomeModal.vue'),
                title: 'Welcome to LaborX!',
                props: {
                  activeRole: this.role,
                }
              }
            })
          }
        } else {
          if (this.recaptchaTimeout) {
            clearTimeout(this.recaptchaTimeout)
          }
          await signUp({
            ...this.apiField,
            first_name: this.firstName.trim(),
            last_name: this.lastName.trim(),
          }, reCaptcha)
          this.sendRegisterFormEmail()
        }
        this.completeSingUp()
      } catch (e: any) {
        let errorMsg = ''
        const validationErr = Object.values(e.response?.data?.validation || {})[0]
        if (validationErr) {
          errorMsg = Array.isArray(validationErr) ? validationErr[0] : validationErr
        }
        this.openSnackbar({
          type: this.SnackTypes.FAILURE,
          text: (errorMsg || 'Registration error') as string
        })
      } finally {
        this.loading = false
        this.loadingCaptcha = false
      }
    },
    redirect (to: any) {
      if (to === DASHBOARD) {
        this.$router.push({ name: to })
      } else {
        const urlPart = to.split('/').slice(3).join('/')
        this.$router.push(`/${urlPart}`)
      }
    },
    onMetamaskRegistered () {
      const userid = this.tokenInfo?.user_id
      const analyticParams = {
        event: 'register-success',
        account: 'Y',
        userid,
        name: 'metamask',
        role: this.textRole,
        'hit-role': this.textRole,
        'event-content': this.getEventContent(),
      }
      googleAnalyticsV2.send(analyticParams)
    },
    sendRegisterFormEmail () {
      if (this.fromType !== 'landing-copy') {
        const analyticParams = {
          event: 'register-form-email-send',
          role: this.textRole,
          'hit-role': this.textRole,
          'event-content': this.getEventContent(),
        }
        googleAnalyticsV2.send(analyticParams)
      }
    },
    completeSingUp () {
      this.sendAnalytics()
      this.$emit('success', {
        ...this.apiField,
        first_name: this.firstName.trim(),
        last_name: this.lastName.trim(),
      })
      if (this.fromType === 'landing-copy') {
        googleAnalyticsV2.send({ event: 'new-lp-1-register-name-3-step' })
        this.setParams({ event: 'new-lp-1-register-success' })
        this.setTriggerCondition('register-success')
      } else if (!this.metamaskProcessing) {
        const analyticParams = {
          event: 'register-success',
          name: 'email',
          account: 'Y',
          role: this.textRole,
          'hit-role': this.textRole,
          'event-content': this.getEventContent(),
        }
        this.setParams(analyticParams)
        this.setTriggerCondition('register-success')
      }
    },
    getEventContent () {
      let eventContent = ''
      if (this.$route.query.createGigFrom === 'gig') {
        eventContent = 'add-gig-from-another-gig'
      } else if (this.fromType === 'header') {
        eventContent = 'header'
      } else if (this.fromType === 'anotherJob') {
        eventContent = 'from-job'
      } else if (this.fromType === 'contactmeJob') {
        eventContent = 'contactme-job'
      } else if (this.fromType === 'fromJob') {
        eventContent = 'add-job-from-another-job'
      }
      return eventContent
    },
    sendAnalytics () {
      linkedInAnalytics.sendSuccessRegistration()
    },
  }
})
