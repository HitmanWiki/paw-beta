export default {
    name: 'lx-checkbox',
    props: {
        value: Boolean,
        disabled: Boolean,
        error: Boolean,
    },
    methods: {
        onClick() {
            if (!this.disabled) {
                this.$emit('input', !this.value)
                document.activeElement.blur()
            }
        },
    },
}