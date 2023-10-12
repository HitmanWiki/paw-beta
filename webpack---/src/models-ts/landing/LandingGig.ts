import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Skill from '@/models-ts/Skill'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { Avatar } from '@/models/user'
import { TIME_FIXED, TIME_HOURLY } from '@/constants/backend/service'
import { parseSlug } from '@/utils/parser'

export default class LandingGig {
  id: string | number
  slug: string
  name: string
  rate: string
  time_type: number // typeof TIME_FIXED | typeof TIME_HOURLY
  user: {
    id: string | number
    type: AccountTypes
    avatar: Avatar
    name: string
    rating: number
    reviewCount: number
  }
  skills: Array<Skill>

  constructor (data: Partial<LandingGig>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: LandingGigFromServer) {
    return new LandingGig({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      rate: data.rate,
      time_type: +data.time_type,
      user: {
        id: data.relations.Freelancer.id,
        type: data.relations.Freelancer.type,
        name: unescape(data.relations.Freelancer.name),
        avatar: Avatar.fromServer(data.relations.Freelancer.avatar),
        rating: data.relations.Freelancer.rating.avg_reviews,
        reviewCount: data.relations.Freelancer.reviews_count,
      },
      skills: (data.relations.Skill || []).map(Skill.fromServer),
    })
  }
}

export type LandingGigFromServer = {
  id: string | number
  slug: string
  name: string
  rate: string
  time_type: typeof TIME_FIXED | typeof TIME_HOURLY
  relations: {
    Freelancer: {
      id: string | number
      type: AccountTypes
      avatar: {}
      name: string
      reviews_count: number
      rating: {
        avg_reviews: number
      }
    }
    Skill: Array<Skill>
  }
}
