import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-rating-new',
  props: {
    active: Boolean,
    value: {
      type: [Number, String],
      default: 0
    },
  },
  data () {
    return {
      hovered: null,
    }
  },
  computed: {
    valueNum () {
      return Number(this.value)
    },
    fractionIndex () {
      if (!this.active && this.valueNum % 1) {
        return Math.ceil(this.valueNum)
      }
    },
  },
  methods: {
    onClickStar (val: number) {
      if (this.active) {
        this.$emit('input', this.valueNum === val ? 0 : val)
      }
    },
    onMouseOver (i: number) {
      if (this.active) {
        this.hovered = i
      }
    },
    onMouseLeave () {
      if (this.active) {
        this.hovered = null
      }
    },
  }
})
