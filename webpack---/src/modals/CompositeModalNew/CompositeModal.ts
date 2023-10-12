import Vue, { PropType } from 'vue'
import Button from '@/models-ts/ui/Button'

export default Vue.extend<any, any, any, any>({
  name: 'lx-composite-modal-new',
  props: {
    title: String,
    text: String,
    buttons: {
      type: Array as PropType<Array<Button>>,
      default: []
    },
    onClose: {
      type: Function,
      default: () => {},
    }
  },
  data () {
    return {
      actionButtons: [],
    }
  },
  created () {
    this.actionButtons = this.buttons.map((btn: Button) => ({ ...btn, loading: false }))
  },
  methods: {
    async onClick (button: any) {
      try {
        button.loading = true
        await button.onClick()
        this.$emit('close')
      } finally {
        button.loading = false
      }
    }
  },
})
