import Vue from 'vue'
import { BROWSE_JOBS, SERVICES } from '@/constants-ts/routes'

export default Vue.extend({
  data () {
    return {
      BROWSE_JOBS,
      SERVICES,
    }
  }
})
