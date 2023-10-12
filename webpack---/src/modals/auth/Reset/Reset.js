import {
    mapActions,
    mapMutations
} from 'vuex'
import {
    isValidToken,
    reset
} from '@/api/usersAndProfiles/auth'
import {
    BUTTON_BLUE_MEDIUM
} from '@/constants/button'
import {
    DASHBOARD
} from '@/constants-ts/routes'
import recaptchaMixin from '@/mixins/recaptchaMixin'
import responseMixin from '@/mixins/responseMixin'
import ErrorMatcher from '@/utils/ErrorMatcher'
import tfaMixin from '@/mixins/tfaMixin'
import snackMixin from '@/mixins/snackMixin'

export default {
    name: 'lx-reset-modal',
    mixins: [
        recaptchaMixin,
        responseMixin,
        tfaMixin,
        snackMixin,
    ],
    props: {
        token: String
    },
    data() {
        return {
            BUTTON_BLUE_MEDIUM,
            password: '',
            passwordConfirm: '',
            loading: false,
            loadingCaptcha: false,
            recaptchaTimeout: null,
            tokenValid: false,
            text: null,
            enter2faStep: false,
        }
    },
    async mounted() {
        try {
            await isValidToken(this.token)
            this.tokenValid = true
        } catch (e) {
            this.text = 'Invalid or expired token'
        }
    },
    computed: {
        isLoading() {
            return this.loading || this.loadingCaptcha
        },
    },
    methods: {
        ...mapMutations({
            confirmed2FA: 'ui/confirmed2FA',
        }),
        ...mapActions({
            openModal: 'ui/openModal',
            setToken: 'app/setToken',
        }),
        onInput(field, scope = 'resetForm') {
            if (this.$validator ? .flags ? .[field] ? .validated) {
                this.$validator.validate(`${scope}.${field}`)
            }
        },
        async onSubmit() {
            if (this.isLoading) {
                return
            }
            this.clearSubmitTimeout()
            const scope = this.enter2faStep ? 'fa2Form' : 'resetForm'
            if (await this.$validator.validateAll(scope)) {
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
                const result = await reset(this.token, this.password, this.key)
                this.setToken(result.token)
                this.$router.push({
                    name: DASHBOARD
                })
                if (this.enter2faStep) {
                    this.confirmed2FA()
                }
                this.text = 'Password successfully changed'
            } catch (e) {
                if (this.enter2faStep) {
                    this.parseError(e, 'fa2Form')
                    if (ErrorMatcher.is2FA(e)) {
                        this.key = ''
                    }
                } else {
                    if (ErrorMatcher.is2FA(e)) {
                        this.enter2faStep = true
                    } else if (ErrorMatcher.isServerError(e)) {
                        this.openSnackbar({
                            type: this.SnackTypes.FAILURE,
                            text: 'Password reset failed. Please try again.',
                        })
                    } else {
                        this.parseError(e)
                    }
                }
            } finally {
                this.loading = false
                this.loadingCaptcha = false
            }
        },
    },
}