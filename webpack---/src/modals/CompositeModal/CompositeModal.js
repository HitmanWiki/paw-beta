import VueTypes from 'vue-types'
import Button from '@/models/ui/Button'

export default {
    name: 'lx-composite-modal',
    props: {
        title: String,
        text: String,
        buttons: VueTypes.arrayOf(Button).def([]),
        onClose: VueTypes.func,
    },
    data() {
        return {
            actionButtons: [],
        }
    },
    created() {
        this.actionButtons = this.buttons.map(btn => ({ ...btn,
            loading: false
        }))
    },
    methods: {
        async onClick(button) {
            try {
                button.loading = true
                await button.onClick()
                this.$emit('close')
            } finally {
                button.loading = false
            }
        }
    },
}