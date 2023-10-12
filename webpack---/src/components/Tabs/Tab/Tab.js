import VueTypes from 'vue-types'

export default {
    name: 'lx-tab',
    props: {
        index: VueTypes.number,
        value: VueTypes.oneOfType([Number, String]).required,
        title: VueTypes.string.required,
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
}