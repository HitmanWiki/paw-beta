import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-stepper',
  props: {
    stepsCount: Number,
    value: Number,
    clickable: Boolean,
  },
  methods: {
    onStepClick (i: number) {
      if (this.clickable) {
        this.$emit('input', i)
      }
    }
  },
})
