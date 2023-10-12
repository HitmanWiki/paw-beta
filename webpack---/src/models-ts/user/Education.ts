import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import { EducationDegree } from '@/constants-ts/user/educationDegrees'

export default class Education {
  id: string | number
  university: string
  major: string
  year: string | null
  degree: EducationDegree | null

  constructor ({
    id = uniqueId('exp_'),
    university = '',
    major = '',
    year = null,
    degree = null,

  }: Partial<Education>) {
    Object.assign(this, cloneDeep({ id, university, major, year, degree }))
  }
  static fromServer (data: EducationFromServerProps) {
    return new Education({
      id: data.id,
      university: data.university || '',
      major: get(data, 'major[0].value', ''),
      year: data.years,
      degree: data.degree,
    })
  }

  toServer () {
    return {
      university: this.university!.trim(),
      major: [{ value: this.major!.trim() }],
      years: this.year,
      degree: this.degree,
    }
  }
}

export type EducationFromServerProps = {
  id: string | number
  university: string
  major: Array<{ value: string }>
  years: string
  degree: EducationDegree
}
