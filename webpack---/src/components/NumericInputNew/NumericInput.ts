import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-numeric-input-new',
  inject: ['$validator'],
  props: {
    error: Boolean,
    type: String,
    label: String,
    prefixText: {
      type: String
    },
    suffixText: {
      type: String
    },
    precision: {
      type: Number,
      default: 2,
    },
    value: [String, Number],
    errorMsg: String,
    required: Boolean,
    loading: Boolean,
  },
  data () {
    return {
      focused: false,
    }
  },
  computed: {
    hasError () {
      return !!this.errorMsg || this.error
    },
    inputType () {
      if (this.type) {
        return this.type
      }
      return this.isMobileLx ? 'number' : 'string'
    },
  },
})
