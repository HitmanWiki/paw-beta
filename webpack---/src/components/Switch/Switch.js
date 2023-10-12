export default {
    name: 'lx-switch',
    props: {
        value: Boolean,
        disabled: Boolean,
        loading: Boolean,
        off: Boolean,
    },
    methods: {
        onClick() {
            if (!this.disabled && !this.loading) {
                this.$emit('input', !this.value)
                document.activeElement.blur()
            }
        },
    },
}