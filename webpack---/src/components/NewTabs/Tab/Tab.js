import VueTypes from 'vue-types'

export default {
    name: 'lx-new-tab',
    props: {
        index: VueTypes.number,
        value: VueTypes.oneOfType([Number, String]).required,
        title: VueTypes.string.required,
        icon: String,
        to: Object,
    },
    data() {
        return {
            wasMounted: false,
        }
    },
    computed: {
        visible() {
            if (this.to) {
                return this.$parent.activeTab === this.value
            }
            return !this.$parent.lazy || this.$parent.activeTab === this.value || this.wasMounted
        }
    },
    watch: {
        '$parent.activeTab': {
            handler(value) {
                if (value === this.value) {
                    this.wasMounted = true
                }
            }
        }
    },
    mounted() {
        if (this.$parent.activeTab === this.value) {
            this.wasMounted = true
        }
    },
    methods: {
        beforeEnterTab(el) {
            this.setParentSize(el.clientWidth, el.clientHeight)
        },
        beforeLeaveTab(el) {
            this.setParentSize(el.clientWidth, el.clientHeight)
        },
        afterLeaveTab() {
            this.setParentSize()
        },
        setParentSize(width, height) {
            const parentStyle = this.$el.parentElement.style
            parentStyle.minWidth = width ? `${width}px` : ''
            parentStyle.minHeight = height ? `${Math.max(this.$el.parentElement.clientHeight, height)}px` : ''
        }
    }
}