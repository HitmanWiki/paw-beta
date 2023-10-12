import VueTypes from 'vue-types'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import has from 'lodash/has'

export default {
    name: 'lx-tabs',
    props: {
        value: VueTypes.oneOfType([Number, String]),
        lazy: VueTypes.bool.def(false),
        grow: Boolean,
        replace: Boolean,
    },
    data() {
        return {
            tabs: [],
            scroll: false,
        }
    },
    computed: {
        activeTab() {
            const links = this.tabs.map(tab => tab.to).filter(Boolean)
            if (links.length) {
                const index = links.findIndex(link => has(link, 'query.tab') ?
                    link.query.tab === this.$route.query.tab :
                    link.name === this.$route.name)
                if (index !== -1) {
                    return this.tabs[index].value
                }
            }
            const activeTab = this.tabs.find(tab => tab.value === this.value)
            return activeTab ? activeTab.value : this.tabs[0].value
        }
    },
    created() {
        this.initTabs()
    },
    mounted() {
        window.addEventListener('resize', this.checkScrollDebounced)
        this.$nextTick(() => this.checkScroll())
    },
    destroyed() {
        window.removeEventListener('resize', this.checkScrollDebounced)
    },
    methods: {
        initTabs() {
            this.tabs = (this.$slots ? .default || [])
                .filter(vnode => vnode ? .componentOptions ? .tag === 'lx-tab' && vnode.componentOptions ? .propsData ? .title)
                .map(vnode => vnode.componentOptions.propsData)
        },
        changeTab(index) {
            const tab = get(this.$refs, `tab.[${index}]`)
            this.$emit('input', this.tabs[index].value)
            if (tab) {
                const tabEl = tab.$el || tab
                if (tabEl.scrollIntoViewIfNeeded) {
                    tabEl.scrollIntoViewIfNeeded()
                }
            }
        },
        checkScroll() {
            const tabs = this.$refs.tabs
            this.scroll = tabs && tabs.scrollWidth > tabs.clientWidth
        },
        checkScrollDebounced: debounce(function() {
            this.checkScroll()
        }, 200),
    },
}