import NoSsr from 'vue-no-ssr'

export default {
    name: 'lx-menu-new',
    components: {
        NoSsr,
    },
    props: {
        trigger: {
            type: String,
            default: 'click',
        },
        placement: {
            type: String,
            default: 'bottom',
        },
        disabled: Boolean,
        closeOnClick: Boolean,
    },
    methods: {
        closeMenu() {
            if (this.$refs.menuElement) {
                this.$refs.menuElement.tip.hide()
            }
        },
        onTippyShow() {
            if (!this.disabled) {
                this.$emit('onShow')
            }
            return !this.disabled
        }
    },
}