import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-link',
  props: {
    arrow: Boolean,
    to: Object,
  },
  computed: {
    tag () {
      if (this.to) {
        return 'router-link'
      }
      if (this.$attrs.href) {
        return 'a'
      }
      return 'div'
    },
  }
})
