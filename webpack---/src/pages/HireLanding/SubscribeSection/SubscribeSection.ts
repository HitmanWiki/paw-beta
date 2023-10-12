import Vue from 'vue'
import notifiableRequest from '@/utils-ts/notifiableRequest'
import responseMixin from '@/mixins/responseMixin'
import { SubscriptionType, createSubscription } from '@/api/subsciption'

export default Vue.extend({
  mixins: [responseMixin],
  data () {
    return {
      email: '',
      isProcessing: false,
    }
  },
  methods: {
    async onSubmit () {
      this.isProcessing = true
      this.errors!.clear()
      if (await this.$validator.validateAll()) {
        try {
          await notifiableRequest({
            request: async () => createSubscription({
              type: SubscriptionType.FREELANCER_SUBSCRIBE_REQUEST,
              email: this.email,
            }),
            successText: 'You have submitted an application',
            failureText: 'Error submitting application',
          })
        } finally {
          this.isProcessing = false
        }
      } else {
        this.isProcessing = false
      }
    }
  },
})
