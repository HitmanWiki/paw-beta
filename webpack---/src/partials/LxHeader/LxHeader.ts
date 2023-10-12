// @ts-ignore
import NoSsr from 'vue-no-ssr'
import Vue from 'vue'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import { mapActions, mapGetters, mapState } from 'vuex'
import {
  DASHBOARD,
  BLOG,
  BROWSE_JOBS,
  SERVICES,
  VACANCIES,
  JOB_ADD,
  BOOKMARKS,
  CHAT,
  USER_NOTIFICATIONS,
  PROFILE_SETTINGS,
  SETTINGS,
  SERVICE_BY_SKILL,
  BROWSE_JOBS_BY_SKILL,
  SERVICE_MY,
  MY_JOBS,
  VACANCIES_MY,
  WALLETS,
  PREMIUM,
  REFERRALS,
  LANDING,
  POST_A_JOB,
  SERVICE_ADD,
  SERVICE_EDIT,
  JOB_EDIT,
  VACANCY_ADD,
  VACANCY_EDIT,
  FREELANCERS_LIST,
  HIRE_LANDING,
} from '@/constants-ts/routes'
import { disablePageScroll, enablePageScroll } from '@/utils/scrollLock'
import { googleAnalyticsV2 } from '@/servicies-ts/analytics'
import { Roles } from '@/constants-ts/user/roles'
import responseMixin from '@/mixins/responseMixin'
import rolebleMixin from '@/mixins/rolebleMixin'
import zendeskMixin from '@/mixins/zendeskMixin'

export default Vue.extend<any, any, any, any>({
  mixins: [responseMixin, rolebleMixin, zendeskMixin],
  props: {
    withoutActions: Boolean,
  },
  components: {
    NoSsr,
  },
  data () {
    return {
      menuOpen: false,
      isLoading: false,
      DASHBOARD,
      JOB_ADD,
      BLOG,
      BROWSE_JOBS,
      SERVICES,
      VACANCIES,
      BOOKMARKS,
      USER_NOTIFICATIONS,
      CHAT,
      PROFILE_SETTINGS,
      SETTINGS,
      SERVICE_BY_SKILL,
      BROWSE_JOBS_BY_SKILL,
      SERVICE_MY,
      MY_JOBS,
      VACANCIES_MY,
      WALLETS,
      PREMIUM,
      REFERRALS,
      LANDING,
      POST_A_JOB,
      FREELANCERS_LIST,
      HIRE_LANDING,
      pageLoaded: false,
      scrolled: false,
      switching: false,
      isWorker: true,
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: (state: any) => state.app.authorized,
      unreadCount: (state: any) => state.notifications?.unreadCount || 0,
      chatInitialized: (state: any) => state.chatNew?.initialized,
      chatConnected: (state: any) => state.chatNew?.connected,
      unreadChatMsgMap: (state: any) => state.chatNew?.unreadMap || {},
      userId: (state: any) => state.user?.id,
      companyLogo: (state: any) => state.user?.companyLogo,
      avatar: (state: any) => state.user?.avatar,
      isProfileLoading: (state: any) => state.user?.profile.isLoading,
      type: (state: any) => state.user?.type,
      profiles: (state: any) => state.user?.profiles,
      customerIsNewbie: (state: any) => state.user?.customerIsNewbie,
    }),
    ...mapGetters({
      tokenInfo: 'user/tokenInfo',
      activeProfile: 'user/activeProfile'
    }),
    isCustomerFromToken () {
      return this.activeProfile === Roles.CUSTOMER
    },
    hasPostJobBtn () {
      const job_routes = [JOB_ADD, JOB_EDIT, VACANCY_ADD, VACANCY_EDIT, POST_A_JOB]
      const customerIsNewbie = this.$route.name === DASHBOARD && this.customerIsNewbie && this.isLoggedIn
      return !job_routes.includes(this.$route.name) && !customerIsNewbie
    },
    hasPostGigBtn () {
      const job_routes = [SERVICE_ADD, SERVICE_EDIT]
      return !job_routes.includes(this.$route.name)
    },
    hasPostBtnsSection () {
      return this.isFreelancer ? this.hasPostGigBtn : this.hasPostJobBtn
    },
    hasPostHeaderBtn () {
      return (!this.isProfileLoading || !this.isLoggedIn || this.tokenInfo) && this.hasPostBtnsSection
    },
    isPostJobBtn () {
      return (!this.activeRole || this.isCustomer) || (this.tokenInfo && this.isCustomerFromToken)
    },
    multipleRole () {
      return this.profiles[Roles.FREELANCER] && this.profiles[Roles.CUSTOMER]
    },
    isBrowsVacancies () {
      return this.$route.name === VACANCIES
    },
    isServices () {
      return [SERVICES, SERVICE_BY_SKILL].includes(this.$route.name)
    },
    isBrowseJobs () {
      return [BROWSE_JOBS, BROWSE_JOBS_BY_SKILL].includes(this.$route.name)
    },
    name () {
      return this.$store.getters['user/name']
    },
    avatarImage () {
      if (this.isCompanyCustomer && this.companyLogo) return this.companyLogo
      return this.avatar
    },
    isChangeRoleDisabled () {
      return this.switching || this.isProfileLoading
    },
    unreadMsgs () {
      const values: number[] = Object.values(this.unreadChatMsgMap)
      const unreadMsgs = values.reduce((acc: number, cur: number) => {
        return acc + cur
      }, 0)
      return unreadMsgs >= 99
        ? '99+'
        : unreadMsgs
    },
    isLoggedInLazy () { return this.pageLoaded && this.isLoggedIn },
    scrollThreshold () {
      return this.xsAndDown
        ? 10
        : 24
    },
    isPrivatePage () {
      if (this.$route.meta.withoutLayout) {
        return false
      }
      const layout = typeof this.$route.meta.layout === 'function' ? this.$route.meta.layout(this.isLoggedIn) : this.$route.meta.layout
      switch (layout) {
        case 'public':
        case 'public-new': {
          return false
        }
        case 'private-new': {
          return true
        }
      }
      if (this.$route.matched.some((record: any) => record.meta.requiresAuth) && this.isLoggedIn) {
        return true
      }
      if (this.$route.meta.requireNoAuth) {
        return false
      }
      return this.isLoggedIn
    },
    mainLink () {
      return this.isPrivatePage
        ? { name: DASHBOARD }
        : '/'
    },
    changeRoleLabel () {
      const firstPart = 'Change to'
      if (this.isWorker) {
        return `${firstPart} Customer`
      }
      return `${firstPart} Freelancer`
    },
    fullTimeOptions () {
      return [
        { route: HIRE_LANDING, routeLabel: 'Post a Job and Hire' },
        { route: FREELANCERS_LIST, routeLabel: 'Browse Talents' },
        { route: VACANCIES, routeLabel: 'Browse Vacancies' },
      ]
    }
  },
  watch: {
    isTabletLx () {
      if (!this.isTabletLx) {
        this.menuOpen = false
      }
    },
    menuOpen () {
      if (this.menuOpen) {
        this.$nextTick(() => {
          disablePageScroll()
        })
      } else {
        enablePageScroll()
      }
    },
    activeRole: {
      handler () {
        this.isWorker = this.activeRole === Roles.FREELANCER
      },
      immediate: true,
    },
  },
  mounted () {
    this.pageLoaded = true
    if (this.$route.query.redirect) {
      this.openLogin()
    }
    window.addEventListener('scroll', this.onScrollPage)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScrollPage)
    enablePageScroll()
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      logout: 'app/logout',
      switchRole: 'user/switchRole'
    }),
    closeMenu () {
      this.menuOpen = false
    },
    async onLogoutMobile () {
      await this.onLogout()
      this.onClickMenu()
    },
    onClickSupport () {
      if (!this.isZendeskLoading) {
        this.openZendesk('My account')
        this.onClickMenu()
      }
    },
    openLogin () {
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
    openSignUp () {
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
    async onLogout () {
      this.isLoading = true
      this.closeMenu()
      this.$router.push({ name: LANDING })
      await this.logout().catch((e: any) => console.error(e))
      this.isLoading = false
    },
    onClickWithCloseMenu () {
      if (this.menuOpen) {
        this.onClickMenu()
      }
    },
    onClickMenu () {
      this.menuOpen = !this.menuOpen
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    },
    onScrollPage: throttle(function (this: any) {
      this.scrolled = window.scrollY >= this.scrollThreshold
    }, 30),
    onCreateGigClick () {
      googleAnalyticsV2.send({
        event: 'click-on-button-create-gig-header',
      })
      this.$router.push({ name: SERVICE_ADD, query: { createGigFrom: 'profile' } }).catch(() => {})
    },
    onPostJobClick () {
      googleAnalyticsV2.send({
        event: 'post_job_button',
      })
      this.$router.push({ name: POST_A_JOB, query: { fromType: 'add-job-from-profile' } }).catch(() => {})
    },
    async onChangeRole () {
      if (!this.switching) {
        this.onClickWithCloseMenu()
        try {
          this.switching = true
          if (this.multipleRole) {
            const role = this.isWorker ? Roles.CUSTOMER : Roles.FREELANCER
            await this.switchRole(role)
            googleAnalyticsV2.send({
              event: 'change_role',
              'event-content': role === Roles.FREELANCER
                ? 'talent'
                : 'customer',
            })
          } else {
            this.openModal({
              component: 'lx-add-role-modal'
            })
          }
        } catch (e) {
          this.isWorker = this.activeRole === Roles.FREELANCER
          this.parseError(e)
        } finally {
          this.switching = false
        }
      }
    },
  }
})
