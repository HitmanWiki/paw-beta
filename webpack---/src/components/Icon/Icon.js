import VueTypes from 'vue-types'

export default {
    name: 'lx-icon',
    props: {
        icon: VueTypes.string.required,
        size: VueTypes.oneOfType([Number, String]).def(14),
        src: String,
    },
    computed: {
        iconUrl() {
            if (this.src) {
                return this.src.startsWith('/') ? this.src : `/static/images/icons/${this.src}.svg`
            }
            return `url(/static/images/icons/${this.icon}.svg)`
        },
        iconSize() {
            if (typeof this.size === 'number') {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`
                }
            }
            const [width, height] = this.size.split(',')
            const size = {
                width: `${Number.parseFloat(width)}px`
            }
            size.height = height ? `${Number.parseFloat(height)}px` : size.width
            return size
        },
        style() {
            return {
                ...this.iconSize,
                maskImage: this.iconUrl,
                '-webkit-mask-image': this.iconUrl,
            }
        }
    }
}