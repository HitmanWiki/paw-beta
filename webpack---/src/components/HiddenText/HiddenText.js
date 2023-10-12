import debounce from 'lodash/debounce'

export default {
    name: 'lx-hidden-text',
    data() {
        return {
            hidden: false,
            active: true,
            maxHeight: null,
        }
    },
    mounted() {
        window.addEventListener('resize', this.checkHeightDebounced)
        this.checkHeight()
    },
    destroyed() {
        window.removeEventListener('resize', this.checkHeightDebounced)
    },
    methods: {
        checkHeightDebounced: debounce(function() {
            this.checkHeight()
        }, 200),
        checkHeight() {
            if (this.active) {
                const limit = this.$el.clientHeight
                const innerHeigth = this.$refs.text.clientHeight
                this.maxHeight = `${limit}px`
                if (innerHeigth > limit) {
                    this.hidden = true
                } else {
                    this.deactivate()
                }
            }
        },
        deactivate() {
            this.hidden = false
            this.active = false
            this.maxHeight = null
            window.removeEventListener('resize', this.checkHeightDebounced)
        },
    },
}