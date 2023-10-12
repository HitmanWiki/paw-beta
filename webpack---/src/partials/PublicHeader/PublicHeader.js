import NoSsr from 'vue-no-ssr'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import {
    mapActions,
    mapState
} from 'vuex'
import * as buttons from '@/constants/button'
import {
    DASHBOARD,
    BLOG,
    BROWSE_JOBS,
    SERVICES,
    VACANCIES
} from '@/constants-ts/routes'
import {
    disablePageScroll,
    enablePageScroll
} from '@/utils/scrollLock'
import {
    googleAnalyticsV2
} from '@/servicies-ts/analytics'

export default {
    components: {
        NoSsr,
    },
    data() {
        return {
            menuOpen: false,
            isLoading: false,
            DASHBOARD,
            BLOG,
            BROWSE_JOBS,
            SERVICES,
            VACANCIES,
            buttons,
            pageLoaded: false,
        }
    },
    computed: {
        ...mapState({
            isLoggedIn: state => state.app.authorized,
        }),
        isLoggedInLazy() {
            return this.pageLoaded && this.isLoggedIn
        },
        hasModal() {
            return !!get(this.$store, 'state.ui.modalStack.length', 0)
        },
    },
    watch: {
        isTabletLx() {
            if (!this.isTabletLx) {
                this.menuOpen = false
            }
        },
        menuOpen() {
            if (this.menuOpen) {
                this.$nextTick(() => {
                    disablePageScroll()
                })
            } else {
                enablePageScroll()
            }
        },
        hasModal() {
            this.$nextTick(() => {
                if (this.hasModal) {
                    this.$el.style.position = 'absolute'
                    this.$el.style.top = `${window.pageYOffset}px`
                } else {
                    this.$el.style.position = 'fixed'
                    this.$el.style.top = 0
                }
            })
        }
    },
    mounted() {
        this.pageLoaded = true
        if (this.$route.query.redirect) {
            this.openLogin()
        }
        this.onScroll()
        window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll)
        enablePageScroll()
    },
    methods: {
        ...mapActions({
            openModal: 'ui/openModal',
            logout: 'app/logout',
        }),
        closeMenu() {
            this.menuOpen = false
        },
        openLogin() {
            this.closeMenu()
            this.openModal({
                component: 'lx-login-modal',
                id: 'lx-login-modal',
                props: {
                    fromType: 'header',
                }
            })
            googleAnalyticsV2.send({
                'event': 'login-button-click',
                'event-content': 'header'
            })
        },
        openSignUp() {
            this.closeMenu()
            this.openModal({
                component: 'lx-sign-up-modal',
                props: {
                    fromType: 'header',
                }
            })
            googleAnalyticsV2.send({
                'event': 'register-button-click',
                'event-content': 'header'
            })
        },
        async onLogout() {
            this.isLoading = true
            this.closeMenu()
            await this.logout().catch(e => console.error(e))
            this.isLoading = false
        },
        onClickMenu() {
            this.menuOpen = !this.menuOpen
            document.activeElement.blur()
        },
        onScroll: throttle(function() {
            const SHADOW_OFFSET = -15
            const step = Math.floor(window.pageYOffset / 4)
            if (window.pageYOffset > 15) {
                this.$el.classList.add('fixed')
            } else {
                this.$el.classList.remove('fixed')
            }
            this.$el.style.boxShadow = `5px ${Math.min(SHADOW_OFFSET + step, 5)}px 15px rgba(15, 36, 83, 0.07)`
        }, 10),
    }
}