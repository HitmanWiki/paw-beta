import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Image from '@/models/Image'
import { CAT_IMG_ORIGINAL, CAT_IMG_RESIZED } from '@/constants/file'
import { parseSlug } from '@/utils/parser'
import AccountType from '@/constants-ts/user/AccountType'
import Avatar from '@/models/user/Avatar'
import { FileFromServer } from '@/models-ts/File'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { stripDescriptionTags } from '@/utils/contract'

export default class GigShort {
  id: number
  slug: string
  type: number
  name: string
  banner: Image
  description: string
  skills: Array<Skill>
  rate: string
  timeType: number
  userId: number
  userType: AccountType
  userName: string
  avatar: Avatar
  avgReview: string
  userReviews: number

  constructor (data: Partial<GigShort>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: GigShortServerProps) {
    return new GigShort({
      id: data.id,
      slug: parseSlug(data.slug),
      type: data.type,
      name: unescape(data.name),
      description: stripDescriptionTags(data.description),
      banner: Image.fromServer(data.banners, { maxSize: 609 }),
      userId: data.user_id,
      userName: unescape(data.userName),
      userType: data.userType,
      avatar: Avatar.fromServer(data.avatar),
      avgReview: Number(data.avgReview || 0).toFixed(2),
      userReviews: data.userReviews,
      skills: (data.skills || []).map(Skill.fromServer),
      rate: data.rate,
      timeType: data.timeType,
    })
  }
}

export type GigShortServerProps = {
  id: number
  slug: string
  type: number
  name: string
  description: string
  banners: Array<FileFromServer>
  skills: Array<SkillFromServer>
  rate: string
  timeType: number
  user_id: number
  userName: string
  userType: AccountType
  avgReview: number
  userReviews: number
  avatar: {}
}
