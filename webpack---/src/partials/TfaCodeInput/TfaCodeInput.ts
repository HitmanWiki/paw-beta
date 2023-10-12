import Vue from 'vue'
import times from 'lodash/times'

export default Vue.extend<any, any, any, any>({
  props: {
    value: String,
    disabled: Boolean,
    withDivider: Boolean,
    errorMsg: String,
    autofocus: Boolean,
  },
  data () {
    return {
      keys: times(6, () => ''),
      inputHandlers: times(6, () => null)
    }
  },
  watch: {
    value () {
      if (!this.value) {
        this.keys = times(6, () => '')
        this.$nextTick(() => {
          const firstInput = this.getInputByIndex(0)
          firstInput?.focus()
        })
      }
    },
    keys () {
      this.$emit('input', this.keys.join(''))
      if (this.keys.length === 6) {
        this.$emit('filled')
      }
    },
  },
  mounted () {
    for (let i = 0; i < 6; i++) {
      const inputEl = this.getInputByIndex(i)
      if (inputEl) {
        const hadnler = this.getBackSpaceDownHandler(i)
        inputEl.addEventListener('keydown', hadnler)
        this.inputHandlers[i] = hadnler
      }
    }
  },
  beforeDestroy () {
    for (let i = 0; i < 6; i++) {
      const inputEl = this.getInputByIndex(i)
      if (inputEl && this.inputHandlers[i]) {
        inputEl.removeEventListener('keydown', this.inputHandlers[i])
      }
    }
  },
  methods: {
    getInputByIndex (i: number) {
      const inputRef = this.$refs[`input${i}`]
      const input = Array.isArray(inputRef) ? inputRef[0] : inputRef
      if (input) {
        return input.$el.querySelector('input')
      }
    },
    onBackspace (i: number, input: HTMLInputElement, e: KeyboardEvent) {
      if (i > 0 && this.keys[i] === '') {
        const prevInput = this.getInputByIndex(i - 1)
        prevInput?.focus()
      }
      this.keys.splice(i, 1, '')
      input.value = ''
      e.preventDefault()
      e.stopPropagation()
    },
    onArrowLeft (i: number) {
      if (i > 0) {
        const prevInput = this.getInputByIndex(i - 1)
        prevInput?.focus()
        if (prevInput?.value?.length) {
          setInterval(() => {
            prevInput?.setSelectionRange(0, prevInput?.value?.length)
          }, 0)
        }
      }
    },
    onArrowRight (i: number) {
      if (i < 5) {
        const nextInput = this.getInputByIndex(i + 1)
        nextInput?.focus()
        if (nextInput?.value?.length) {
          setInterval(() => {
            nextInput?.setSelectionRange(0, nextInput?.value?.length)
          }, 0)
        }
      }
    },
    getBackSpaceDownHandler (i: number) {
      const input = this.getInputByIndex(i)
      if (input) {
        return (e: KeyboardEvent) => {
          switch (e.key) {
            case 'Backspace': return this.onBackspace(i, input, e)
            case 'ArrowLeft': return this.onArrowLeft(i, input, e)
            case 'ArrowRight': return this.onArrowRight(i, input, e)
          }
        }
      }
    },
    onFocus (e: FocusEvent) {
      const target = e.target as HTMLInputElement
      if (target) {
        target.setSelectionRange(0, target.value.length)
      }
    },
    onCodeInput (i: number) {
      if (i < 6 && this.keys[i] !== '') {
        const nextInputRef = this.$refs[`input${i + 1}`]
        const input = Array.isArray(nextInputRef) ? nextInputRef[0] : nextInputRef
        if (input) {
          const inputEl = input.$el.querySelector('input')
          inputEl?.focus()
        }
      }
    },
  },
})
