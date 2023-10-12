import Vue from 'vue'
import Multiselect from 'vue-multiselect'
// @ts-ignore
import NoSsr from 'vue-no-ssr'
import { SELECT_DEFAULT, SELECT_ROUNDED, SELECT_WHITE } from '@/constants/select'

export default Vue.extend<any, any, any, any>({
  name: 'lx-select-newest',
  components: { Multiselect, NoSsr },
  props: {
    defaultOption: Boolean,
    fixed: Boolean,
    selectLabel: String,
    label: String,
    loading: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    native: Boolean,
    placeholder: String,
    errorMsg: String,
    options: Array,
    searchable: Boolean,
    value: Object,
    required: Boolean,
  },
  data () {
    return {
      open: false,
      search: '',
      SELECT_DEFAULT,
      SELECT_ROUNDED,
      SELECT_WHITE,
      item: `<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1L5 5L9 1" stroke="black" stroke-width="1.5"/>
</svg>`
    }
  },
  computed: {
    showNative () {
      return this.native && !this.loading && !this.disabled && this.isTabletLx
    },
  },
  methods: {
    openSelect () {
      this.open = true
      if (this.$refs.select && this.fixed) {
        const rect = this.$refs.select.getBoundingClientRect()
        const top = rect.top + rect.height
        const left = rect.left
        const multiselect = this.$refs.select.querySelector('.multiselect__content-wrapper')
        multiselect.style.top = `${top}px`
        multiselect.style.left = `${left}px`
      }
    },
    onSearchChange (search: string) {
      this.search = search
      this.$emit('search-change', search)
    },
    onInput (selected: any) {
      if (selected?.readOnly) {
        return
      }
      this.$emit('input', selected)
    },
    onNativeInput (event: any) {
      this.$emit('input', this.options.find((opt: any) => opt[this.label] === event.target.value))
    },
    optionIsSelected (option: any) {
      if (this.value) {
        return option[this.label] === this.value[this.label]
      }
    },
  }
})
