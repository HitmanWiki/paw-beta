export default {
    paths: {
        src: '@',
    },
    plugins: [
        '@uvue/core/plugins/asyncData', [
            '@uvue/core/plugins/vuex',
            {
                fetch: true
            }
        ],
        '@uvue/core/plugins/prefetch',
        '@uvue/core/plugins/errorHandler',
        '@uvue/core/plugins/middlewares',
        '@/plugins/initStore',
    ],
    css: {
        normal: 'extract',
        vue: 'extract',
    },
}