import VueTypes from 'vue-types'

export default {
    name: 'lx-breadcrumbs',
    props: {
        items: VueTypes.array.def([]),
    },
    metaInfo() {
        return {
            script: [{
                vmid: 'BreadcrumbList',
                type: 'application/ld+json',
                json: {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: this.items.map((item, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        name: item.title,
                        item: item.to ? `${process.env.VUE_APP_FRONTEND_URL}${this.$router.resolve(item.to).href}` : undefined
                    }))
                }
            }]
        }
    },
    computed: {
        links() {
            return this.items.slice(0, -1)
        },
        lastItem() {
            return this.items[this.items.length - 1]
        }
    },
}