export async function disablePageScroll(el) {
    if (el) {
        el.overflow = 'scroll'
    }
    document.querySelector('html').style.overflow = 'hidden'
}

export async function enablePageScroll(el) {
    if (el) {
        el.overflow = null
    }
    document.querySelector('html').style.overflow = null
}