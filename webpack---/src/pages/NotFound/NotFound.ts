import NotFound from '@/partials/NotFound/NotFound.vue'

export default {
  components: {
    NotFound,
  },
  asyncData ({ error }: { error: (err: Error, code: number) => void }) {
    error(new Error('Not Found'), 404)
  },
  metaInfo: {
    title: 'Not Found',
    meta: [
      {
        vmid: 'robots',
        name: 'robots',
        content: 'noindex',
      },
    ]
  },
}
