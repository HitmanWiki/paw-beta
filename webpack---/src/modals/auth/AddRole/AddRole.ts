import Vue, { PropType } from 'vue'
import { mapActions } from 'vuex'
import responseMixin from '@/mixins/responseMixin'
import rolebleMixin from '@/mixins/rolebleMixin'
import { Roles } from '@/constants-ts/user/roles'
import { addRole } from '@/api/users'
import { googleAnalyticsV2 } from '@/servicies-ts/analytics'
import snackMixin from '@/mixins/snackMixin'

export default Vue.extend<any, any, any, any>({
  name: 'lx-add-role-modal',
  mixins: [responseMixin, rolebleMixin, snackMixin],
  props: {
    predefinedRole: {
      type: Number as PropType<Roles>
    },
    successCb: Function,
    moduleChanged: Boolean,
  },
  data: () => ({
    role: Roles.FREELANCER,
    firstName: '',
    lastName: '',
    loading: false,
  }),
  computed: {
    apiField () {
      switch (this.role) {
        case Roles.CUSTOMER: {
          return {
            first_name: this.firstName.trim(),
            last_name: this.lastName.trim(),
            account_type: Roles.CUSTOMER,
          }
        }
        default: {
          return {
            first_name: this.firstName.trim(),
            last_name: this.lastName.trim(),
            account_type: this.role,
          }
        }
      }
    },
    header () {
      switch (this.role) {
        case Roles.CUSTOMER: return 'Customer Registration'
        case Roles.FREELANCER: return 'Freelancer Registration'
      }
    },
  },
  created () {
    if (this.predefinedRole) {
      this.role = this.predefinedRole
    } else {
      this.role = this.isFreelancer ? Roles.CUSTOMER : Roles.FREELANCER
    }
  },
  methods: {
    ...mapActions({
      switchRole: 'user/switchRole'
    }),
    async onSubmit () {
      try {
        this.errors.clear()
        if (await this.$validator.validateAll()) {
          this.loading = true
          await addRole(this.apiField)
          this.$emit('close')
          await this.switchRole(this.role)
          googleAnalyticsV2.send({
            event: 'change_role',
            'event-content': this.role === Roles.FREELANCER
              ? 'talent'
              : 'customer',
          })
          if (this.successCb) {
            this.successCb()
          }
          if (this.moduleChanged) {
            googleAnalyticsV2.send({
              event: 'role-type-update-success',
            })
          }
        }
      } catch (e) {
        this.parseError(e)
        this.openSnackbar({
          type: this.SnackTypes.FAILURE,
          text: 'Error changing role',
        })
      } finally {
        this.loading = false
      }
    }
  }
})
