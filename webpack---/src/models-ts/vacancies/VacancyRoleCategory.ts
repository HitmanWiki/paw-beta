import VacancyRole from './VacancyRole'

export default class VacancyRoleCategory {
  id: number | string
  name: string
  primaryRoles: Array<VacancyRole>

  constructor ({ id, name, primaryRoles }: Partial<VacancyRoleCategory>) {
    Object.assign(this, { id, name, primaryRoles })
  }

  static fromServer (props: Required<VacancyRoleCategory>) {
    return new VacancyRoleCategory({
      id: props.id,
      name: props.name,
      primaryRoles: (props.primaryRoles || []).map(VacancyRole.fromServer),
    })
  }
}
