import Multiselect from 'vue-multiselect'
import NoSsr from 'vue-no-ssr'
import VueTypes from 'vue-types'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import {
    SELECT_DEFAULT,
    SELECT_ROUNDED,
    SELECT_WHITE
} from '@/constants/select'

export default {
    name: 'lx-select',
    components: {
        Multiselect,
        NoSsr
    },
    props: {
        defaultOption: Boolean,
        errStatic: Boolean,
        fixed: Boolean,
        label: String,
        loading: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        native: Boolean,
        optionsGroup: Boolean,
        placeholder: String,
        sortable: Boolean,
        errorMsg: VueTypes.oneOfType([VueTypes.string, null]).def(null),
        options: VueTypes.array.isRequired,
        rounded: VueTypes.bool.def(false),
        searchable: VueTypes.oneOfType([VueTypes.bool, null]).def(null),
        type: VueTypes.oneOf([SELECT_DEFAULT, SELECT_ROUNDED, SELECT_WHITE]) // ToDo: rewrite to theme like the Input
            .def(SELECT_DEFAULT),
        value: VueTypes.any,
    },
    data() {
        return {
            preparedOptions: {}, // { id: { ...props, childs: new Set() } }
            rootExpanded: false,
            childExpanded: false,
            open: false,
            search: '',
            SELECT_DEFAULT,
            SELECT_ROUNDED,
            SELECT_WHITE,
            item: `<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 1L5 5L9 1" stroke="black" stroke-width="1.5"/>
</svg>`
        }
    },
    computed: {
        showNative() {
            return this.native && !this.loading && !this.disabled && this.isTabletLx
        },
        isSearchable() {
            return this.searchable !== null ? this.searchable : this.type === SELECT_DEFAULT
        },
        placeholderSelect() {
            if (this.placeholder) {
                return this.placeholder
            }
            return this.type === SELECT_ROUNDED || this.rounded ? '' : 'Select'
        },
        sortedOptions() {
            const getSortedIfNeeded = arr => this.sortable && !this.search ?
                arr.sort((a, b) => (a[this.label]).localeCompare(b[this.label])) :
                arr
            if (!this.optionsGroup || this.search) {
                return getSortedIfNeeded(this.options)
            }
            const options = []
            let sortedOptions = getSortedIfNeeded(Object.values(this.preparedOptions))
            sortedOptions.forEach(opt => {
                options.push({ ...omit(opt, 'childs'),
                    isParent: !!opt.childs
                })
                if (opt.childs && opt.id === this.rootExpanded) {
                    const childs = getSortedIfNeeded([...opt.childs])
                    childs.forEach(child => {
                        options.push({
                            ...omit(child, 'childs'),
                            isParent: !!child.childs,
                            isChild: true,
                        })
                        if (child.id === this.childExpanded) {
                            const grandchilds = getSortedIfNeeded([...child.childs])
                            grandchilds.forEach(grandchild => {
                                options.push({ ...grandchild,
                                    isGrandchild: true
                                })
                            })
                        }
                    })
                }
                return options
            }, [])
            return options
        },
    },
    watch: {
        options: {
            handler() {
                this.initOptions()
            },
        },
    },
    mounted() {
        this.initOptions()
    },
    methods: {
        initOptions() {
            const options = cloneDeep(this.options)
            const addChild = (parent, child) => {
                if (!parent.childs) {
                    parent.childs = new Set()
                }
                child.isChild = true
                parent.expanded = false
                parent.childs.add(child)
                return parent
            }

            this.preparedOptions = options.reduce((res, opt) => {
                // eslint-disable-next-line camelcase
                const findParent = ({
                    parent_id
                }) => res[parent_id] || options.find(parent => parent.id === parent_id)
                let optAdded = false
                if (opt.relations ? .Parent ? .length) {
                    const pRels = opt.relations.Parent
                    let pAdded = false
                    for (let pRel of pRels) {
                        const parentOpt = findParent(pRel)
                        if (parentOpt) {
                            if (parentOpt.relations ? .Parent ? .length) {
                                const gpRels = parentOpt.relations.Parent
                                for (let gpRel of gpRels) {
                                    const gParentOpt = findParent(gpRel)
                                    if (gParentOpt) {
                                        res[gParentOpt.id] = addChild(gParentOpt, addChild(parentOpt, opt))
                                        pAdded = true
                                        optAdded = true
                                    }
                                }
                                if (!pAdded) {
                                    res[parentOpt.id] = addChild(parentOpt, opt)
                                    optAdded = true
                                }
                            } else {
                                res[parentOpt.id] = addChild(parentOpt, opt)
                                optAdded = true
                            }
                        }
                    }
                    if (!optAdded) {
                        res[opt.id] = opt
                    }
                } else {
                    res[opt.id] = opt
                }
                return res
            }, {})
        },
        openSelect() {
            this.open = true
            this.$emit('open')
            if (this.$refs.select && this.fixed) {
                const rect = this.$refs.select.getBoundingClientRect()
                const top = rect.top + rect.height
                const left = rect.left
                const multiselect = this.$refs.select.querySelector('.multiselect__content-wrapper')
                multiselect.style.top = `${top}px`
                multiselect.style.left = `${left}px`
            }
        },
        onClickExpand(option, isChild, event) {
            if (!isChild) {
                this.rootExpanded = this.rootExpanded !== option.id && option.id
                this.childExpanded = false
            } else {
                this.childExpanded = this.childExpanded !== option.id && option.id
            }
            // scroll root option to top
            if ([this.rootExpanded, this.childExpanded].includes(option.id)) {
                const optionEl = event.path.find(el => el.classList.contains('multiselect__option'))
                const containerEl = event.path.find(el => el.classList.contains('multiselect__content-wrapper'))
                this.$nextTick(() => {
                    // ToDo: animateScrollTo(optionEl, { elementToScroll: containerEl, verticalOffset: 0 }) wait for another to close
                    containerEl.scrollTop = optionEl.offsetTop
                })
            }
        },
        onSearchChange(search) {
            this.search = search
            this.$emit('search-change', search)
        },
        onInput(selected) {
            if (selected ? .readOnly) {
                return
            }
            if (this.optionsGroup) {
                this.$emit('input', this.options.find(opt => opt.id === selected.id))
                this.$nextTick(() => {
                    if (!this.value) {
                        this.rootExpanded = false
                        this.childExpanded = false
                        const containerEl = this.$el.querySelector('.multiselect__content-wrapper')
                        if (containerEl) {
                            containerEl.scrollTop = 0
                        }
                    }
                })
            } else {
                this.$emit('input', selected)
            }
        },
        onClickOption(option, event) {
            if (option.isParent && option.readOnly) {
                event.stopPropagation()
                event.preventDefault()
                this.onClickExpand(option, false, event)
            }
        },
        onNativeInput(event) {
            this.$emit('input', this.options.find(opt => opt[this.label] === event.target.value))
        },
        optionIsSelected(option) {
            if (this.value) {
                return option[this.label] === this.value[this.label]
            }
        },
    }
}