import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Image from '@/models/Image'
import { parseSlug } from '@/utils/parser'
import { stripDescriptionTags } from '@/utils/contract'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { GigStatuses } from '@/constants-ts/gig/gigStatuses'
import { GigTimeTypes } from '@/constants-ts/gig/gigTimeTypes'
import { FileFromServer } from '@/models-ts/File'

class MyGigListItem {
  id: number
  slug: string
  name: string
  description: string
  rate: string
  banner: Image
  skills: Array<Skill>
  status: GigStatuses
  timeType: GigTimeTypes
  timeValue: string
  views: number | string

  constructor (data: Partial<MyGigListItem>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: MyGigListItemServerProps) {
    return new MyGigListItem({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      banner: Image.fromServer(data.banners, { maxSize: 700 }),
      status: +data.status,
      description: stripDescriptionTags(data.description),
      timeValue: String(data.time_value || 0),
      timeType: +data.time_type,
      rate: data.rate,
      skills: (data.skills || []).map(Skill.fromServer),
      views: data.views,
    })
  }
}

export type MyGigListItemServerProps = {
  id: number
  slug: string
  name: string
  description: string
  rate: string
  banners: Array<FileFromServer>
  skills: Array<SkillFromServer>
  status: GigStatuses
  time_type: GigTimeTypes
  time_value: string
  views: number | string
}

export default MyGigListItem
