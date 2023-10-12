import VueTypes from 'vue-types'

export default {
    name: 'lx-textarea',
    props: {
        loading: Boolean,
        errorMsg: String,
        errStatic: VueTypes.bool.def(false),
    },
    computed: {
        hasError() {
            return !!this.errorMsg
        },
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.value)
        },
    },
}