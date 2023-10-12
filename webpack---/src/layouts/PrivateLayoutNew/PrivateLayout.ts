import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import {
  POST_A_JOB,
  JOB_ADD,
  JOB_EDIT,
  VACANCY_ADD,
  VACANCY_EDIT,
  BROWSE_JOBS,
  BROWSE_JOBS_BY_SKILL,
  SERVICES,
  SERVICE_BY_SKILL,
  FREELANCERS_LIST,
  FREELANCERS_LIST_BY_SKILL,
} from '@/constants-ts/routes'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import SidePanel from '@/partials/SidePanel/SidePanel.vue'
import responseMixin from '@/mixins/responseMixin'
import SkillsMenu from '@/partials/SkillsMenu/SkillsMenu.vue'

export default Vue.extend<any, any, any, any>({
  mixins: [responseMixin],
  components: {
    LxHeader,
    SidePanel,
    SkillsMenu,
  },
  props: {
    fullWidth: Boolean,
    classes: String,
  },
  computed: {
    ...mapState({
      isLoaded: (state: any) => state.user?.profile?.isLoaded,
      roleChanging: (state: any) => state.user?.roleChanging,
    }),
    hasSidePanel () {
      return ![POST_A_JOB, JOB_ADD, JOB_EDIT, VACANCY_ADD, VACANCY_EDIT].includes(this.$route.name)
    },
    hasSkillsMenu () {
      return [
        BROWSE_JOBS,
        BROWSE_JOBS_BY_SKILL,
        SERVICES,
        SERVICE_BY_SKILL,
        FREELANCERS_LIST,
        FREELANCERS_LIST_BY_SKILL,
      ].includes(this.$route.name)
    },
  },
  async mounted () {
    try {
      if (!this.isLoaded) {
        await Promise.all([this.getActiveRole(), this.getUserInfo()])
        await this.initialLoad()
      }
    } catch (e) {
      this.parseError(e)
    }
  },
  methods: {
    ...mapActions({
      getActiveRole: 'user/getActiveRole',
      getUserInfo: 'user/getUserInfo',
      initialLoad: 'pendingTxs/initialLoad',
    }),
  },
})
