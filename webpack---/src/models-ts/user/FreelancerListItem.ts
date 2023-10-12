import cloneDeep from 'lodash/cloneDeep'
import { Avatar } from '@/models/user'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
export default class FreelancerListItem {
  id: number | string
  type: AccountTypes
  name: string
  avatar: Avatar
  profession: string | null
  rate: string | null
  registered: string | null
  dob: string | null
  bio: string | null
  city: string | null
  country: string | null
  position: string | null
  specialization: string | null
  avg_reputation: number | string
  avg_reviews: number | string
  skills: Array<Skill>
  count: {
    reviews: number
    completed_contracts: number
  }

  constructor (data: Partial<FreelancerListItem>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: FreelancerListItemServerProps) {
    const completed = data.meta?.completed
    const completed_contracts = completed
      ? completed.gigs + completed.jobs + completed.vacancies
      : 0
    return new FreelancerListItem({
      id: data.id,
      type: data.type,
      name: data.name,
      avatar: Avatar.fromServer(data.avatar),
      profession: data.profile?.profession,
      rate: data.profile?.rate,
      registered: data.profile?.created_at,
      dob: data.profile?.dob,
      bio: data.profile?.bio,
      city: data.profile?.city,
      country: data.profile?.country_name,
      position: data.profile?.position,
      specialization: data.profile?.specialization,
      avg_reputation: data.rating?.avg_reputation || 0,
      avg_reviews: data.rating?.avg_reviews || 0,
      skills: (data.relations?.Skill || []).map(Skill.fromServer),
      count: {
        reviews: data.reviews_count || 0,
        completed_contracts,
      }
    })
  }
}

export type FreelancerListItemServerProps = {
  id: number
  type: AccountTypes
  name: string
  avatar: {}
  reviews_count: number
  rating: {
    avg_reputation?: number
    avg_reviews?: number
  }
  relations: {
    Skill: Array<SkillFromServer> | null
  }
  meta: {
    completed?: {
      gigs: number,
      jobs: number,
      vacancies: number
    }
  }
  profile: {
    profession: string | null
    rate: string | null
    created_at: string
    dob: string | null
    bio: string | null
    city: string | null
    country_name: string | null
    position: string | null
    specialization: string | null
  }
}
