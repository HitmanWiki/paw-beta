import VueTypes from 'vue-types'
import {
    mixin as clickaway
} from 'vue-clickaway'
import {
    disablePageScroll,
    enablePageScroll
} from '@/utils/scrollLock'

export default {
    name: 'lx-menu',
    mixins: [clickaway],
    props: {
        offsetTop: VueTypes.oneOfType([Number, String]).def(28),
        items: Array,
        value: [String, Number],
        disabled: VueTypes.bool.def(false),
        dir: VueTypes.oneOf(['bottom-right', 'bottom-left', 'top', 'left']).def('bottom-right'),
        closeOnClick: Boolean,
        fixed: Boolean,
    },
    data() {
        return {
            open: false,
            contentStyle: {},
        }
    },
    methods: {
        openMenu() {
            this.open = true
            this.contentStyle = {}
            if (this.fixed) {
                this.contentStyle.position = 'fixed'
                const rect = this.$el.getBoundingClientRect()
                this.contentStyle.top = `${rect.y + rect.height}px`
                this.contentStyle.right = `calc(100% - ${rect.x + rect.width}px)`
                disablePageScroll()
            }
            this.contentStyle.marginTop = `${this.offsetTop}px`
            this.$emit('open')
        },
        closeMenu() {
            if (this.open) {
                this.open = false
                if (this.fixed) {
                    enablePageScroll()
                }
            }
        },
        toggleMenu() {
            if (!this.disabled) {
                if (!this.open) {
                    this.openMenu()
                    return
                }
            }
            if (!this.open) {
                this.closeMenu()
            }
        },
        onClickItem(item) {
            this.$emit('input', item)
        },
        onClickContent(event) {
            if (this.closeOnClick) {
                this.closeMenu()
                event.preventDefault()
                event.stopPropagation()
            }
        },
    },
}