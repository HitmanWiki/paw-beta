import NoSsr from 'vue-no-ssr'
import {
    mapState,
    mapMutations,
    mapActions,
    mapGetters
} from 'vuex'
import {
    googleAnalyticsV2
} from '@/servicies-ts/analytics'
import {
    Roles
} from '@/constants-ts/user/roles'
import ModalStack from '@/partials/ModalStack/ModalStack.vue'
import NotFound from '@/partials/NotFound/NotFound.vue'
import SnackbarStack from '@/partials/SnackbarStack/SnackbarStack.vue'
import Support from '@/partials/Support/Support.vue'
import logRocket from '@/servicies-ts/LogRocket'
import lxAnalytics from '@/servicies-ts/analytics/LxAnalytics'
import rolebleMixin from '@/mixins/rolebleMixin'
import {
    DASHBOARD,
    LANDING,
    NOT_FOUND,
} from '@/constants-ts/routes'
import {
    PrivateLayout,
    PrivateLayoutNew,
    PublicLayout,
    PublicLayoutNew
} from '@/layouts'
import sentryClient from './servicies-ts/SentryClient'

import ( /* webpackChunkName: "lx-analytics" */ '@/servicies-ts/analytics/analytics')

export default {
    name: 'App',
    mixins: [rolebleMixin],
    components: {
        NotFound,
        NoSsr,
        PrivateLayout,
        PrivateLayoutNew,
        PublicLayout,
        PublicLayoutNew,
        ModalStack,
        SnackbarStack,
        Support,
    },
    metaInfo() {
        const link = []
        const meta = []
        if (Object.keys(this.$route.query).length) {
            link.push({
                vmid: 'canonical',
                rel: 'canonical',
                href: process.env.VUE_APP_FRONTEND_URL + this.$route.path
            })
        }
        if (this.$route.meta.withoutLayout || this.$route.meta.requireNoAuth) {
            meta.push({
                vmid: 'og:url',
                property: 'og:url',
                content: process.env.VUE_APP_FRONTEND_URL + this.$route.path
            })
            meta.push({
                vmid: 'og:site_name',
                property: 'og:site_name',
                content: 'LaborX'
            })
        }
        return {
            title: this.notFound ? 'Not Found' : 'Loading',
            titleTemplate: '%s | LaborX',
            link,
            meta,
        }
    },
    data() {
        return {
            notFound: false,
        }
    },
    async mounted() {
        console.timeEnd('init')
        console.info('version', process.env.VUE_APP_VERSION)
        this.initNotFound()
        if (this.$route.query.contest && !this.isLoggedIn) {
            this.setContest(this.$route.query.contest)
        }
        if (this.$route.query.ref) {
            this.$store.commit('user/setReferrerId', this.$route.query.ref)
        }
        this.$store.commit('user/setUtmMetrics', this.$route.query)
        if (this.$route.query.account_type && ['customer', 'freelancer'].indexOf(this.$route.query.account_type) !== -1) {
            this.$store.commit('ui/setAccountType', this.$route.query.account_type)
        }
        // this.scamAlert()
        if (this.isLoggedIn) {
            logRocket.init(this.userId)
        }
        this.initializeAnalytics()
    },
    computed: {
        ...mapState({
            isLoggedIn: state => state.app.authorized,
            isLoaded: state => state.user ? .profile.isLoaded,
            userId: state => state.user ? .id,
            countCompletedJobs: state => state.user ? .countCompletedJobs,
            countPaidJobs: state => state.user ? .countPaidJobs,
            redirect: state => state.app.redirect,
            activeRole: state => state.user ? .activeRole,
            authorized: state => state.app ? .authorized,
            profiles: state => state.user ? .profiles,
            customerType: state => state.user ? .customerType,
            chatConnected: state => state.chatNew ? .connected,
            isNotFound: state => state.app.notFound,
        }),
        ...mapGetters({
            tokenInfo: 'user/tokenInfo',
        }),
        layout() {
            if (this.$route.meta.withoutLayout) {
                return 'div'
            }
            const layout = typeof this.$route.meta.layout === 'function' ? this.$route.meta.layout(this.isLoggedIn) : this.$route.meta.layout
            switch (layout) {
                case 'public':
                    {
                        return PublicLayout
                    }
                case 'public-new':
                    {
                        return PublicLayoutNew
                    }
                case 'private-new':
                    {
                        return PrivateLayoutNew
                    }
            }
            if (this.$route.matched.some(record => record.meta.requiresAuth) && this.isLoggedIn) {
                return PrivateLayout
            }
            if (this.$route.meta.requireNoAuth) {
                return PublicLayout
            }
            return this.isLoggedIn ? PrivateLayout : PublicLayout
        },
        inPublic() {
            return ![PrivateLayoutNew, PrivateLayout].includes(this.layout)
        },
        inPrivate() {
            return this.layout === PrivateLayout
        },
    },
    watch: {
        isLoaded() {
            this.checkAccessibility()
            if (this.isLoaded && !this.chatConnected) {
                this.initChat()
            }
        },
        activeRole() {
            this.checkAccessibility()
            this.initializeAnalytics()
            if (this.chatConnected) {
                this.destroyChat()
            }
            if (this.activeRole) {
                this.initChat()
            }
        },
        inPublic() {
            if (this.inPublic && this.$route.matched.some(record => record.meta.requiresAuth)) {
                this.$router.push({
                    name: LANDING
                }).catch(() => {})
            }
        },
        isNotFound() {
            this.initNotFound()
        },
        $route: {
            handler() {
                this.initNotFound()
                if (this.notFound) {
                    this.setNotFound(false)
                }
                if (this.redirect) {
                    this.setRedirect('')
                }
                this.checkAccessibility()
            }
        },
        userId() {
            this.initializeAnalytics()
        },
        countCompletedJobs() {
            this.initializeAnalytics()
        },
        countPaidJobs() {
            this.initializeAnalytics()
        },
        authorized(newVal, oldVal) {
            this.initializeAnalytics()
            if (oldVal && !newVal) {
                this.destroyChat()
            }
        },
        profiles() {
            this.initializeAnalytics()
        },
        customerType() {
            this.initializeAnalytics()
        },
        chatConnected: {
            handler() {
                if (this.chatConnected) {
                    this.initChatRooms()
                    this.getUnreadMessagesCount()
                }
            },
            immediate: true
        },
        '$errorHandler.error' () {
            sentryClient.capture(this.$errorHandler.error)
        },
    },
    methods: {
        ...mapActions({
            openModal: 'ui/openModal',
            initChat: 'chatNew/init',
            destroyChat: 'chatNew/destroy',
            initChatRooms: 'chatNew/initRooms',
            getUnreadMessagesCount: 'chatNew/getUnreadMessagesCount',
        }),
        ...mapMutations({
            setNotFound: 'app/setNotFound',
            setRedirect: 'app/setRedirect',
            setContest: 'user/setContest',
        }),
        checkAccessibility() {
            const getRedirectRoute = () => this.$route.meta.redirectRoute || DASHBOARD
            if (this.isLoggedIn) {
                if (this.$route.meta.requiresFreelancer && !this.isFreelancer) {
                    this.$router.push({
                        name: getRedirectRoute()
                    })
                }
                if (this.$route.meta.requiresCustomer && !this.isCustomer) {
                    this.$router.push({
                        name: getRedirectRoute()
                    })
                }
            }
        },
        scamAlert() {
            if ((document.referrer || '').includes('laborx.network')) {
                this.openModal({
                    component: 'lx-scam-alert-modal',
                })
            }
        },
        initializeAnalytics() {
            const userid = this.userId || this.tokenInfo ? .user_id
            let activeRole = this.activeRole
            if (!activeRole && this.tokenInfo) {
                activeRole = this.tokenInfo.active_profile === Roles.FREELANCER ?
                    'talent' :
                    'customer'
            }
            googleAnalyticsV2.initializeState({
                authorized: this.authorized,
                userid,
                profiles: this.profiles,
                activeRole,
                customerType: this.customerType,
                countCompletedJobs: this.countCompletedJobs,
                countPaidJobs: this.countPaidJobs,
            })
            lxAnalytics.setUserId(this.userId)
            lxAnalytics.setRole(this.activeRole)
        },
        initNotFound() {
            this.notFound = !!(this.isNotFound || this.$route.name === NOT_FOUND)
        },
    },
}