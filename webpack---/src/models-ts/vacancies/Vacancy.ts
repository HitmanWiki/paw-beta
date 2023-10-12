import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import get from 'lodash/get'
import omit from 'lodash/omit'
import VacancyRole from '@/models-ts/vacancies/VacancyRole'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { PositionType } from '@/constants-ts/vacancies/positionTypes'
import { SALARY_FIXED, SALARY_RANGE } from '@/constants-ts/vacancies/salaryTypes'
import { Stages, Statuses } from '@/constants-ts/vacancies/statuses'
import { Experience } from '@/constants-ts/vacancies/experiences'
import { VacancyModerationStages } from '@/constants-ts/vacancies/vacancyModerationStages'
import { parseSlug } from '@/utils-ts/parser'
import FreelancerListItem, { FreelancerListItemServerProps } from '@/models-ts/user/FreelancerListItem'
import VacancyRecruiter, { VacancyRecruiterFromServer } from './VacancyRecruiter'
import VacancyApplicationItem, { VacancyApplicationFromServer } from './VacancyApplicationItem'

export default class Vacancy {
  id: number | null
  slug: string | null
  status: Statuses | null
  stage: Stages | null
  customer_id: number | null
  name: string
  description : string
  position_office: boolean
  position_remote: boolean
  position_type: PositionType | null
  country_id: string | null
  country_name: string | null
  city_id: string | null
  city_name: string | null
  moderation_stage?: VacancyModerationStages | null
  payments_is_crypto: boolean
  salary_type: number
  salary_from: number
  salary_to: number
  work_experience: Experience | null
  primaryRole: VacancyRole['id'] | null
  primaryRoleName: VacancyRole['name'] | null
  external_url: string | null
  relations: {
    Skill: Array<Skill>
    Offer: Array<{}>
    Customer: VacancyRecruiter | null
  }
  applications: Array<VacancyApplicationItem>
  bookmarkId?: number | null
  category?: Skill | null
  relatedFreelancers: Array<FreelancerListItem> | null

  constructor (data: Partial<Vacancy> | void) {
    Object.assign(this, cloneDeep({
      id: null,
      slug: null,
      status: null,
      stage: null,
      customer_id: null,
      name: '',
      description: '',
      position_office: false,
      position_remote: false,
      position_type: null,
      city_id: null,
      city_name: null,
      country_id: null,
      country_name: null,
      payments_is_crypto: false,
      salary_type: SALARY_RANGE,
      salary_from: 0,
      salary_to: 0,
      work_experience: null,
      primaryRole: null,
      primaryRoleName: null,
      external_url: null,
      applications: [],
      relations: {
        Skill: [],
        Offer: [],
        Customer: null,
      },
      ...data,
    }))
  }

  static fromServer (data: VacancyFromServer) {
    const primaryRole = get(data.relations, 'PrimaryRole[0]', { id: null, name: null })
    return new Vacancy({
      ...data,
      name: unescape(data.name),
      slug: parseSlug(data.slug),
      position_office: Boolean(data.position_office),
      position_remote: Boolean(data.position_remote),
      payments_is_crypto: Boolean(data.payments_is_crypto),
      salary_from: Number(data.salary_from || 0),
      salary_to: Number(data.salary_to || 0),
      primaryRole: primaryRole.id,
      primaryRoleName: primaryRole.name,
      external_url: data.external_url,
      relations: {
        Customer: VacancyRecruiter.fromServer(data.relations.Customer),
        Skill: (data.relations.Skill || []).map(Skill.fromServer),
        Offer: (data.relations.Offer || [])
      },
      bookmarkId: get(data, 'meta.bookmarks[0].id', null),
      category: data.meta?.category,
      applications: (data.relations.Application || []).map(VacancyApplicationItem.fromServer),
      relatedFreelancers: (data.meta?.related?.freelancers || []).map(FreelancerListItem.fromServer),
    })
  }

  toServer () {
    const { primaryRole, payments_is_crypto, position_office, position_remote, salary_to, status, ...payload } = omit(this, 'country_id')
    return {
      ...payload,
      payments_is_crypto: Number(payments_is_crypto),
      position_office: Number(position_office),
      position_remote: Number(position_remote),
      salary_to: this.salary_type === SALARY_FIXED ? this.salary_from : this.salary_to,
      relations: {
        Skill: payload.relations.Skill.map(({ id }) => ({ id })),
        PrimaryRole: primaryRole ? [{ id: primaryRole }] : [],
      }
    }
  }

  get hasCompensation () {
    return this.salary_from > 0 || this.salary_to > 0
  }

  get location () {
    if (!this.city_name && !this.country_name) {
      return null
    }
    if (this.city_name && this.city_name !== this.country_name) {
      return `${this.city_name}, ${this.country_name}`
    }
    return this.city_name
  }

  get remoteInfo () {
    if (this.position_remote) {
      return this.position_office ? 'Hybrid' : 'Remote'
    }
    return 'Office'
  }
}

export type VacancyFromServer = {
  id: number
  slug: string
  is_removed: 0 | 1
  customer_id: number
  status: Statuses,
  stage: Stages,
  name: string
  description : string
  position_office: number
  position_remote: number
  position_type: PositionType
  country_id: string
  country_name: string
  city_id: string
  city_name: string
  moderation_stage?: VacancyModerationStages | null
  payments_is_crypto: number
  salary_type: number
  salary_from: string
  salary_to: string
  work_experience: Experience
  external_url: string | null
  relations: {
    Application?: Array<VacancyApplicationFromServer>
    Skill: Array<SkillFromServer>
    PrimaryRole: Array<Required<VacancyRole>>
    Customer: VacancyRecruiterFromServer
    Offer?: Array<{}>
  }
  meta: {
    bookmarks: Array<{ id: number }>
    category?: Skill
    related?: {
      freelancers: Array<FreelancerListItemServerProps>
    } | null
  } | null
}
