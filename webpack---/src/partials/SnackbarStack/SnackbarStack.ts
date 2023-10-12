import Vue from 'vue'
import SnackModel from '@/models-ts/Snack'
import snackMixin from '@/mixins/snackMixin'
import Snack from './Snack/Snack.vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-snackbar-stack-new',
  mixins: [snackMixin],
  components: {
    Snack
  },
  methods: {
    onSnackBeforeLeave (el: HTMLDivElement) {
      el.style.width = `${el.clientWidth}px`
      this.$el.style.minWidth = `${el.clientWidth}px`
      el.style.position = 'absolute'
    },
    onSnackAfterLeave () {
      this.$el.style.minWidth = ''
    },
    onCloseSnack (snack: SnackModel) {
      this.deleteSnackbar(snack.id)
    }
  },
})
