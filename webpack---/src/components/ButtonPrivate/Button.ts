import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-button-private',
  props: {
    loading: Boolean,
    disabled: Boolean,
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
      return 'button'
    },
    btnDisabled () {
      return this.loading || this.disabled
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
