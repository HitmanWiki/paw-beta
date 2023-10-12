import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Image from '@/models/Image'
import { parseSlug } from '@/utils/parser'
import AccountType from '@/constants-ts/user/AccountType'
import Avatar from '@/models/user/Avatar'
import { FileFromServer } from '@/models-ts/File'
import Skill, { SkillFromServer } from '@/models-ts/Skill'

export default class GigListItem {
  id: number
  slug: string
  type: number
  name: string
  banner: Image
  skills: Array<Skill>
  rate: string
  timeType: number
  timeValue: number
  userId: number
  userType: AccountType
  userName: string
  avatar: Avatar
  avgReview: string
  userReviews: number
  views?: number
  completedContractsCount?: number

  constructor (data: Partial<GigListItem>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: GigListItemServerProps) {
    return new GigListItem({
      id: data.id,
      slug: parseSlug(data.slug),
      type: data.type,
      name: unescape(data.name),
      banner: Image.fromServer(data.banners, { maxSize: 609 }),
      userId: data.user.id,
      userName: unescape(data.user.name),
      userType: data.user.type,
      avatar: Avatar.fromServer(data.user.avatar),
      avgReview: (data.user.rating.avg_reviews || 0).toFixed(2),
      userReviews: data.user.reviews_count,
      skills: (data.skills || []).map(Skill.fromServer),
      rate: data.rate,
      timeType: data.time_type,
      timeValue: data.time_value,
      views: data.views,
      completedContractsCount: data.completedContractsCount,
    })
  }
}

export type GigListItemServerProps = {
  id: number
  slug: string
  type: number
  name: string
  banners: Array<FileFromServer>
  skills: Array<SkillFromServer>
  rate: string
  time_type: number
  time_value: number
  views: number
  completedContractsCount: number
  user: {
    id: number
    name: string
    type: AccountType
    avatar: {}
    reviews_count: number
    rating: {
      avg_reputation: number
      avg_reviews: number
    }
  }
}
