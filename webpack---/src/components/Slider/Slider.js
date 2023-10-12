import NoSsr from 'vue-no-ssr'

export default {
    name: 'lx-slider',
    ...(
        process.client || typeof process.client === 'undefined' ?
        {
            components: {
                NoSsr,
                'vue-slider': () =>
                    import ( /* webpackChunkName: "vue-slider-component" */ 'vue-slider-component')
            }
        } :
        {
            components: {
                NoSsr
            }
        }
    ),
    model: {
        event: 'change',
    },
}