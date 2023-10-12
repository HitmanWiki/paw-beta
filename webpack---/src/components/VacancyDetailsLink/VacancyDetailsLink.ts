import { VACANCY_DETAILS } from '@/constants-ts/routes'

export default {
  name: 'lx-vacancy-details-link',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    isRemoved: Boolean,
    name: String,
  },
  data () {
    return {
      VACANCY_DETAILS,
    }
  },
}
