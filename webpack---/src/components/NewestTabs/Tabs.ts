import Vue from 'vue'
import { VNode } from 'vue/types/umd'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import has from 'lodash/has'

export default Vue.extend<any, any, any, any>({
  name: 'lx-newest-tabs',
  props: {
    value: [Number, String],
    lazy: Boolean,
    replace: Boolean,
  },
  data () {
    return {
      tabs: [],
      scroll: false,
      isDown: false,
      startX: 0,
      scrollLeft: 0,
    }
  },
  computed: {
    activeTab () {
      const links = (this.tabs as Array<TabProps>).map(tab => tab.to).filter(Boolean)
      if (links.length) {
        const index = links.findIndex(link => has(link, 'query.tab')
          ? link.query.tab === this.$route.query.tab
          : link.name === this.$route.name)
        if (index !== -1) {
          return this.tabs[index].value
        }
      }
      const activeTab = this.tabs.find((tab: TabProps) => tab.value === this.value)
      return activeTab ? activeTab.value : this.tabs[0]?.value
    }
  },
  watch: {
    activeTab () {
      this.$nextTick(() => {
        this.moveSlider()
        // this.scrollToActive()
      })
    },
  },
  created () {
    this.initTabs()
  },
  mounted () {
    this.moveSlider()
    this.$nextTick(() => {
      if (this.$refs.slider) {
        this.$refs.slider.style.transition = 'background-color .2s ease, width, transform .5s ease'
      }
    })
    window.addEventListener('resize', this.onResizeWindow)
    // this.scrollToActive()
    this.$nextTick(() => this.checkScroll())
  },
  destroyed () {
    window.removeEventListener('resize', this.onResizeWindow)
  },
  methods: {
    initTabs () {
      this.tabs = (this.$slots?.default || [])
        .filter((vnode: VNode) => vnode?.componentOptions?.tag === 'lx-newest-tab' &&
          (vnode.componentOptions.propsData as TabProps).title)
        .map((vnode: VNode) => vnode?.componentOptions?.propsData)
    },
    changeTab (index: number) {
      this.$emit('input', this.tabs[index].value)
    },
    scrollToActive () {
      const index = this.tabs.findIndex((tab: TabProps) => tab.value === this.activeTab)
      if (index !== -1) {
        const tab = get(this.$refs, `tab.[${index}]`)
        if (tab) {
          const tabEl = tab.$el || tab
          if (tabEl.scrollIntoViewIfNeeded) {
            tabEl.scrollIntoViewIfNeeded()
          }
        }
      }
    },
    moveSlider () {
      if (this.$refs.tabs && this.$refs.slider) {
        const activeTab = this.$refs.tabs.querySelector('.active-tab')
        const slider = this.$el.querySelector('.slider')
        const sliderStyle = slider.style
        // sliderStyle.left = `${activeTab.offsetLeft}px`
        // sliderStyle.width = `${activeTab.clientWidth}px`
        sliderStyle.transform = `translateX(${activeTab.offsetLeft + (activeTab.clientWidth / 2 - 24)}px`
      }
    },
    checkScroll () {
      const tabs = this.$refs.tabs
      this.scroll = tabs && tabs.scrollWidth > tabs.clientWidth
    },
    onResizeWindow: throttle(function (this: any) {
      this.checkScroll()
      this.moveSlider()
    }, 200),
    onViewPortDown (e: MouseEvent) {
      const viewport = this.$refs.viewport
      this.isDown = true
      this.startX = e.pageX - viewport.offsetLeft
      this.scrollLeft = viewport.scrollLeft
    },
    onViewPortLeave () {
      this.isDown = false
    },
    onViewPortMove (e: MouseEvent) {
      if (this.isDown) {
        const viewport = this.$refs.viewport
        const x = e.pageX - viewport.offsetLeft
        const scroll = x - this.startX
        viewport.scrollLeft = this.scrollLeft - scroll
      }
    },
  },
})
