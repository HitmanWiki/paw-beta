import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
    }),
    onSubmitClick () {
      this.openModal({
        component: 'lx-lazy-modal',
        props: {
          factory: import(/* webpackChunkName: "application-modal" */ '@/modals/FTJCustomerSubscription/FTJCustomerSubscription.vue'),
          title: 'Application',
        }
      })
    }
  }
})
