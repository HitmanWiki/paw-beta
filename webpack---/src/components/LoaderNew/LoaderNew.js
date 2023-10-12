export default {
    name: 'lx-loader-new',
    props: {
        size: {
            type: [Number, String],
            default: 40,
        },
    },
    computed: {
        sizeNumber() {
            return Number(this.size)
        },
        tickWidth() {
            return 0.1 * this.sizeNumber
        },
        tickHeight() {
            return 0.275 * this.sizeNumber
        },
        tickLeft() {
            return 0.45 * this.sizeNumber
        }
    },
}