import VueTypes from 'vue-types'
import Footer from '@/partials/Footer/Footer.vue'
import PublicHeader from '@/partials/PublicHeader/PublicHeader.vue'

export default {
    props: {
        theme: VueTypes.oneOf(['primary', 'gray']).def('primary'),
    },
    components: {
        Footer,
        PublicHeader,
    },
}