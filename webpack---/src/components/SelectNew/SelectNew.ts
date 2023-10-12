import Vue, { PropType } from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-select-new',
  props: {
    placeholder: String,
    options: {
      type: Array as PropType<Array<{}>>,
      default: []
    },
    value: [String, Number, Array],
    loading: Boolean,
    disabled: Boolean,
    errorMsg: String,
    errStatic: {
      type: Boolean,
      default: true
    },
    distance: {
      type: String,
      default: '20',
    },
    bodyClass: [String, Array],
    multiply: Boolean,
  },
  data () {
    return {
      opened: false,
    }
  },
  computed: {
    hasError () {
      return !!this.errorMsg
    },
    selectedOption () {
      if (this.value) {
        return this.multiply
          ? this.options.filter((opt: any) => this.value.find((val: any) => val === opt.key))
          : this.options.find((opt: any) => opt.key === this.value)
      }
      return this.multiply ? [] : null
    }
  },
  methods: {
    onShow () {
      this.opened = true
    },
    onHide () {
      this.opened = false
    },
    isSelected (option: any) {
      return this.multiply
        ? this.selectedOption.some((opt: any) => opt.key === option.key)
        : option.key === this.value
    },
    onOptionClick (option: any) {
      if (this.multiply) {
        const options = this.selectedOption.map((opt: any) => opt.key)
        if (this.isSelected(option)) {
          this.$emit('input', options.filter((opt: any) => opt !== option.key))
        } else {
          this.$emit('input', options.concat(option.key))
        }
      } else {
        this.$emit('input', option.key)
      }
    },
  },
})
