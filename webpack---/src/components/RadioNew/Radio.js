export default {
    name: 'lx-radio-new',
    props: {
        items: Array,
        value: [Object, String],
        label: {
            type: String,
            default: 'label'
        },
    },
    methods: {
        isActive(item) {
            return item === this.value
        },
        onClick(item) {
            this.$emit('input', item)
            document.activeElement.blur()
        },
        getLabel(item) {
            return typeof item === 'object' ? item[this.label] : item
        }
    },
}