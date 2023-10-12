import VueTypes from 'vue-types'

export default {
    name: 'lx-radio',
    props: {
        items: Array,
        value: [Object, String],
        label: VueTypes.string.def('label'),
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