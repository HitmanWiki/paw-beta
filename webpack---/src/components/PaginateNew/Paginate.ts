import Vue from 'vue'

export default Vue.extend<any, any, any, any>({
  name: 'lx-paginate-new',
  props: {
    navigate: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      default: 1, // numbering starts with one !1
    },
  },
  data () {
    return {
      skipSymb: '...'
    }
  },
  computed: {
    limitedValue () {
      return Math.max(Math.min(this.value, this.total), 1)
    },
    items () {
      let items: Array<number> = []
      if (this.total < 5) {
        items = this.range(1, this.total)
      } else {
        items = [1]
        if (this.limitedValue - 1 === 3) {
          items.push(2)
        }
        if (this.limitedValue - 1 > 1) {
          items.push(this.limitedValue - 1)
        }
        if (this.limitedValue !== 1 && this.limitedValue !== this.total) {
          items.push(this.limitedValue)
        }
        if (this.limitedValue + 1 < this.total) {
          items.push(this.limitedValue + 1)
        }
        if (this.total - this.limitedValue - 1 === 2) {
          items.push(this.total - 1)
        }
        items.push(this.total)
        items = items.reduce((acc: Array<number>, curr, i) => {
          if (i === 0 || i === items.length - 1) {
            acc.push(curr)
          } else if (curr - 1 !== items[i - 1]) {
            acc.push(this.skipSymb, curr)
          } else if (curr + 1 !== items[i + 1]) {
            acc.push(curr, this.skipSymb)
          } else {
            acc.push(curr)
          }
          return acc
        }, [])
      }
      return items
    },
    prevUrl () {
      if (this.navigate && this.limitedValue !== 1) {
        return this.mapToRoute(this.limitedValue - 1)
      }
    },
    nextUrl () {
      if (this.navigate && this.limitedValue !== this.total) {
        return this.mapToRoute(this.limitedValue + 1)
      }
    },
    prevDisabled () {
      return this.limitedValue === 1
    },
    nextDisabled () {
      return this.limitedValue === this.total
    },
  },
  created () {
    if (this.navigate) {
      this.currentPage = Number(this.$route.query.page) || 1
    }
  },
  mounted () {
    if (this.navigate) {
      this.$watch('$route.query.page', (page: string) => {
        this.$emit('input', Number(page) || 1)
      })
    }
  },
  methods: {
    mapToRoute (page: number) {
      return {
        name: this.$route.name,
        params: this.$route.params,
        query: {
          ...this.$route.query,
          page: page === 1 ? undefined : page,
        }
      }
    },
    onClickPrev () {
      if (this.limitedValue !== 1) {
        this.$emit('input', this.limitedValue - 1)
      }
    },
    onClickNext () {
      if (this.limitedValue !== this.total) {
        this.$emit('input', this.limitedValue + 1)
      }
    },
    onClickItem (item: number) {
      if (item !== this.limitedValue) {
        this.$emit('input', item)
      }
    },
    range (from: number, to: number) {
      const range = []
      from = from > 0 ? from : 1
      for (let i = from; i <= to; i++) {
        range.push(i)
      }
      return range
    },
  },
})
