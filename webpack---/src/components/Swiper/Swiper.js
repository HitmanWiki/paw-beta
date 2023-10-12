import VueTypes from 'vue-types'

export default {
    name: 'lx-swiper',
    props: {
        images: VueTypes.array.def([]),
        image: String,
        clearable: VueTypes.bool.def(true),
        swiperOptions: VueTypes.object,
        counter: Boolean,
        pagination: Boolean,
    },
    data() {
        return {
            swiper: null,
            activeIndex: 0,
        }
    },
    computed: {
        showPrev() {
            if (this.swiperOptions.loop) {
                return this.images.length > 1
            }
        },
        showNext() {
            if (this.swiperOptions.loop) {
                return this.images.length > 1
            }
        }
    },
    async mounted() {
        this.$nextTick(async () => {
            const Swiper = (await
                import ( /* webpackChunkName: "swiper" */ 'swiper')).default
            const options = {
                lazy: true,
                cssMode: !!this.image,
                watchOverflow: true,
                slidesPerView: 1,
                spaceBetween: 15,
                slidesPerGroup: 1,
                keyboard: {
                    enabled: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                ...this.swiperOptions,
            }
            if (this.pagination) {
                options.pagination = {
                    el: this.$refs.pagination,
                }
            }
            options.on = {
                'activeIndexChange': this.onChangeActive
            }
            if (this.swiperOptions.on) {
                options.on = Object.entries(this.swiperOptions.on).reduce((on, [eventName, callback]) => {
                    on[eventName] = (...arg) => callback(this.swiper, ...arg)
                    return on
                }, {})
            }
            this.swiper = new Swiper(this.$el, options)
        })
    },
    methods: {
        onChangeActive() {
            this.activeIndex = this.swiper.realIndex
        },
        onClickDelete(image, index) {
            this.$emit('delete', {
                image,
                index
            })
            this.swiper.removeSlide(index)
            this.swiper.lazy.load()
        }
    },
}