import VueTypes from 'vue-types'
import * as inputs from '@/constants/input'
import animateScrollTo from '@/utils/animateScrollTo'

export default {
    name: 'lx-input-new',
    props: {
        value: VueTypes.oneOfType([
            VueTypes.string,
            VueTypes.number,
            null,
        ]).def(null),
        errorMsg: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        autofocus: Boolean,
        loading: Boolean,
        disabled: Boolean,
        errStatic: {
            type: Boolean,
            default: true
        },
        focusId: String,
        inputLabel: String,
        required: Boolean,
    },
    data() {
        return {
            inputs,
        }
    },
    mounted() {
        this.$root.$on('set-focus', this.listenerForFocus)
        if (this.autofocus) {
            if (this.loading) {
                const unwatch = this.$watch('loading', function() {
                    this.setFocus()
                    unwatch()
                })
            } else {
                this.setFocus()
            }
        }
    },
    beforeDestroy() {
        this.$root.$off('set-focus', this.listenerForFocus)
    },
    computed: {
        hasError() {
            return !!this.errorMsg
        },
    },
    methods: {
        setFocus() {
            if (!this.loading && !this.disabled && this.$refs.input) {
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            }
        },
        listenerForFocus(focusId) {
            if (focusId && focusId === this.focusId) {
                animateScrollTo(this.$refs.input)
                this.setFocus()
            }
        },
        onInput(e) {
            this.$emit('input', e.target.value)
        },
    },
}