import Vue from 'vue'
import copy from 'copy-to-clipboard'
import QrCode from '@chenfengyuan/vue-qrcode'
import { mapActions } from 'vuex'

export default Vue.extend<any, any, any, any>({
  name: 'lx-walletconnect-qr',
  components: {
    QrCode,
  },
  props: {
    uri: String,
    error: String
  },
  data () {
    return {
      COPY_MESSAGE: 'Copy to clipboard',
      COPIED_MESSAGE: 'Copied!',
      copyMessage: null
    }
  },
  created () {
    this.copyMessage = this.COPY_MESSAGE
  },
  methods: {
    ...mapActions({
      closeModal: 'ui/closeModal',
    }),
    async copyLink () {
      copy(this.uri)
      this.copyMessage = 'Copied!'
      setTimeout(() => { this.copyMessage = 'Copy to clipboard' }, 1000)
    }
  },
})
