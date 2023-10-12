export default {
  name: 'lx-hex-address',
  props: {
    value: String,
  },
  data () {
    return {
      range: null,
    }
  },
  mounted (this: any) {
    this.range = document.createRange()
    this.range.selectNode(this.$el)
  },
  methods: {
    onClick (event: MouseEvent) {
      if (event.detail === 3) {
        this.selectContent()
      }
    },
    onDblClick () {
      this.selectContent()
    },
    selectContent (this: any) {
      const selection = window.getSelection()
      selection?.removeAllRanges?.()
      selection?.addRange?.(this.range)
    }
  }
}
