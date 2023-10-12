import VueTypes from 'vue-types'
import {
    mapActions,
    mapState,
    mapGetters,
    mapMutations
} from 'vuex'
import PublicHeader from '@/partials/PublicHeader/PublicHeader.vue'
import responseMixin from '@/mixins/responseMixin'
import {
    activate
} from '@/api/usersAndProfiles/auth'
import {
    DASHBOARD
} from '@/constants-ts/routes'
import {
    Roles
} from '@/constants-ts/user/roles'
import {
    googleAnalyticsV2
} from '@/servicies-ts/analytics'

export default {
    mixins: [responseMixin],
    components: {
        PublicHeader,
    },
    props: {
        token: String,
        type: VueTypes.oneOf(['sign-up', 'email', 'social'])
    },
    data() {
        return {
            processing: true,
            success: false,
        }
    },
    computed: {
        ...mapState({
            params: state => state.analytics.params,
            triggerCondition: state => state.analytics.triggerCondition,
        }),
        ...mapGetters({
            tokenInfo: 'user/tokenInfo',
        }),
        textRole() {
            switch (this.tokenInfo.active_profile) {
                case Roles.CUSTOMER:
                    {
                        return 'Customer'
                    }
                case Roles.JOB_SEEKER:
                    {
                        return 'Job seeker'
                    }
                case Roles.RECRUITER:
                    {
                        return 'Recruiter'
                    }
                default:
                    {
                        return 'Talent'
                    }
            }
        },
    },
    async mounted() {
        try {
            if (this.type === 'sign-up') {
                const result = await activate(this.token)
                const redirectUrl = result.redirect_url || DASHBOARD
                this.setToken(result.token)
                this.sendRegisterSuccess()
                this.redirect(redirectUrl)
                if (this.tokenInfo.active_profile !== Roles.CUSTOMER) {
                    this.openModal({
                        component: 'lx-lazy-modal',
                        props: {
                            factory: import ( /* webpackChunkName: "welcome-modal" */ '@/modals/WelcomeModal/WelcomeModal.vue'),
                            title: 'Welcome to LaborX!',
                            props: {
                                activeRole: this.tokenInfo.active_profile,
                            }
                        }
                    })
                }
            } else if (this.type === 'email') {
                await this.confirmEmail(this.token)
                this.redirect(DASHBOARD)
            } else if (this.type === 'social') {
                this.setToken(this.token)
                this.redirect(DASHBOARD)
            }
            this.success = true
        } catch (e) {
            console.error(e)
        } finally {
            this.processing = false
        }
    },
    methods: {
        ...mapActions({
            confirmEmail: 'user/confirmEmail',
            openModal: 'ui/openModal',
            setToken: 'app/setToken',
        }),
        ...mapMutations({
            resetTriggerCondition: 'analytics/resetTriggerCondition',
            resetParams: 'analytics/resetParams',
        }),
        sendRegisterSuccess() {
            const userid = this.tokenInfo ? .user_id
            const analyticsParams = {
                event: 'register-success',
                name: '',
                account: 'Y',
                role: this.textRole,
                'hit-role': this.textRole,
                'role-customer': '',
                'event-content': '',
                ...this.params,
                userid,
            }
            googleAnalyticsV2.send(analyticsParams)
            this.resetTriggerCondition()
            this.resetParams()
        },
        redirect(to) {
            setTimeout(() => {
                if (to === DASHBOARD) {
                    this.$router.push({
                        name: to
                    })
                } else {
                    const urlPart = to.split('/').slice(3).join('/')
                    this.$router.push(`/${urlPart}`)
                }
            }, 1000)
        }
    },
    metaInfo: {
        title: 'Confirmation',
        meta: [{
            vmid: 'robots',
            name: 'robots',
            content: 'noindex',
        }, ]
    },
}