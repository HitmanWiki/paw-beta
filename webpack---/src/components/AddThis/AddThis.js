import get from 'lodash/get'

export default {
    name: 'lx-add-this',
    props: {
        userId: Number,
    },
    data() {
        return {
            refreshInterval: null,
        }
    },
    mounted() {
        if (!document.getElementById('addthis')) {
            this.loadAddThis()
        } else {
            this.refreshInterval = setInterval(() => {
                if (get(window, 'addthis.layers.refresh')) {
                    clearInterval(this.refreshInterval)
                    this.refreshInterval = null
                    window.addthis.layers.refresh()
                }
            }, 50)
        }
    },
    beforeDestroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval)
        }
    },
    methods: {
        loadAddThis() {
            let script = document.createElement('script')
            script.id = 'addthis'
            script.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e84874bc6792ca1'
            document.head.appendChild(script)
            window.addthis_config = window.addthis_config || {}
            if (this.userId) {
                window.addthis_share = {
                    ...(window.addthis_share || {}),
                    url_transforms: {
                        add: {
                            ref: String(this.userId),
                        },
                    },
                }
            }
            window.addthis_config.lang = 'en'
        },
    },
}