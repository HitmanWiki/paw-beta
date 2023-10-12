import FocusLock from 'vue-focus-lock'
import {
    disablePageScroll,
    enablePageScroll
} from '@/utils/scrollLock'
import {
    mapState,
    mapActions
} from 'vuex'

export default {
    name: 'lx-modal-stack',
    components: {
        FocusLock,
    },
    data() {
        return {
            bluredEl: [],
        }
    },
    computed: {
        ...mapState({
            modals: ({
                ui
            }) => ui.modalStack,
        }),
    },
    watch: {
        modals: {
            handler(value) {
                if (value.length > 0) {
                    disablePageScroll()
                    this.bluredEl = [...document.getElementById('app').children].filter(el => el !== this.$el && el.id !== 'snackbar-stack')
                    const privateLayuot = this.bluredEl.findIndex(el => el.classList.contains('private-layout'))
                    if (privateLayuot >= 0) {
                        this.bluredEl.splice(privateLayuot, 1, ...this.bluredEl[privateLayuot].children)
                    }
                    this.bluredEl.forEach(child => {
                        child.style.filter = 'blur(4px)'
                    })
                } else {
                    enablePageScroll()
                    if (this.bluredEl.length) {
                        this.bluredEl.filter(el => el !== this.$el).forEach(child => {
                            child.style.filter = null
                        })
                    }
                }
            },
            immediate: true,
        },
    },
    methods: {
        ...mapActions({
            closeModal: 'ui/closeModal',
        }),
    },
}