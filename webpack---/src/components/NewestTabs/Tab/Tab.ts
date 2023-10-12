import Vue, { PropType } from 'vue'
import { RawLocation } from 'vue-router'

export default Vue.extend<any, any, any, any>({
  name: 'lx-newest-tab',
  props: {
    index: Number,
    value: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: String,
    to: {} as PropType<RawLocation>,
  },
  data () {
    return {
      wasMounted: false,
    }
  },
  computed: {
    visible () {
      if (this.to) {
        return this.$parent.activeTab === this.value
      }
      return !this.$parent.lazy || this.$parent.activeTab === this.value || this.wasMounted
    }
  },
  watch: {
    '$parent.activeTab': {
      handler (value) {
        if (value === this.value) {
          this.wasMounted = true
        }
      }
    }
  },
  mounted () {
    if (this.$parent.activeTab === this.value) {
      this.wasMounted = true
    }
  },
  methods: {
    beforeEnterTab (el: HTMLElement) {
      this.setParentSize(el.clientWidth, el.clientHeight)
    },
    beforeLeaveTab (el: HTMLElement) {
      this.setParentSize(el.clientWidth, el.clientHeight)
    },
    afterLeaveTab () {
      this.setParentSize()
    },
    setParentSize (width: number, height: number) {
      const parentStyle = this.$el.parentElement.style
      parentStyle.minWidth = width ? `${width}px` : ''
      parentStyle.minHeight = height ? `${Math.max(this.$el.parentElement.clientHeight, height)}px` : ''
    }
  }
})
