import Vue from 'vue'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import Snack from '@/models-ts/Snack'

export default Vue.extend<any, any, any, any>({
  props: {
    snack: Snack,
  },
  data () {
    return {
      SnackTypes,
    }
  },
  computed: {
    icon () {
      switch (this.snack.type) {
        case SnackTypes.FAILURE:
          return 'alert-circle'
        case SnackTypes.SUCCESS:
        default:
          return 'check-circle'
      }
    },
    closable () {
      return this.snack.closable ||
        this.snack.type === SnackTypes.LOADING_WITH_CLOSE ||
        this.snack.type === SnackTypes.LOADING
    },
  },
  methods: {
    onCloseSnack () {
      if (this.snack.onCloseCb) {
        this.snack.onCloseCb()
      }
      this.$emit('close', this.snack)
    }
  }
})
