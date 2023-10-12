import Vue from 'vue'
import { isImage } from '@/utils/file'

export default Vue.extend<any, any, any, any>({
  name: 'lx-file-preview',
  props: {
    file: Object,
    editable: Boolean,
    clickable: Boolean,
  },
  data () {
    return {
    }
  },
  computed: {
    attributes () {
      return this.editable
        ? {}
        : {
          href: this.file.src,
          target: '_blank',
          rel: 'nofollow noopener',
        }
    },
    imageSrc () {
      return this.file.src || this.file.base64
    },
  },
  methods: {
    isImage,
    onClickImage () {
      if (this.clickable) {
        this.$emit('click', this.file)
      }
    }
  },
})
