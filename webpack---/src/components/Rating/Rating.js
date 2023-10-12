import Multiselect from 'vue-multiselect'
import VueTypes from 'vue-types'

export default {
    name: 'lx-rating',
    components: {
        Multiselect
    },
    props: {
        size: VueTypes.oneOf(['medium', 'small']).def('medium'),
        starsSpace: VueTypes.number.def(0), // @deprecated
        active: Boolean,
        starIcon: {
            type: String,
            default: () => 'star'
        },
        value: VueTypes.number.def(0),
    },
    data() {
        return {
            hovered: null,
        }
    },
    computed: {
        isMedium() {
            return this.size === 'medium'
        },
        spaceBetweenStars() {
            if (!this.isMedium && this.isMobileLx) return 4
            if (this.starsSpace) {
                return this.starsSpace
            }
            return this.isMedium ? 13 : 24
        },
        fractionIndex() {
            if (!this.active && this.value % 1) {
                return Math.ceil(this.value)
            }
        },
        fractionWidth() {
            const starWidth = this.isMedium ? 19 : 8
            return `${this.value % 1 * starWidth}%`
        },
    },
    methods: {
        onClickStar(val) {
            if (this.active) {
                this.$emit('input', this.value === val ? 0 : val)
            }
        },
        onMouseOver(i) {
            if (this.active) {
                this.hovered = i
            }
        },
        onMouseLeave() {
            if (this.active) {
                this.hovered = null
            }
        },
    }
}