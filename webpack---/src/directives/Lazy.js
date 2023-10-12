let observer = null

if (process.client && window['IntersectionObserver']) {
    observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                load(entry.target)
                observer.unobserve(entry.target)
            }
        })
    }, {
        root: null,
        threshold: 0,
        rootMargin: '500px'
    })
}

function load(el) {
    if (!el) {
        return
    }

    if (el.dataset.src) {
        el.src = el.dataset.src
    }

    if (el.dataset.srcset) {
        el.srcset = el.dataset.srcset
    }

    if (el.dataset.poster) {
        el.poster = el.dataset.poster
    }

    el.setAttribute('lazy-loaded', '')
}

export default {
    inserted: el => {
        if (observer) {
            observer.observe(el)
        } else {
            load(el)
        }
    }
}