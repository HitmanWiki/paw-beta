import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-icon-button',
  props: {
    disabled: Boolean,
    loading: Boolean,
    to: Object,
    icon: String,
    size: [String, Number],
  },
  computed: {
    tag () {
      if (this.to) {
        return 'router-link'
      }
      if (this.$attrs.href) {
        return 'a'
      }
      return 'button'
    },
  },
  methods: {
    onClick (e: Event) {
      this.$el.blur()
      if (!this.loading) {
        this.$emit('click', e)
      } else {
        e.preventDefault()
      }
    },
  }
})
