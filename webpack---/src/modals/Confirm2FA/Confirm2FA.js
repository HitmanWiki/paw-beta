import VueTypes from 'vue-types'
import ErrorMatcher from '@/utils/ErrorMatcher'
import responseMixin from '@/mixins/responseMixin'
import tfaMixin from '@/mixins/tfaMixin'

export default {
    name: 'lx-confirm-2fa-modal',
    mixins: [responseMixin, tfaMixin],
    props: {
        confirm: VueTypes.func,
        cancel: VueTypes.func,
    },
    data() {
        return {
            isLoading: false,
        }
    },
    methods: {
        async onSubmit() {
            try {
                if (this.isLoading) {
                    return
                }
                this.clearSubmitTimeout()
                this.isLoading = true
                if (await this.$validator.validateAll('fa2Form')) {
                    await this.confirm(this.key)
                }
                this.$emit('close')
            } catch (e) {
                this.parseError(e, 'fa2Form')
                if (ErrorMatcher.is2FA(e)) {
                    this.key = ''
                }
            } finally {
                this.isLoading = false
            }
        }
    },
}