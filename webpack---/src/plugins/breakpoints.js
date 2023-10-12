import debounce from 'lodash/debounce'
import get from 'lodash/get'

const GRID = {
    esMin: 0,
    esMax: 414,
    xsMin: 415,
    xsMax: 599,
    smMin: 600,
    smMax: 959,
    tabletMax: 768,
    mdMin: 960,
    mdMax: 1263,
    lgMin: 1264,
    lgMax: 1903,
    xlMin: 1904,
    xlMax: 10000,
}

class Breakpoints {
    height = null
    width = null
    es = false // extra small mobile
    xs = false // mobile
    sm = false // tablet
    md = false // laptopsm
    lg = false // desktop
    xl = false // 4k and over ***
    xsAndDown = false
    smAndDown = false
    mdAndDown = false
    lgAndDown = false
    lgAndUp = false
    tabletMax = false

    init() {
        if (process.client) {
            window.addEventListener('resize', debounce(this.update.bind(this), 200))
        }
        this.update()
    }
    update() {
        this.height = this.getHeight()
        this.width = this.getWidth()
        this.es = this.width <= GRID.esMax
        this.sm = this.width >= GRID.xsMin && this.width <= GRID.xsMax
        this.sm = this.width >= GRID.smMin && this.width <= GRID.smMax
        this.md = this.width >= GRID.mdMin && this.width <= GRID.mdMax
        this.lg = this.width >= GRID.lgMin && this.width <= GRID.lgMax
        this.xl = this.width >= GRID.xlMin && this.width <= GRID.xlMax
        this.xsAndDown = this.width <= GRID.xsMax
        this.smAndDown = this.width <= GRID.smMax
        this.mdAndDown = this.width <= GRID.mdMax
        this.lgAndDown = this.width <= GRID.lgMax
        this.lgAndUp = this.width >= GRID.lgMin
        this.tabletMax = this.width <= GRID.tabletMax
    }

    getWidth() {
        if (process.client) {
            return Math.max(
                get(document, 'documentElement.clientWidth', 0),
                window.innerWidth
            )
        }
        return GRID.xlMax
    }
    getHeight() {
        if (process.client) {
            return Math.max(
                get(document, 'documentElement.clientHeight', 0),
                window.innerHeight
            )
        }
        return null
    }
}

export default {
    install(Vue) {
        const breakpoints = new Breakpoints()
        breakpoints.init()
        Vue.prototype.$breakpoints = Vue.observable(breakpoints)
        Vue.mixin({
            computed: {
                isMobileLx() {
                    return this.$breakpoints.es
                },
                isTabletLx() {
                    return this.$breakpoints.smAndDown
                },
                isTabletMax() {
                    return this.$breakpoints.tabletMax
                },
                xsAndDown() {
                    return this.$breakpoints.xsAndDown
                },
            },
        })
    }
}