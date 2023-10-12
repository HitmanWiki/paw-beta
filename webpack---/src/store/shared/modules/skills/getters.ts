import { GetterTree } from 'vuex'
import { ISkillsState, SubcategoriesWithSkills } from './types'
import { RootState } from '@/store'
import Skill from '@/models-ts/Skill'

const getChilds = (array: Array<Skill>, id: Skill['id']) =>
  array.filter(item => (item.relations?.Parent || []).some(({ parent_id }) => parent_id === id))

const getParents = (array: Array<Skill>, skill: Skill) => (skill.relations?.Parent || [])
  .map(({ parent_id }) => array.find(p => p.id === parent_id))
  .filter(s => s) as Array<Skill>

export default {
  getChilds: state => (id: Skill['id'], deep = 2) => {
    const childs = getChilds(state.skills.value, id)
    if (deep > 1) {
      childs.push(...childs.reduce((res, skill) => {
        res.push(...getChilds(state.skills.value, skill.id))
        return res
      }, [] as Array<Skill>))
    }
    return [...new Set(childs)]
  },
  getRoots: state => (child: number | Skill) => {
    const childSkill = typeof child === 'number' ? state.skills.value.find(s => s.id === child) : child
    if (childSkill) {
      const parents = getParents(state.skills.value, childSkill)
      if (parents.length) {
        const roots = parents
          .map(skill => getParents(state.skills.value, skill))
          .reduce((acc, skills) => acc.concat(skills))
        return [...new Set(parents.concat(roots))]
      } else {
        return [childSkill]
      }
    }
  },
  getCategories: state => {
    return state.skills.value.filter(skill => !(skill.relations?.Parent || []).length)
  },
  getSubcategoriesWithSkills: state => (categoryId: Skill['id']) => {
    const subCategories = getChilds(state.skills.value, categoryId)
    const extraSkills: Array<Skill> = []
    const result = subCategories.map(cat => {
      const skills = getChilds(state.skills.value, cat.id)
      if (skills.length === 0) {
        extraSkills.push(cat)
        return null
      }
      return {
        subCategory: cat,
        skills,
      }
    }).filter(Boolean) as Array<SubcategoriesWithSkills>
    if (extraSkills.length > 0) {
      result.push({
        subCategory: 'Other',
        skills: extraSkills,
      })
    }
    return result
  }
} as GetterTree<ISkillsState, RootState>
