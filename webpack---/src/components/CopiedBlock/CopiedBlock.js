import copy from 'copy-to-clipboard'

export default {
    name: 'lx-copied-block',
    props: {
        text: String,
    },
    data() {
        return {
            copied: false,
        }
    },
    methods: {
        onHide() {
            setTimeout(() => {
                this.copied = false
            }, 500)
        },
        onBlockClick() {
            copy(this.text)
            this.copied = true
        },
    }
}