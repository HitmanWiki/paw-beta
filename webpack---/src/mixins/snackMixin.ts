import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import { RootState } from '@/store'
import Snack from '@/models-ts/Snack'

export default Vue.extend({
  data () {
    return {
      SnackTypes,
    }
  },
  computed: {
    ...mapState<RootState>({
      snacks: (state: RootState) => state.snacks?.snacks,
    }),
  },
  methods: {
    ...mapActions({
      openSnack: 'snacks/openSnackbar',
      deleteSnackbar: 'snacks/deleteSnackbar',
    }),
    openSnackbar (
      { id, type = SnackTypes.SUCCESS, title, text, duration = 3000, onCloseCb = () => {}, closable = false }:
      { id?: any, type?: SnackTypes, title?: string, text: string, duration?: number, onCloseCb?: Function, closable?: boolean }
    ) {
      if (process.client) {
        this.openSnack({
          id,
          type,
          text,
          closable,
          duration: [SnackTypes.LOADING, SnackTypes.LOADING_WITH_CLOSE].includes(type) ? -1 : duration,
          onCloseCb,
        })
      }
    },
    closeSnackbar (id: Snack['id']) {
      this.deleteSnackbar(id)
    }
  }
})
