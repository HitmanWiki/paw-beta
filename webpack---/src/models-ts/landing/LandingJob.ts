import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Skill from '@/models-ts/Skill'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { Avatar } from '@/models/user'
import { parseSlug } from '@/utils/parser'

export default class LandingJob {
  id: string | number
  slug: string
  name: string
  description: string
  budget: string
  user: {
    id: string | number
    type: AccountTypes
    avatar: Avatar
    name: string
    companyWebsite: string | null
    individualWebsite: string | null
  }
  skills: Array<Skill>
  publishedAt: string

  constructor (data: Partial<LandingJob>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: LandingJobFromServer) {
    const customer = data.relations.Customer
    return new LandingJob({
      id: data.id,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      budget: data.budget,
      description: data.description,
      user: {
        id: customer.id,
        type: customer.type,
        name: unescape(customer.name),
        avatar: Avatar.fromServer(customer.avatar),
        companyWebsite: customer.profile.company_website,
        individualWebsite: customer.profile.individual_website,
      },
      skills: (data.relations.Skill || []).map(Skill.fromServer),
      publishedAt: data.first_published_at,
    })
  }

  get userWebsite () {
    return this.user.companyWebsite || this.user.individualWebsite
  }
}

export type LandingJobFromServer = {
  id: string | number
  slug: string
  first_published_at: string
  name: string
  description: string
  budget: string
  relations: {
    Customer: {
      id: string | number
      type: AccountTypes
      avatar: {}
      name: string
      profile: {
        company_website: string | null
        individual_website: string | null
      }
    }
    Skill: Array<Skill>
  }
}
