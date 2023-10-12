import { Commit } from 'vuex'
import VacancyRoleCategory from '@/models-ts/vacancies/VacancyRoleCategory'
import { getCategoryRoles } from '@/api/vacancies'
import { IVacancyRolesState } from './types'

const getInitialState = (): IVacancyRolesState => ({
  roles: [],
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    setRoles: (state: IVacancyRolesState, roles: Array<VacancyRoleCategory>) => {
      state.roles = roles
    },
  },
  getters: {
    rolesOptions: (state: IVacancyRolesState) => state.roles.reduce((options, category) => {
      options.push({ id: category.id, name: category.name, readOnly: true })
      category.primaryRoles.forEach(role => {
        options.push({
          id: role.id,
          name: role.name,
          relations: { Parent: [{ parent_id: category.id }] }
        })
        return options
      })
      return options
    }, [] as any)
  },
  actions: {
    async getRoles ({ commit, state }: { commit: Commit, state: IVacancyRolesState }) {
      if (state.roles.length) {
        return state.roles
      }
      const rolesData = await getCategoryRoles()
      const roles = rolesData.map(VacancyRoleCategory.fromServer)
      commit('setRoles', roles)
      return roles
    },
  }
})
