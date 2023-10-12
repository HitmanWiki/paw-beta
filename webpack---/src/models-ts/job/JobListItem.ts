import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import { Avatar, Skill } from '@/models/user'
import { parseSlug } from '@/utils/parser'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { SkillFromServer } from '../Skill'
import { stripDescriptionTags } from '@/utils-ts/strings'

export default class JobListItem {
  id: string
  slug: string
  name: string | null
  budget: string
  description: string | null
  publishedAt: string
  editedAt: string
  skills: Array<Skill>
  user: {
    id: number
    avatar: Avatar
    name: string
    avgReviews: number
    reviewsCount: number
    type: AccountTypes
    companyWebsite: string | null
    individualWebsite: string | null
  }
  constructor (data: Partial<JobListItem>) {
    Object.assign(this, cloneDeep(data))
  }

  get userWebsite () {
    return this.user.companyWebsite || this.user.individualWebsite
  }

  static fromServer (data: JobListItemServerProps) {
    return new JobListItem({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      budget: data.budget,
      description: stripDescriptionTags(data.description, { stripLinks: true }),
      publishedAt: data.updated_at || data.created_at,
      editedAt: data.edited_at || data.created_at,
      skills: (data.skills || []).map(Skill.fromServer),
      user: {
        id: data.user.id,
        name: unescape(data.user.name),
        avatar: Avatar.fromServer(data.user.avatar),
        type: data.user.type,
        avgReviews: data.user.rating.avg_reviews,
        reviewsCount: data.user.reviews_count,
        companyWebsite: data.user.profile.company_website,
        individualWebsite: data.user.profile.individual_website,
      }
    })
  }

  static fromMoreServer (data: JobMoreFromServer) {
    return new JobListItem({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      budget: data.budget || '0.00',
      description: stripDescriptionTags(data.description, { stripLinks: true }),
      publishedAt: data.updated_at,
      editedAt: data.edited_at,
      skills: (data.skills || []).map(Skill.fromServer),
      user: {
        id: data.user.id,
        name: unescape(data.user.name),
        avatar: Avatar.fromServer(data.user.avatar),
        type: data.user.type,
        avgReviews: data.user.rating.avg_reviews,
        reviewsCount: data.user.reviews_count,
        companyWebsite: data.user.profile.company_website,
        individualWebsite: data.user.profile.individual_website,
      }
    })
  }
}

export type JobListItemServerProps = {
  id: string
  budget: string
  slug: string
  name: string
  description: string | null
  published_at: string
  created_at: string
  updated_at: string
  edited_at: string
  skills: Array<SkillFromServer>
  user: {
    id: number
    name: string
    avatar: {}
    rating: {
      avg_reviews: number
    }
    reviews_count: number
    type: AccountTypes
    profile: {
      company_website: string | null
      individual_website: string | null
    }
  }
}

export type JobMoreFromServer = {
  id: string
  budget?: string
  slug: string
  name: string
  description: string | null
  updated_at: string
  edited_at: string
  skills: Array<SkillFromServer>
  user: {
    id: number
    name: string
    avatar: {}
    rating: {
      avg_reviews: number
    }
    reviews_count: number
    type: AccountTypes
    profile: {
      company_website: string | null
      individual_website: string | null
    }
  }
}
