import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import { POST_A_JOB, JOB_ADD, JOB_EDIT, VACANCY_ADD, VACANCY_EDIT } from '@/constants-ts/routes'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import SidePanel from '@/partials/SidePanel/SidePanel.vue'
import responseMixin from '@/mixins/responseMixin'

export default Vue.extend<any, any, any, any>({
  mixins: [responseMixin],
  props: {
    fullWidth: Boolean,
  },
  components: {
    LxHeader,
    SidePanel,
  },
  computed: {
    ...mapState({
      isLoaded: (state: any) => state.user?.profile?.isLoaded,
      roleChanging: (state: any) => state.user?.roleChanging,
    }),
    hasSidePanel () {
      return ![POST_A_JOB, JOB_ADD, JOB_EDIT].includes(this.$route.name)
    }
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
