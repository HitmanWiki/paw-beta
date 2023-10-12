import Vue from 'vue'
import { mapState } from 'vuex'
import { Roles, USER_TYPE_CUSTOMER_COMPANY, USER_TYPE_CUSTOMER_PERSON } from '@/constants-ts/user/roles'

export default Vue.extend<any, any, any>({
  computed: {
    ...mapState({
      userType: (state: any) => state.user?.profile?.value?.type,
    }),
    activeRole () {
      return this.$store.state.user?.activeRole
    },
    isFreelancer () {
      return this.activeRole === Roles.FREELANCER
    },
    isCustomer () {
      return this.activeRole === Roles.CUSTOMER
    },
    isPrivateCustomer () {
      return this.isCustomer && this.userType === USER_TYPE_CUSTOMER_PERSON
    },
    isCompanyCustomer () {
      return this.isCustomer && this.userType === USER_TYPE_CUSTOMER_COMPANY
    },
  }
})
