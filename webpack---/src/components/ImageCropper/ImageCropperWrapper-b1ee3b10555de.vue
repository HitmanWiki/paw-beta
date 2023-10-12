<template>
  <image-cropper
    class="root image-cropper"
    v-bind="$attrs"
    v-on="$listeners"
  ></image-cropper>
</template>

<script>
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader.vue'

const components = {}
if (process.client || typeof process.client === 'undefined') {
  components['ImageCropper'] = () => ({
    component: import(/* webpackChunkName: "image-cropper" */ '@/components/ImageCropper/ImageCropper.vue'),
    loading: SkeletonLoader // ToDo: methinks it doesn't work, catch error
  })
}

export default {
  name: 'lx-image-cropper',
  components
}
</script>
