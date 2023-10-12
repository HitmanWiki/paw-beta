// @ts-ignore
import NoSsr from 'vue-no-ssr'
import Vue from 'vue'
import rolebleMixin from '@/mixins/rolebleMixin'
import {
  BROWSE_JOBS,
  POST_A_JOB,
  SERVICES,
  VACANCIES,
} from '@/constants-ts/routes'

export default Vue.extend({
  name: 'lx-not-found',
  mixins: [rolebleMixin],
  components: {
    NoSsr,
  },
  data () {
    return {
      BROWSE_JOBS,
      POST_A_JOB,
      SERVICES,
      VACANCIES,
    }
  },
})
