import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import responseMixin from '@/mixins/responseMixin'
import { DASHBOARD } from '@/constants-ts/routes'
import { Roles } from '@/constants-ts/user/roles'
import { linkedInAnalytics, googleAnalyticsV2 } from '@/servicies-ts/analytics'
import { signUpSocial } from '@/api/usersAndProfiles/auth'

export default Vue.extend<any, any, any, any>({
  name: 'lx-sign-up-social-modal',
  mixins: [responseMixin],
  props: {
    token: String,
    authClient: String,
    viaLogin: Boolean,
  },
  data: () => ({
    firstName: '',
    lastName: '',
    loading: false,
    activeProfile: Roles.FREELANCER,
    termsAgree: false,
  }),
  computed: {
    ...mapState('user', {
      referrerId: (state: any): string => state.referrerId,
      contest: (state: any) => state.contest,
      utm: (state: any): string => state.utm,
    }),
    ...mapGetters({
      tokenInfo: 'user/tokenInfo',
    }),
    isFreelancer: {
      get () {
        return this.activeProfile === Roles.FREELANCER
      },
      set (isFreelancer) {
        this.activeProfile = isFreelancer ? Roles.FREELANCER : Roles.CUSTOMER
      }
    },
    textRole () {
      return this.isFreelancer ? 'talent' : 'customer'
    }
  },
  created () {
    try {
      const parsedToken = JSON.parse(window.atob(this.token.split('.')[1]))
      const user = parsedToken.new_user
      if (user.first_name) {
        this.firstName = user.first_name
      }
      if (user.last_name) {
        this.lastName = user.last_name
      }
      if (parsedToken.creating_profile_type) {
        this.activeProfile = parsedToken.creating_profile_type
      }
    } catch (e) {
      console.error('invalid base 64', this.token)
    }
  },
  methods: {
    ...mapActions({
      setToken: 'app/setToken',
      openModal: 'ui/openModal',
    }),
    async signUp () {
      if (this.loading) return false
      if (!await this.$validator.validateAll()) {
        return false
      }
      try {
        this.loading = true
        const token = await signUpSocial({
          ...this.utm,
          referrer_id: this.referrerId,
          contest: this.contest || undefined,
          first_name: this.firstName,
          last_name: this.lastName,
          account_type: this.activeProfile,
        }, this.token)
        linkedInAnalytics.sendSuccessRegistration()
        this.setToken(token)
        const userid = this.tokenInfo?.user_id
        googleAnalyticsV2.send({
          event: 'register-success',
          name: '',
          account: 'Y',
          role: this.textRole,
          'hit-role': this.textRole,
          'role-customer': '',
          'event-content': '',
          userid,
        })
        this.$router.push({ name: DASHBOARD })
        this.$emit('close')
        if (this.activeProfile !== Roles.CUSTOMER) {
          this.openModal({
            component: 'lx-lazy-modal',
            props: {
              factory: import(/* webpackChunkName: "welcome-modal" */ '@/modals/WelcomeModal/WelcomeModal.vue'),
              title: 'Welcome to LaborX!',
              props: {
                activeRole: this.activeProfile,
              }
            }
          })
        }
      } catch (e) {
        this.parseError(e)
      }
      this.loading = false
    },
  }
})
