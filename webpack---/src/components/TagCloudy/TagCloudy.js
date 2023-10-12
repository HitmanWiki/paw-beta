import VueTypes from 'vue-types'

export default {
    name: 'lx-tag-cloudy',
    props: {
        tags: VueTypes.arrayOf(VueTypes.shape({
            text: VueTypes.string,
            link: [Object, String],
        }).loose),
        deletable: Boolean,
        max: [String, Number],
        handleClick: Function,
    },
    data() {
        return {
            expandend: false,
        }
    },
    computed: {
        items() {
            return this.expandend ? this.tags : this.tags.slice(0, this.max)
        },
        sliced() {
            return this.max && this.items.length < this.tags.length
        },
    },
    methods: {
        deleteTag(tag) {
            this.$emit('delete', tag) // ToDo: emit object { tag, index }
        },
    },
}