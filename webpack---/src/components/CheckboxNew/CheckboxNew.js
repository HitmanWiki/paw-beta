export default {
    name: 'lx-checkbox-new',
    props: {
        value: [Boolean, String],
        disabled: Boolean,
        error: Boolean,
    },
    computed: {
        someSelected() {
            return this.value === 'some'
        }
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