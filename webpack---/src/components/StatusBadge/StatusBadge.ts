import Vue from 'vue'

export default Vue.extend({
  name: 'lx-status-badge',
  props: {
    name: String,
    description: String,
    cssClass: String,
  },
})
