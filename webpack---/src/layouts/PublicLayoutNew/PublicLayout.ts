import Vue from 'vue'
import PublicFooter from '@/partials/PublicFooter/PublicFooter.vue'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import SkillsMenu from '@/partials/SkillsMenu/SkillsMenu.vue'
import {
  BROWSE_JOBS,
  BROWSE_JOBS_BY_SKILL,
  FREELANCERS_LIST,
  FREELANCERS_LIST_BY_SKILL,
  SERVICES,
  SERVICE_BY_SKILL,
} from '@/constants-ts/routes'

export default Vue.extend({
  components: {
    PublicFooter,
    LxHeader,
    SkillsMenu,
  },
  props: {
    classes: String,
  },
  computed: {
    hasSkillsMenu (): boolean {
      return [
        BROWSE_JOBS,
        BROWSE_JOBS_BY_SKILL,
        SERVICES,
        SERVICE_BY_SKILL,
        FREELANCERS_LIST,
        FREELANCERS_LIST_BY_SKILL,
      ].includes(this.$route.name || '')
    },
  },
})
