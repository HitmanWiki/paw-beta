export default {
    name: 'lx-lazy-modal',
    props: {
        factory: Promise,
        title: String,
        props: Object,
    },
    data() {
        return {
            loading: true,
            modal: null,
            error: false,
        }
    },
    async created() {
        try {
            this.modal = (await this.factory).default
            this.loading = false
        } catch (e) {
            console.error(e)
            this.error = true
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
    },
}