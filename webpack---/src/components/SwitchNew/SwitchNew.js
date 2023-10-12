export default {
    name: 'lx-switch-new',
    props: {
        value: Boolean,
        disabled: Boolean,
        loading: Boolean,
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