import Vue, { PropType } from 'vue'
import { Roles } from '@/constants-ts/user/roles'

export default Vue.extend({
  props: {
    value: Number as PropType<typeof Roles.FREELANCER | typeof Roles.CUSTOMER>,
  },
  data () {
    return {
      Roles,
    }
  },
  methods: {
    onTypeClick (type: number) {
      this.$emit('input', type)
    },
  }
})
