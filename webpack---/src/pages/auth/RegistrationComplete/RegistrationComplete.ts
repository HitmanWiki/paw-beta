import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { resend } from '@/api/usersAndProfiles/auth'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import zendeskMixin from '@/mixins/zendeskMixin'
import recaptchaMixin from '@/mixins/recaptchaMixin'
import { formatDate } from '@/utils/date'
import responseMixin from '@/mixins/responseMixin'

export default Vue.extend<any, any, any, any>({
  mixins: [zendeskMixin, recaptchaMixin, responseMixin],
  components: {
    LxHeader,
  },
  data () {
    return {
      loading: false,
      loadingCaptcha: false,
      recaptchaTimeout: null,
      resendIntervalId: null,
      resendTimeout: 120,
    }
  },
  computed: {
    ...mapState({
      signupData: (state: any) => state.signup?.signupData,
    }),
    email () {
      return this.signupData?.email
    },
    hasTimeout () {
      return this.resendIntervalId !== null
    },
    resendLabel () {
      const base = 'Resend Verification Link'
      const seconds = formatDate(this.resendTimeout * 1000, 'mm:ss')
      return this.hasTimeout ? `${base} in ${seconds}` : base
    }
  },
  created () {
    if (!this.signupData) {
      this.$router.replace('/')
    }
  },
  mounted () {
    this.setResendTimeout()
  },
  beforeDestroy () {
    this.resetState()
    if (this.recaptchaTimeout) {
      clearTimeout(this.recaptchaTimeout)
    }
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId)
    }
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
    }),
    ...mapMutations({
      resetState: 'signup/resetState',
    }),
    onClickSupport () {
      if (!this.isZendeskLoading) {
        this.openZendesk('Registration complete')
      }
    },
    onClickChangeEmail () {
      this.openModal({
        component: 'lx-lazy-modal',
        props: {
          factory: import(/* webpackChunkName: "settings-modals" */ '@/modals/auth/ChangeEmail/ChangeEmail.vue'),
          title: 'Change Email',
          props: {
            onSuccess: () => this.setResendTimeout()
          },
        }
      })
    },
    onClickResend () {
      if (this.hasTimeout) {
        return
      }
      this.loadingCaptcha = true
      this.executeRecaptcha(this.onVerify)
      this.recaptchaTimeout = setTimeout(() => {
        this.loadingCaptcha = false
      }, 3000)
    },
    async onVerify (reCaptcha: string) {
      try {
        if (this.recaptchaTimeout) {
          clearTimeout(this.recaptchaTimeout)
        }
        this.loading = true
        this.captchaCode = reCaptcha
        await resend(this.email, reCaptcha)
        this.setResendTimeout()
      } catch (e) {
        this.parseError(e)
      } finally {
        this.loading = false
        this.loadingCaptcha = false
      }
    },
    setResendTimeout () {
      if (this.resendIntervalId) {
        clearInterval(this.resendIntervalId)
        this.resendTimeout = 120
      }
      this.resendIntervalId = setInterval(() => {
        if (this.resendTimeout > 1) {
          this.resendTimeout--
          return
        }
        clearInterval(this.resendIntervalId)
        this.resendIntervalId = null
        this.resendTimeout = 120
      }, 1000)
    },
  },
  metaInfo: {
    title: 'Registration Complete',
    meta: [
      {
        vmid: 'robots',
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ]
  },
})
