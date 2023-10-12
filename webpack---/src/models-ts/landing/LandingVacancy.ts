import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Skill from '@/models-ts/Skill'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { Avatar } from '@/models/user'
import { parseSlug } from '@/utils/parser'
import { SALARY_FIXED } from '@/constants-ts/vacancies/salaryTypes'

export default class LandingVacancy {
  id: string | number
  slug: string
  publishedAt: string
  name: string
  description: string
  cityName: string
  countryName: string
  positionRemote: boolean
  positionOffice: boolean
  salary_type: number
  salary_from: number
  salary_to: number
  user: {
    id: string | number
    type: AccountTypes
    avatar: Avatar
    name: string
  }
  skills: Array<Skill>

  constructor (data: Partial<LandingVacancy>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: LandingVacancyFromServer) {
    return new LandingVacancy({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      publishedAt: data.first_published_at,
      description: data.description,
      cityName: data.city_name,
      countryName: data.country_name,
      positionRemote: Boolean(Number(data.position_remote)),
      positionOffice: Boolean(Number(data.position_office)),
      salary_type: Number(data.salary_type) || SALARY_FIXED,
      salary_from: Number(data.salary_from || 0),
      salary_to: Number(data.salary_to || 0),
      user: {
        id: data.relations.Customer.id,
        type: data.relations.Customer.type,
        name: unescape(data.relations.Customer.name),
        avatar: Avatar.fromServer(data.relations.Customer.avatar),
      },
      skills: (data.relations.Skill || []).map(Skill.fromServer),
    })
  }
}

export type LandingVacancyFromServer = {
  id: string | number
  slug: string
  name: string
  first_published_at: string
  description: string
  city_name: string
  country_name: string
  position_remote: number
  position_office: number
  salary_type: string
  salary_from: string
  salary_to: string
  relations: {
    Customer: {
      id: string | number
      type: AccountTypes
      avatar: {}
      name: string
    }
    Skill: Array<Skill>
  }
}
