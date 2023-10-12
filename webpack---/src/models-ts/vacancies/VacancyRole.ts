export default class VacancyRole {
  id: number | string
  name: string

  constructor ({ id, name }: Partial<VacancyRole>) {
    Object.assign(this, { id, name })
  }

  static fromServer (props: Required<VacancyRole>) {
    return new VacancyRole({
      ...props,
    })
  }
}
