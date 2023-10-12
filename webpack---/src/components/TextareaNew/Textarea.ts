import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-textarea-new',
  props: {
    loading: Boolean,
    value: String,
    label: String,
    required: Boolean,
    max: Number,
    errorMsg: String,
    errStatic: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      val: '',
    }
  },
  watch: {
    value: {
      handler () {
        if (this.max) {
          this.val = (this.value || '').slice(0, this.max)
        }
        this.val = (this.value || '')
      },
      immediate: true,
    },
  },
  computed: {
    hasError () {
      return !!this.errorMsg
    },
  },
  methods: {
    onInput (e: Event) {
      this.val = (e.target as HTMLInputElement).value
      if (this.max) {
        this.val = this.val.slice(0, this.max)
      }
      this.$emit('input', this.val)
    },
  },
})
