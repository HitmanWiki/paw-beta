/* eslint-disable max-len */
import {
    mapActions,
    mapMutations
} from 'vuex'
import ErrorMatcher from '@/utils/ErrorMatcher'
import recaptchaMixin from '@/mixins/recaptchaMixin'
import responseMixin from '@/mixins/responseMixin'
import tfaMixin from '@/mixins/tfaMixin'
import {
    getOAuthLink
} from '@/utils-ts/strings'
import {
    BUTTON_BLUE_MEDIUM
} from '@/constants/button'
import {
    DASHBOARD
} from '@/constants-ts/routes'
import {
    USER_TYPE_CUSTOMER,
    USER_TYPE_FREELANCER,
    USER_TYPE_CUSTOMER_PERSON
} from '@/constants/user'
import {
    isActive as isActiveMetamask,
    getSignPhrase
} from '@/servicies/blockchain/metamask'
import {
    googleAnalyticsV2
} from '@/servicies-ts/analytics'

const LOGIN_ERROR_MSG = 'Incorrect credentials'

export default {
    name: 'lx-login-modal',
    mixins: [
        recaptchaMixin,
        responseMixin,
        tfaMixin,
    ],
    props: {
        fromType: String,
    },
    data() {
        return {
            BUTTON_BLUE_MEDIUM,
            email: '',
            password: '',
            loading: false,
            loadingCaptcha: false,
            loadingMetamaskCaptcha: false,
            loadingContinue: false,
            enter2faStep: false,
            selectAccountTypeStep: false,
            recaptchaTimeout: null,
            metamaskProcessing: false,
            signData: null,
            isFreelancer: true,
            firstName: '',
            lastName: '',
        }
    },
    beforeDestroy() {
        if (this.recaptchaTimeout) {
            clearTimeout(this.recaptchaTimeout)
        }
    },
    computed: {
        isLoading() {
            return this.loading || this.loadingCaptcha
        },
        isMetamaskLoading() {
            return this.metamaskProcessing || this.loadingMetamaskCaptcha
        },
    },
    methods: {
        getOAuthLink,
        ...mapMutations({
            confirmed2FA: 'ui/confirmed2FA',
        }),
        ...mapActions({
            login: 'app/login',
            cryptoLogin: 'app/cryptoLogin',
            openModal: 'ui/openModal',
        }),
        completeLogin() {
            if (this.enter2faStep) {
                this.confirmed2FA()
            }
            const redirect = this.$route.query.redirect
            if (redirect) {
                const route = this.$router.resolve(redirect)
                if (route.route ? .meta ? .requiresAuth) {
                    this.$router.push({
                        path: redirect
                    })
                } else {
                    this.$router.push({
                        name: DASHBOARD
                    })
                }
            } else {
                this.$router.push({
                    name: DASHBOARD
                })
            }
            this.$emit('close')
            if (this.selectAccountTypeStep && this.isFreelancer) {
                this.openModal({
                    component: 'lx-lazy-modal',
                    props: {
                        factory: import ( /* webpackChunkName: "welcome-modal" */ '@/modals/WelcomeModal/WelcomeModal.vue'),
                        title: 'Welcome to LaborX!',
                        props: {
                            activeRole: this.isFreelancer ? USER_TYPE_FREELANCER : USER_TYPE_CUSTOMER,
                        }
                    }
                })
            }
        },
        async singIn() {
            try {
                this.loading = true
                await this.login({
                    email: this.email,
                    password: this.password,
                    key: this.key,
                    reCaptcha: this.captchaCode
                })
            } finally {
                this.loading = false
            }
        },
        onInput(field, scope = 'loginForm') {
            if (this.$validator ? .flags ? .[field] ? .validated) {
                this.$validator.validate(`${scope}.${field}`)
            }
        },
        async validateForm() {
            if (this.metamaskProcessing) {
                if (this.enter2faStep) {
                    return this.$validator.validateAll('fa2Form')
                } else {
                    return true
                }
            } else {
                let scope = 'loginForm'
                if (this.enter2faStep) {
                    scope = 'fa2Form'
                } else if (this.selectAccountTypeStep) {
                    scope = 'roleSwitchForm'
                }
                return this.$validator.validateScopes(scope)
            }
        },
        async onSubmit() {
            if (this.isLoading) {
                return
            }
            this.clearSubmitTimeout()
            if (await this.validateForm()) {
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
                this.captchaCode = reCaptcha
                if (this.selectAccountTypeStep) {
                    this.loadingContinue = true
                    await this.cryptoLogin({
                        ...this.signData,
                        accountType: this.isFreelancer ? USER_TYPE_FREELANCER : USER_TYPE_CUSTOMER,
                        firstName: this.firstName.trim(),
                        lastName: this.lastName.trim(),
                        employerType: USER_TYPE_CUSTOMER_PERSON,
                        key: this.key,
                        reCaptcha
                    })
                } else if (this.metamaskProcessing) {
                    await this.cryptoLogin({ ...this.signData,
                        key: this.key,
                        reCaptcha
                    })
                } else {
                    await this.singIn()
                }
                let analyticParams = {
                    event: 'auth-success',
                    name: this.metamaskProcessing ? 'metamask' : 'email',
                    'event-content': '',
                }
                if (this.$route.query.createGigFrom === 'gig') {
                    analyticParams['event-content'] = 'add-gig-from-another-gig'
                } else if (this.fromType === 'header') {
                    analyticParams['event-content'] = 'header'
                } else if (this.fromType === 'anotherJob') {
                    analyticParams['event-content'] = 'from-job'
                } else if (this.fromType === 'fromJob') {
                    analyticParams['event-content'] = 'add-job-from-another-job'
                } else if (this.fromType === 'landing-copy') {
                    analyticParams = {
                        event: 'new-lp-1-auth-success'
                    }
                }
                googleAnalyticsV2.send(analyticParams)
                this.completeLogin()
            } catch (e) {
                if (this.enter2faStep) {
                    this.parseError(e, 'fa2Form')
                    if (ErrorMatcher.is2FA(e)) {
                        this.key = ''
                    }
                } else {
                    if (ErrorMatcher.is2FA(e)) {
                        this.enter2faStep = true
                    } else {
                        this.metamaskProcessing = false
                        const validation = e.response ? .data ? .validation
                        if (validation) {
                            const validateError = validation.login ? .[0] || validation.address ? .[0] || ''
                            if (validateError.includes('User is banned')) {
                                this.$emit('close')
                                this.openModal({
                                    component: 'lx-lazy-modal',
                                    props: {
                                        factory: import ( /* webpackChunkName: "settings-modals" */ '@/modals/YouBlockedModal/YouBlockedModal.vue'),
                                    }
                                })
                            } else if (validation.accountType) {
                                this.selectAccountTypeStep = true
                            } else {
                                this.errors.add({
                                    field: 'loginForm.login',
                                    msg: LOGIN_ERROR_MSG
                                })
                                this.errors.add({
                                    field: 'loginForm.password',
                                    msg: LOGIN_ERROR_MSG
                                })
                            }
                        } else {
                            this.parseError(e)
                        }
                    }
                }
            } finally {
                this.loadingContinue = false
                this.loadingCaptcha = false
                this.metamaskCaptcha = false
            }
        },
        async onClickMetamask() {
            try {
                this.metamaskProcessing = true
                if (!isActiveMetamask()) {
                    this.openModal({
                        component: 'lx-composite-modal',
                        props: {
                            title: 'Metamask not installed',
                            text: `To continue, you need to install and configure
              <a class="lx-link" href="https://metamask.io" target="_blank" rel="nofollow noopener">Metamask</a>
              ${this.isTabletLx ? '<br><br>If you have Meta Mask mobile application installed, please go to the application and use Browser feature' : ''}`,
                            onClose: () => {
                                this.metamaskProcessing = false
                            }
                        }
                    })
                    return
                }
                this.signData = await getSignPhrase()
                this.loadingMetamaskCaptcha = true
                this.executeRecaptcha(this.onVerify)
                this.recaptchaTimeout = setTimeout(() => {
                    this.loadingMetamaskCaptcha = false
                }, 3000)
            } catch (e) {
                this.metamaskProcessing = false
                throw e
            }
        },
        onResend() {
            this.$emit('close')
            this.openModal({
                component: 'lx-resend-modal'
            })
        },

        onForgot() {
            this.$emit('close')
            this.openModal({
                component: 'lx-forgot-modal'
            })
        },
        clickToLink(e) {
            if (this.isLoading || this.isMetamaskLoading) {
                e.preventDefault()
                e.stopPropagation()
            }
        },
        onClickGoogle(e) {
            if (this.isLoading || this.isMetamaskLoading) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            if (this.fromType === 'landing-copy') {
                googleAnalyticsV2.send({
                    event: 'new-lp-1-auth-success'
                })
            } else {
                const analyticParams = {
                    event: 'auth-success',
                    name: 'gmail',
                    'event-content': '',
                }
                if (this.$route.query.createGigFrom === 'gig') {
                    analyticParams['event-content'] = 'add-gig-from-another-gig'
                } else if (this.fromType === 'header') {
                    analyticParams['event-content'] = 'header'
                } else if (this.fromType === 'anotherJob') {
                    analyticParams['event-content'] = 'from-job'
                } else if (this.fromType === 'fromJob') {
                    analyticParams['event-content'] = 'add-job-from-another-job'
                }
                googleAnalyticsV2.send(analyticParams)
            }
        },
        onClickSignUp() {
            this.$emit('close')
            this.openModal({
                component: 'lx-sign-up-modal',
                props: {
                    fromType: this.fromType,
                }
            })
        }
    },
}