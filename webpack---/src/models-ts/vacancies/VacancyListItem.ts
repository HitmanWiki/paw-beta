import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import get from 'lodash/get'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { Avatar } from '@/models/user'
import { Experience } from '@/constants-ts/vacancies/experiences'
import { PositionType } from '@/constants-ts/vacancies/positionTypes'
import { VacancyRecruiterFromServer } from './VacancyRecruiter'
import { parseSlug } from '@/utils-ts/parser'
import { stripDescriptionTags } from '@/utils-ts/strings'
import VacancyRole from './VacancyRole'

export default class VacancyListItem {
  id: string | number
  user?: VacancyUserItem | null
  bookmarkId?: number
  slug: string
  name: string
  created_at: string
  updated_at: string
  published_at?: string
  description: string
  city_name: string
  country_name: string
  payments_is_crypto: number
  position_office: boolean
  position_remote: boolean
  position_type: PositionType
  primaryRoleName: VacancyRole['name']
  salary_type: number
  salary_from: number
  salary_to: number
  work_experience: Experience
  skills: Array<Skill>

  constructor (data: Partial<VacancyListItem>) {
    Object.assign(this, cloneDeep({
      id: data.id,
      user: data.user,
      bookmarkId: data.bookmarkId,
      slug: data.slug,
      name: unescape(data.name),
      city_name: data.city_name,
      country_name: data.country_name,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      payments_is_crypto: data.payments_is_crypto,
      published_at: data.published_at,
      position_office: data.position_office,
      position_remote: data.position_remote,
      position_type: data.position_type,
      primaryRoleName: data.primaryRoleName,
      salary_type: data.salary_type,
      salary_to: data.salary_to,
      salary_from: data.salary_from,
      skills: data.skills,
      work_experience: data.work_experience,
    }))
  }

  static fromServer (data: VacancyListItemFromServer) {
    const primaryRole = get(data, 'primaryRoles[0]', { id: null, name: null })
    return new VacancyListItem({
      ...data,
      user: {
        id: data?.user?.id,
        type: data?.user?.type,
        name: data?.user?.name,
        avatar: Avatar.fromServer(data?.user?.avatar || {}),
      },
      position_office: Boolean(Number(data.position_office)),
      position_remote: Boolean(Number(data.position_remote)),
      published_at: data.first_published_at,
      bookmarkId: get(data.bookmarks, '[0].id'),
      slug: parseSlug(data.slug),
      description: stripDescriptionTags(data.description, { stripLinks: true }),
      primaryRoleName: primaryRole.name,
      salary_type: Number(data.salary_type),
      salary_from: Number(data.salary_from || 0),
      salary_to: Number(data.salary_to || 0),
      skills: (data.skills || []).map(Skill.fromServer),
    })
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

export type VacancyListItemFromServer = {
  id: string | number
  user?: VacancyUserItem | null
  bookmarks: Array<{id: number}> | null
  slug: string
  name: string
  created_at: string
  updated_at: string
  first_published_at: string
  description: string
  city_name: string
  country_name: string
  payments_is_crypto: number
  position_office: '0' | '1'
  position_remote: '0' | '1'
  position_type: PositionType
  salary_type: number | string
  salary_from: string
  salary_to: string
  work_experience: Experience
  PrimaryRole: Array<Required<VacancyRole>>
  skills: Array<SkillFromServer>
  relations: {
    Customer: VacancyRecruiterFromServer
  }
}

type VacancyUserItem = {
  id?: string | number
  type?: string | number
  name?: string
  avatar?: {}
}
