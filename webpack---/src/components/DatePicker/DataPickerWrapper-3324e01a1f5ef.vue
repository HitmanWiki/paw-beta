<template>
  <date-picker
    class="root date-picker"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
  >
    <template v-slot:header="props">
      <slot name="header" v-bind="props"></slot>
    </template>
  </date-picker>
</template>

<script>
import VueTypes from 'vue-types'
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader.vue'

const components = {}
if (process.client || typeof process.client === 'undefined') {
  components['DatePicker'] = () => ({
    component: import(/* webpackChunkName: "date-picker" */ '@/components/DatePicker/DatePicker.vue'),
    loading: SkeletonLoader // ToDo: methinks it doesn't work, catch error
  })
}

export default {
  name: 'lx-date-picker',
  components,
  props: {
    value: VueTypes.any,
  },
}
</script>
