import VueTypes from 'vue-types'
import uniqueId from 'lodash/uniqueId'
import animateScrollTo from '@/utils/animateScrollTo'
import * as inputs from '@/constants/input'
import {
    outputCurrency
} from '@/utils/moneyFormat'

export default {
    name: 'lx-numeric-input',
    inject: ['$validator'],
    props: {
        loading: Boolean,
        readOnly: Boolean,
        errStatic: Boolean,
        autofocus: Boolean,
        error: Boolean,
        type: String,
        prefixText: VueTypes.string.def(''),
        suffixText: VueTypes.string.def(''),
        precision: VueTypes.number.def(2),
        value: VueTypes.any,
        focusId: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        errorMsg: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        fullWidth: VueTypes.bool.def(false),
        theme: VueTypes.oneOf(Object.values(inputs)).def(inputs.INPUT_GRAY),
    },
    data() {
        return {
            uniqueId: uniqueId(),
            inputWidth: 48,
            focused: false,
        }
    },
    computed: {
        hasError() {
            return !!this.errorMsg || this.error
        },
        inputType() {
            if (this.type) {
                return this.type
            }
            return this.focused && this.isMobileLx ? 'number' : 'string'
        },
    },
    watch: {
        value() {
            this.handleResize()
        },
        precision() {
            this.handleResize()
        },
    },
    mounted() {
        this.handleResize()
        if (this.autofocus) {
            const input = this.$el.querySelector('input')
            if (input) {
                input.focus()
            }
        }
        this.$root.$on('set-focus', this.listenerForFocus)
    },
    beforeDestroy() {
        this.$root.$off('set-focus', this.listenerForFocus)
    },
    methods: {
        outputCurrency,
        listenerForFocus(focusId) {
            if (focusId && focusId === this.focusId) {
                animateScrollTo(this.$refs.numeric.$el)
                this.$refs.numeric.$el.focus()
            }
        },
        handleResize() {
            this.$nextTick(() => {
                const MIN_WIDTH = 25
                let elem = this.$refs.widthDiv
                if (elem) {
                    const width = elem.offsetWidth + 12
                    this.inputWidth = Math.max(width, MIN_WIDTH)
                }
            })
        },
    },
}