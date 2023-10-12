import {
    forgot
} from '@/api/usersAndProfiles/auth'
import * as buttons from '@/constants/button'
import recaptchaMixin from '@/mixins/recaptchaMixin'
import responseMixin from '@/mixins/responseMixin'

export default {
    name: 'lx-forgot-modal',
    mixins: [
        recaptchaMixin,
        responseMixin,
    ],
    data() {
        return {
            email: '',
            buttons,
            loading: false,
            loadingCaptcha: false,
            recaptchaTimeout: null,
            success: false,
        }
    },
    computed: {
        isLoading() {
            return this.loading || this.loadingCaptcha
        },
    },
    methods: {
        async onSubmit() {
            if (await this.$validator.validateAll()) {
                this.loadingCaptcha = true
                this.executeRecaptcha(this.onVerify)
                this.recaptchaTimeout = setTimeout(() => {
                    this.loadingCaptcha = false
                }, 3000)
            }
        },
        async onVerify(reCaptcha) {
            try {
                if (this.recaptchaTimeout) {
                    clearTimeout(this.recaptchaTimeout)
                }
                this.loading = true
                this.captchaCode = reCaptcha
                await forgot(this.email, reCaptcha)
                this.success = true
            } catch (e) {
                this.parseError(e)
            } finally {
                this.loading = false
                this.loadingCaptcha = false
            }
        },
    }
}