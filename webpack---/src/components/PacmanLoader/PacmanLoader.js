import VueTypes from 'vue-types'

export default {
    name: 'lx-pacman-loader',
    props: {
        width: VueTypes.oneOfType([Number, String]).def(60),
    }
}