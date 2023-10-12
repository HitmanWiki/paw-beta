import Vue, { PropType } from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-breadcrumbs-new',
  props: {
    items: {
      type: Array as PropType<Array<Breadcrumb>>,
      default: [],
    },
  },
  computed: {
    links () {
      return this.items.slice(0, -1)
    },
    lastItem () {
      return this.items[this.items.length - 1]
    }
  },
  metaInfo () {
    return {
      script: [{
        vmid: 'BreadcrumbList',
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: this.items.map((item: Breadcrumb, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.title,
            item: item.to ? `${process.env.VUE_APP_FRONTEND_URL}${this.$router.resolve(item.to).href}` : undefined
          }))
        }
      }]
    }
  },
})
