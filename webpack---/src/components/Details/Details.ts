import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-details',
  props: {
    hideOnMobile: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    open: {
      type: Boolean,
      default: true,
    }
  },
  data () {
    return {
      initStyle: {},
      isOpen: true,
      contentHeight: 0,
    }
  },
  watch: {
    isMobileLx: {
      handler () {
        if (this.hideOnMobile && this.isMobileLx && this.active) {
          this.isOpen = false
        } else {
          this.isOpen = true
        }
      },
      immediate: true,
    },
    open: {
      handler () {
        this.isOpen = this.open
      },
      immediate: true,
    },
  },
  methods: {
    onClickSummary () {
      if (this.active) {
        this.isOpen = !this.isOpen
      }
    },
    expandFrom (el: HTMLElement) {
      el.style.height = '0'
      el.style.overflow = 'hidden'
    },
    expandTo (el: HTMLElement) {
      el.style.height = `${this.$refs.content.clientHeight}px`
    },
    afterEnter (el: HTMLElement) {
      el.style.overflow = ''
      el.style.height = ''
    },
    leave (el: HTMLElement) {
      setTimeout(() => this.expandFrom(el), 0)
    },
  },
})
