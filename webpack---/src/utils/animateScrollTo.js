import animateScrollTo from 'animated-scroll-to'
import get from 'lodash/get'
import {
    VERTICAL_OFFSET_PC,
    VERTICAL_OFFSET_TABLET
} from '@/constants/focusListener'

export default (el, options = {}) => {
    // ToDo: taken from plugins/breakpoints. Not good
    const smMax = 959
    if (process.client) {
        const width = Math.max(
            get(document, 'documentElement.clientWidth', 0),
            window.innerWidth
        )
        const isTabletLx = width <= smMax
        animateScrollTo(
            el, {
                verticalOffset: isTabletLx ? VERTICAL_OFFSET_TABLET : VERTICAL_OFFSET_PC,
                ...options,
            }
        )
    }
}