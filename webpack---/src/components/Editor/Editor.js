import NoSsr from 'vue-no-ssr'
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader.vue'

let components = {
    NoSsr
}

if (process.client || typeof process.client === 'undefined') {
    components['ck-editor-field'] = () => ({
        component: import ( /* webpackChunkName: "ckeditor" */ '@/components/Editor/CkEditorField/CkEditorField.vue'),
        loading: SkeletonLoader
    })
}

export default {
    name: 'lx-ckeditor',
    components,
    props: ['value'],
    methods: {
        setData(v) {
            this.$refs.editor ? .setData ? .(v)
        }
    }
}