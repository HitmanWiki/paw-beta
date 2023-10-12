import NoSsr from 'vue-no-ssr'

export default {
    name: 'lx-tooltip',
    components: {
        NoSsr,
    },
    props: {
        dark: Boolean,
    },
    computed: {
        theme() {
            return this.dark ? 'lx-tooltip-dark' : 'lx-tooltip'
        },
    },
}