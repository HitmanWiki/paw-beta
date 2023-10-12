// @ts-ignore
import NoSsr from 'vue-no-ssr'
import Vue from 'vue'
import rolebleMixin from '@/mixins/rolebleMixin'
import zendeskMixin from '@/mixins/zendeskMixin'
import {
  DASHBOARD,
  BROWSE_JOBS,
  MY_JOBS,
  SETTINGS,
  PREMIUM,
  REFERRALS,
  BROWSE_JOBS_BY_SKILL,
  SERVICES,
  SERVICE_MY,
  SERVICE_BY_SKILL,
  VACANCIES,
  VACANCIES_MY,
  WALLETS,
} from '@/constants-ts/routes'
import { Roles } from '@/constants-ts/user/roles'
import { mapGetters } from 'vuex'

export default Vue.extend<any, any, any, any>({
  mixins: [rolebleMixin, zendeskMixin],
  components: {
    NoSsr,
  },
  data () {
    return {
      DASHBOARD,
      BROWSE_JOBS,
      MY_JOBS,
      SETTINGS,
      PREMIUM,
      REFERRALS,
      BROWSE_JOBS_BY_SKILL,
      SERVICES,
      SERVICE_MY,
      SERVICE_BY_SKILL,
      VACANCIES,
      VACANCIES_MY,
      WALLETS,
    }
  },
  computed: {
    ...mapGetters({
      activeProfile: 'user/activeProfile',
    }),
    isFreelancer () {
      return this.activeProfile === Roles.FREELANCER
    },
    isBrowseVacancies () {
      return this.$route.name === VACANCIES
    },
    isBrowseJobs () {
      return [BROWSE_JOBS, BROWSE_JOBS_BY_SKILL].includes(this.$route.name)
    },
    isServices () {
      return [SERVICES, SERVICE_BY_SKILL].includes(this.$route.name)
    },
    isVacancies () {
      return this.$route.name === VACANCIES
    },
  },
  methods: {
    onClickSupport () {
      if (!this.isZendeskLoading) {
        this.openZendesk('My account')
      }
    },
  },
})
