import VueTypes from 'vue-types'
import * as inputs from '@/constants/input'
import animateScrollTo from '@/utils/animateScrollTo'

export default {
    name: 'lx-input',
    props: {
        value: VueTypes.oneOfType([
            VueTypes.string,
            VueTypes.number,
            null,
        ]).def(null),
        errorMsg: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        icon: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        iconSize: VueTypes.oneOfType([Number, String]).def(12),
        theme: VueTypes.oneOf(Object.values(inputs)).def(inputs.INPUT_GRAY),
        autofocus: Boolean,
        loading: Boolean,
        disabled: Boolean,
        errStatic: Boolean,
        focusId: String,
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
        onClickIcon() {
            this.$emit('icon-click')
        },
    },
}