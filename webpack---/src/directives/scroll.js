function onMouseDown(e) {
    const viewport = e.currentTarget
    if (viewport && viewport._scroll) {
        viewport._scroll.isDown = true
        viewport._scroll.startX = e.pageX - viewport.offsetLeft
        viewport._scroll.scrollLeft = viewport.scrollLeft
    }
}

function onMouseLeave(e) {
    const viewport = e.currentTarget
    if (viewport && viewport._scroll) {
        viewport._scroll.isDown = false
    }
}

function onMouseMove(e) {
    const viewport = e.currentTarget
    if (viewport && viewport._scroll && viewport._scroll.isDown) {
        const x = e.pageX - viewport.offsetLeft
        const scroll = x - viewport._scroll.startX
        viewport.scrollLeft = Math.max(viewport._scroll.scrollLeft - scroll, 0)
    }
}

function inserted(el) {
    el._scroll = el._scroll || {
        isDown: false,
        startX: 0,
        scrollLeft: 0,
    }
    el.addEventListener('mousedown', onMouseDown, {
        passive: true,
        capture: true
    })
    el.addEventListener('mouseup', onMouseLeave, {
        passive: true,
        capture: true
    })
    el.addEventListener('mouseleave', onMouseLeave, {
        passive: true,
        capture: true
    })
    el.addEventListener('mousemove', onMouseMove, {
        passive: true,
        capture: true
    })
}

function unbind(el) {
    el.removeEventListener('mousedown', onMouseDown)
    el.removeEventListener('mouseup', onMouseLeave)
    el.removeEventListener('mouseleave', onMouseLeave)
    el.removeEventListener('mousemove', onMouseMove)
}
export default {
    inserted,
    unbind
}