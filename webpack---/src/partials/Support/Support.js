import zendeskMixin from '@/mixins/zendeskMixin'

export default {
    mixins: [zendeskMixin],
    beforeDestroy() {
        this.closeZendeskWidget()
    },
}