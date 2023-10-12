import snackMixin from '@/mixins/snackMixin'

export default {
    mixins: [snackMixin],
    data() {
        return {
            isZendeskLoading: false,
            openInterval: null,
            checkTimeout: null,
            zendeskOpen: null,
        }
    },
    beforeDestroy() {
        if (this.openInterval) {
            clearInterval(this.openInterval)
        }
        if (this.checkTimeout) {
            clearTimeout(this.checkTimeout)
        }
    },
    methods: {
        async openZendesk(source) {
            if (!this.isZendeskLoading && !this.zendeskOpen) {
                try {
                    if (this.isMobileLx) {
                        document.documentElement.style.scrollBehavior = 'unset'
                    }
                    this.isZendeskLoading = true
                    this.checkTimeout = setTimeout(this.checkOpened, 1 * 60 * 1000)
                    if (!document.getElementById('ze-snippet')) {
                        await this.loadZendesk()
                        window.zE('webWidget:on', 'close', () => {
                            document.documentElement.style.scrollBehavior = 'smooth'
                        })
                    }
                    if (this.checkTimeout) {
                        await this.open()
                    }
                } catch (e) {
                    this.openFailureSnack()
                }
                this.isZendeskLoading = false
            }
        },
        open() {
            if (!this.openInterval) {
                return new Promise(resolve => {
                    this.openInterval = setInterval(() => {
                        if (window.zE) {
                            if (document.getElementById('launcher') && document.querySelector('iframe[data-product="web_widget"]')) {
                                window.zE('webWidget:on', 'open', () => {
                                    clearInterval(this.openInterval)
                                    if (this.checkTimeout) {
                                        clearTimeout(this.checkTimeout)
                                    }
                                    this.openInterval = null
                                    this.checkTimeout = null
                                    this.zendeskOpen = true
                                    resolve()
                                })
                                window.zE('webWidget:on', 'close', () => {
                                    this.zendeskOpen = false
                                })
                                window.zE('webWidget', 'open')
                            }
                        }
                    }, 100)
                })
            }
        },
        closeZendeskWidget() {
            if (window && window.zE) {
                window.zE('webWidget', 'close')
            }
        },
        loadZendesk() {
            return new Promise((resolve, reject) => {
                window.zESettings = {
                    webWidget: {
                        color: {
                            theme: '#4737FF'
                        },
                        zIndex: 13
                    }
                }
                let script = document.createElement('script')
                script.id = 'ze-snippet'
                script.src = 'https://static.zdassets.com/ekr/snippet.js?key=c742ccd7-248d-4338-afc2-d84ea1e12fd6'
                script.onload = resolve
                script.onerror = (e) => {
                    this.isZendeskLoading = false
                    script.remove()
                    reject(e)
                }
                document.head.appendChild(script)
            })
        },
        checkOpened() {
            this.openFailureSnack()
            if (this.openInterval) {
                clearInterval(this.openInterval)
                this.openInterval = null
            }
            const webWidget = document.querySelector('iframe[data-product="web_widget"]')
            const launcherWidget = document.querySelector('iframe[id="launcher"]')
            const scriptsWidget = [...document.querySelectorAll('script')]
                .filter(s => (s.getAttribute('src') || '').includes('zdassets.com'))
            webWidget && webWidget.remove()
            launcherWidget && launcherWidget.remove()
            scriptsWidget.forEach(s => s.remove())
            window.zEACLoaded = false
            this.isZendeskLoading = false
            this.checkTimeout = null
        },
        openFailureSnack() {
            this.openSnackbar({
                type: this.SnackTypes.FAILURE,
                text: 'Error loading widget',
            })
        }
    }
}