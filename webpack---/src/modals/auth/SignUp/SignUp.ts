import Vue, { PropType } from 'vue'
import { REGISTRATION_COMPLETE } from '@/constants-ts/routes'
import { Roles } from '@/constants-ts/user/roles'
import { googleAnalyticsV2 } from '@/servicies-ts/analytics'
import FillDataStep from './FillDataStep/FillDataStep.vue'
import SwitchTypeStep from './SwitchTypeStep/SwitchTypeStep.vue'
import { mapMutations } from 'vuex'

export default Vue.extend<any, any, any, any>({
  name: 'lx-sign-up-modal',
  components: {
    FillDataStep,
    SwitchTypeStep,
  },
  props: {
    meta: {} as PropType<any>,
    onSuccess: Function,
    fromType: String,
    predefinedRole: Number as PropType<Roles>,
  },
  data () {
    return {
      step: 0,
      signupData: {},
      isMetamask: false,
      role: null,
    }
  },
  created () {
    const analyticParams = {
      event: 'popup-register-executor-open',
      'event-content': ''
    }
    if (this.$route.query.createGigFrom === 'gig') {
      analyticParams['event-content'] = 'add-gig-from-another-gig'
    } else if (this.fromType === 'header') {
      analyticParams['event-content'] = 'header'
    } else if (this.fromType === 'anotherJob') {
      analyticParams['event-content'] = 'from-another-job'
    } else if (this.fromType === 'fromJob') {
      analyticParams['event'] = 'popup-register-customer-open'
      analyticParams['event-content'] = 'add-job-from-another-job'
    } else if (this.fromType === 'query') {
      analyticParams['event-content'] = 'query'
    }
    googleAnalyticsV2.send(analyticParams)
    if (this.predefinedRole) {
      this.role = this.predefinedRole
      this.step = 1
    }
  },
  methods: {
    ...mapMutations({
      setSignupData: 'signup/setData',
    }),
    onContinue () {
      this.step += 1
      const analyticParams = {
        event: 'register-button-continue',
        'event-content': ''
      }
      if (this.fromType === 'header') {
        analyticParams['event-content'] = 'header'
      } else if (this.fromType === 'contactmeJob') {
        analyticParams['event-content'] = 'contactme-job'
      } else if (this.fromType === 'landing-copy') {
        analyticParams.event = 'new-lp-1-register-button-continue'
      }
      googleAnalyticsV2.send(analyticParams)
    },
    onSuccessSignUp (signupData: Object) {
      this.setSignupData(signupData)
      if (this.onSuccess) {
        this.onSuccess()
      }
      this.$router.push({ name: REGISTRATION_COMPLETE })
      this.$emit('close')
    },
    onBeforeEnter (el: HTMLElement) {
      const stepContent = this.$refs.stepContent as HTMLElement
      stepContent.style.minHeight = '282px'
      setTimeout(() => {
        stepContent.style.minHeight = `${el.clientHeight}px`
      }, 0)
    },
    onAfterLeave () {
      // console.log('hook', Date.now())
      // const fillDataStep = this.$refs.fillDataStep as Vue
      // fillDataStep.$el.classList.remove('show-animation')
    }
  },
})
