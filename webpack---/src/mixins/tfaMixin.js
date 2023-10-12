import TfaCodeInput from '@/partials/TfaCodeInput/TfaCodeInput.vue'

/**
 * You have to produce
 * @param {Boolean} isLoading flag
 * @method onSubmit
 */
export default {
    components: {
        TfaCodeInput,
    },
    data() {
        return {
            key: '',
            submitTimeout: null,
        }
    },
    beforeDestroy() {
        this.clearSubmitTimeout()
    },
    methods: {
        onSubmit() { /** for implementation */ },
        clearSubmitTimeout() {
            if (this.submitTimeout) {
                clearTimeout(this.submitTimeout)
                this.submitTimeout = null
            }
        },
        autoSubmit() {
            if (this.key.length === 6) {
                setTimeout(() => {
                    if (!this.isLoading) {
                        this.onSubmit()
                    }
                }, 300)
            }
        },
    }
}