import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'

export default class GeneralInfo {
  firstName: string
  lastName: string

  constructor (
    {
      firstName = '',
      lastName = '',
    }: Partial<GeneralInfo>
  ) {
    Object.assign(this, cloneDeep({
      firstName,
      lastName,
    }))
  }

  static fromServer (
    {
      first_name,
      last_name,
    }: GeneralInfoServerProps
  ) {
    return new GeneralInfo({
      firstName: unescape(first_name || ''),
      lastName: unescape(last_name || ''),
    })
  }

  toServer () {
    return {
      first_name: this.firstName.trim(),
      last_name: this.lastName.trim(),
    }
  }
}

export type GeneralInfoServerProps = {
  first_name: string | null
  last_name: string | null
}
