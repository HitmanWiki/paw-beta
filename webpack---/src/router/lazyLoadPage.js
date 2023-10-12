import PacmanLoader from '@/components/PacmanLoader/PacmanLoader.vue'
import SomeError from '@/components/SomeError/SomeError.vue'

export default function lazyLoadPage(page) {
    const component = () => ({
        component: page,
        loading: PacmanLoader,
        error: SomeError,
    })

    return Promise.resolve({
        render(h) {
            return h(component)
        },
    })
}