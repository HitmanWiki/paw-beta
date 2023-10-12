import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  props: {
    stepCount: Number,
    stepIndent: Number,
    separatorColor: {
      type: String,
      default: '#ffffff',
    },
  },
  data () {
    return {
    }
  },
  methods: {
  },
})
