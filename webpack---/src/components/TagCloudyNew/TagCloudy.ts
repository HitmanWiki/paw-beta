import Vue, { PropType } from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-tag-cloudy-new',
  props: {
    tags: Array as PropType<Array<CloudyTag>>,
    deletable: Boolean,
    max: [String, Number],
    slice: [String, Number],
    hasSliceLbl: Boolean,
    expandable: Boolean,
    errorMsg: String,
    errStatic: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      expandend: false,
    }
  },
  computed: {
    tagsLimited () {
      return this.max ? this.tags.slice(0, this.max) : this.tags
    },
    items () {
      return this.expandend ? this.tagsLimited : this.tagsLimited.slice(0, this.slice)
    },
    sliced () {
      return this.expandable && this.items.length < this.tags.length
    },
    sliceLbl () {
      const hasLbl = this.hasSliceLbl && this.slice && !this.expandable
      return hasLbl && (this.tags.length > this.slice) && (this.tags.length - this.slice)
    }
  },
  methods: {
    onDelete (tag: CloudyTag, index: number) {
      this.$emit('delete', { tag, index })
    },
    onClick (tag: CloudyTag, index: number) {
      this.$emit('click', { tag, index })
    },
  },
})
