import { Avatar } from '@/models/user'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { cloneDeep } from 'lodash'
import { CustomerTypes } from '@/constants-ts/user/roles'

export default class VacancyRecruiter {
  id: number
  type: number
  name: string
  description: string
  avatar: Avatar
  website: string
  employees: number
  countries: Array<Country>
  skills: Array<Skill>
  customerType: CustomerTypes
  internalCountryId?: number
  constructor (
    {
      id = 0,
      type = 1,
      name = '',
      avatar = new Avatar(),
      website = '',
      employees = 0,
      countries = [],
      description = '',
      skills = [],
      customerType = CustomerTypes.INDIVIDUAL,
      internalCountryId
    }: Partial<VacancyRecruiter>
  ) {
    Object.assign(this, cloneDeep({
      id,
      type,
      name,
      description,
      avatar,
      website,
      employees,
      countries,
      skills,
      customerType,
      internalCountryId,
    }))
  }
  static fromServer ({
    id,
    type,
    name,
    avatar,
    profile,
    relations,
  }: VacancyRecruiterFromServer) {
    const isPerson = profile.type === CustomerTypes.INDIVIDUAL
    return new VacancyRecruiter({
      id,
      type,
      name,
      description: (isPerson ? profile.individual_description : profile.company_description) || '',
      avatar: Avatar.fromServer(avatar),
      website: isPerson ? profile.individual_website : profile.company_website,
      employees: profile.employees,
      countries: relations?.Country || [],
      skills: (relations?.Skill || []).map(Skill.fromServer),
      customerType: profile.type,
      internalCountryId: profile.internal_country_id,
    })
  }
}

export type VacancyRecruiterFromServer = {
  id: number
  type: number
  name: string
  avatar: {}
  profile: {
    type: CustomerTypes
    employees: number
    internal_country_id?: number
    individual_website?: string
    individual_description: string | null
    company_website?: string
    company_description: string | null
  }
  relations: {
    Country: Array<Country>
    Skill: Array<SkillFromServer> | null
  } | null
}

type Country = { id: number, name: string }
