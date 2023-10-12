import VueTypes from 'vue-types'
import * as buttons from '@/constants/button'

export default {
    name: 'lx-button',
    props: {
        theme: VueTypes.oneOf(Object.values(buttons)).def(buttons.BUTTON_BLACK_MEDIUM),
        loading: VueTypes.bool.def(false),
        icon: VueTypes.string,
        iconSize: VueTypes.any,
        to: Object,
        shine: VueTypes.bool.def(false),
    },
    computed: {
        tag() {
            if (this.to) {
                return 'router-link'
            }

            if (this.$attrs.href) {
                return 'a'
            }

            return 'button'
        },
        classes() {
            const classes = this.styleClasses

            if (this.shine) {
                classes.push('shine-btn')
            }

            return classes
        },
        styleClasses() {
            switch (this.theme) {
                case buttons.BUTTON_BLACK_LARGE:
                    return ['color-black', 'size-large']
                case buttons.BUTTON_BLACK_MEDIUM:
                    return ['color-black', 'size-medium']
                case buttons.BUTTON_BLUE_LARGE:
                    return ['color-blue', 'size-large']
                case buttons.BUTTON_BLUE_MEDIUM:
                    return ['color-blue', 'size-medium']
                case buttons.BUTTON_BLUE_MEDIUM_ITALIC:
                    return ['color-blue', 'size-medium', 'font-italic']
                case buttons.BUTTON_RED_MEDIUM:
                    return ['color-transparent-red', 'size-medium']
                case buttons.BUTTON_STROKE_MEDIUM:
                    return ['color-stroke', 'size-medium']
                case buttons.BUTTON_BLUE_SMALL:
                    return ['color-blue', 'size-small']
                case buttons.BUTTON_RED_SMALL:
                    return ['color-red', 'size-small']
                case buttons.BUTTON_TRANSPARENT_MEDIUM:
                    return ['color-transparent', 'size-medium']
                case buttons.BUTTON_TRANSPARENT_LARGE:
                    return ['color-transparent', 'size-large']
                case buttons.BUTTON_TRANSPARENT_SMALL:
                    return ['color-transparent', 'size-small']
                case buttons.BUTTON_TRANSPARENT_BLUE_MEDIUM:
                    return ['color-transparent-blue', 'size-medium']
                case buttons.BUTTON_TRANSPARENT_BLUE_SMALL:
                    return ['color-transparent-blue', 'size-small']
                case buttons.BUTTON_TRANSPARENT_RED_SMALL:
                    return ['color-transparent-red', 'size-small']
                case buttons.BUTTON_TRANSPARENT_BLUE_VERY_SMALL:
                    return ['color-transparent-blue', 'size-very-small']
                case buttons.BUTTON_TRANSPARENT_LARGE_BOLD_ITALIC:
                    return ['color-transparent', 'size-large', 'weight-bold', 'font-italic']
                case buttons.BUTTON_TRANSPARENT_SMALL_ITALIC:
                    return ['color-transparent', 'size-small', 'font-italic']
                case buttons.BUTTON_STROKE_VERY_SMALL:
                    return ['color-stroke', 'size-very-small']
                case buttons.BUTTON_WITH_ICON:
                    return ['color-transparent', 'size-small', 'icon-theme']
                case buttons.BUTTON_EMPTY:
                    return ['empty']
                case buttons.BUTTON_LINK:
                    return ['link']
                case buttons.BUTTON_WHITE_MEDIUM:
                    return ['color-white', 'size-medium']
            }
        },
    },
    methods: {
        onClick(e) {
            this.$el.blur()
            if (!this.loading) {
                this.$emit('click', e)
            } else {
                e.preventDefault()
            }
        },
    }
}