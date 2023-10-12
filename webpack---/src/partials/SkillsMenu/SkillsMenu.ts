import Skill from '@/models-ts/Skill'
import { SubcategoriesWithSkills } from '@/store/shared/modules/skills/types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SubCategoryList from './SubCategoryList/SubCategoryList.vue'
import navigationSkills from '@/mixins/navigationSkills'

interface Data {
  selectedCategory: Skill | null
  selectedMore: boolean
  resizeObserver: ResizeObserver | null
}

export default Vue.extend<any, any, any>({
  mixins: [navigationSkills],
  components: {
    SubCategoryList,
  },
  data (): Data {
    return {
      selectedCategory: null,
      selectedMore: false,
      resizeObserver: null,
    }
  },
  computed: {
    ...mapGetters({
      getSubcategoriesWithSkills: 'skills/getSubcategoriesWithSkills',
    }),
    subSkills (): Array<SubcategoriesWithSkills> {
      if (this.selectedCategory) return this.getSubcategoriesWithSkills(this.selectedCategory.id)
      return []
    },
    hasSubSkillsContent () {
      return this.subSkills.some(this.hasSubCategoryContent)
    },
  },
  watch: {
    skillsLoaded () {
      if (this.skillsLoaded && process.client) {
        this.$nextTick(() => {
          this.moveMore()
          this.initObserver()
        })
      }
    },
  },
  mounted () {
    this.moveMore()
    this.initObserver()
  },
  beforeDestroy () {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  methods: {
    initObserver () {
      if (this.$refs.categories && !this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(this.moveMore)
        this.resizeObserver.observe(this.$refs.categories as HTMLUListElement)
      }
    },
    onSelectCategory (category: Skill | null) {
      if (category && !this.isMoreCategory(category)) {
        this.selectedMore = false
      }
      this.selectedCategory = category
    },
    onSelectMore () {
      this.selectedMore = true
      this.selectedCategory = this.sortedCategories.find((skill: Skill) => this.isMoreCategory(skill) && this.hasContent(skill))
    },
    hidePanel () {
      this.selectedCategory = null
      this.selectedMore = false
    },
    isSelected (category: Skill) {
      return category.name === this.selectedCategory?.name
    },
    isMoreCategory (category: Skill) {
      const categories = this.$refs.categories as HTMLUListElement
      if (categories) {
        const categoryEl = Array.from(categories.children).find(el => el.getAttribute('data-name') === category.name) as HTMLLIElement
        if (categoryEl) {
          return categoryEl.offsetTop > 8
        }
      }
      return false
    },
    moveMore () {
      const categoriesList = this.$refs.categories as HTMLUListElement
      const more = this.$refs['more-category'] as HTMLUListElement
      const gap = 34
      if (categoriesList) {
        const categories = Array.from(categoriesList.children) as Array<HTMLLIElement>
        if (categories.length) {
          let lastVisibleOffset = categories[0].offsetLeft + categories[0].clientWidth
          for (const el of categories) {
            if (el.offsetTop < 9) {
              lastVisibleOffset = el.offsetLeft + el.clientWidth
            } else {
              break
            }
          }
          more.style.left = `${lastVisibleOffset + gap}px`
        }
      }
      return false
    },
  }
})
