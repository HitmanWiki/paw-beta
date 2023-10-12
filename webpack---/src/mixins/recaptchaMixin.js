import get from 'lodash/get'

const reCaptchaRequired = ['prod'].includes(process.env.VUE_APP_MODE)

export default {
    components: {
        lxRecaptcha: () =>
            import ( /* webpackChunkName: "recaptcha" */ '@/components/Recaptcha/Recaptcha.vue')
    },
    data() {
        return {
            captchaCode: null,
            isRecaptchaLoading: reCaptchaRequired,
        }
    },
    methods: {
        onLoadedRecaptcha() {
            this.isRecaptchaLoading = false
        },
        onExpiredRecaptcha() {
            this.captchaCode = null
            const recaptcha = get(this.$refs, 'lxRecaptcha.$refs.recaptcha')
            if (recaptcha) {
                recaptcha.reset()
            }
        },
        executeRecaptcha(onVerify) {
            if (!reCaptchaRequired) {
                if (onVerify) {
                    onVerify()
                }
                return
            }
            if (this.captchaCode) {
                this.onExpiredRecaptcha()
            }
            this.$refs.lxRecaptcha.$refs.recaptcha.execute()
        }
    }
}