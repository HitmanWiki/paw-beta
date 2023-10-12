export default {
    name: 'lx-modal-new',
    props: {
        closeDisabled: Boolean,

    },
    // todo: прослушка $route была, чтобы закрывалась модалка, когда назад по навигации шагаешь
    // todo: но появилась другая проблема, что часть модалок просто так закрываются. В будущем внести более грамотный фикс
    // watch: {
    //   '$route' () {
    //     this.close()
    //   }
    // },
    mounted() {
        document.addEventListener('keydown', this.keyController, true)
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keyController, true)
    },
    methods: {
        keyController(keyEvent) {
            if (keyEvent.key === 'Escape') {
                this.close()
            }
        },
        close() {
            if (!this.closeDisabled) {
                this.$emit('close')
                this.$parent.$emit('close')
            }
        },
    }
}