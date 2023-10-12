import cloneDeep from 'lodash/cloneDeep'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { USER_TYPE_CUSTOMER_COMPANY, USER_TYPE_CUSTOMER_PERSON } from '@/constants-ts/user/roles'
import Channel, { ChannelFromServer } from '@/models-ts/user/Channel'
import PrefferedCurrency, { PrefferedCurrencyServerProps } from '@/models-ts/user/PrefferedCurrency'
import GeneralInfo, { GeneralInfoServerProps } from '../profiles/cutomer/GeneralInfo'
import IndividualInfo, { IndividualInfoServerProps } from '../profiles/cutomer/IndividualInfo'
import CompanyInfo, { CompanyInfoServerProps } from '../profiles/cutomer/CompanyInfo'
import { ReviewServerProps } from '@/models-ts/user/Review'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import JobListItem, { JobListItemServerProps } from '@/models-ts/job/JobListItem'

export default class CustomerDetails {
  userId: number
  fullName?: string
  bannedAt? :string
  avgReputation: number
  avgReviews: string
  completedJobs: number
  completedGigs: number
  roleWasSet: Boolean
  generalInfo: GeneralInfo
  individualInfo: IndividualInfo
  companyInfo: CompanyInfo
  skills: Array<Skill>
  currencies: Array<PrefferedCurrency>
  channels: Array<Channel>
  type: typeof USER_TYPE_CUSTOMER_PERSON | typeof USER_TYPE_CUSTOMER_COMPANY
  internalCountryId: number | null
  reviewsCount: number
  accountType: AccountTypes
  published: {
    jobs: Array<JobListItem>
  }
  constructor (
    {
      userId,
      fullName = '',
      bannedAt = '',
      avgReputation = 0,
      avgReviews = '0',
      completedJobs = 0,
      completedGigs = 0,
      roleWasSet = false,
      generalInfo,
      individualInfo,
      companyInfo,
      skills = [],
      currencies = [],
      channels = [],
      type = USER_TYPE_CUSTOMER_PERSON,
      internalCountryId = null,
      reviewsCount = 0,
      accountType = AccountTypes.USER_ACCOUNT_SIMPLE,
      published = {
        jobs: [],
      },
    }: Partial<CustomerDetails>
  ) {
    Object.assign(this, cloneDeep({
      userId,
      fullName,
      bannedAt,
      avgReputation,
      avgReviews,
      completedJobs,
      completedGigs,
      roleWasSet,
      generalInfo,
      individualInfo,
      companyInfo,
      skills,
      currencies,
      channels,
      type,
      internalCountryId,
      reviewsCount,
      accountType,
      published,
    }))
  }

  static fromServer (props: CustomerDetailsFromServerProps) {
    return new CustomerDetails({
      userId: props.user_id,
      fullName: props.meta?.user?.name || '',
      bannedAt: props.meta?.user?.banned_at || '',
      avgReputation: props.avg_reputation,
      avgReviews: Number(props.avg_reviews || 0).toFixed(2),
      completedJobs: props.meta?.completed?.jobs || 0,
      completedGigs: props.meta?.completed?.gigs || 0,
      type: props.type,
      roleWasSet: props.first_save === 1,
      accountType: props.meta.user.type,
      generalInfo: GeneralInfo.fromServer(props),
      reviewsCount: (props.meta?.review || []).length,
      individualInfo: IndividualInfo.fromServer(props),
      companyInfo: CompanyInfo.fromServer(props),
      skills: (props.relations.Skill || []).map(Skill.fromServer),
      channels: (props.relations.Channel || []).map(Channel.fromServer),
      internalCountryId: props.internal_country_id,
      currencies: (props.relations.Currency || [])
        .map(PrefferedCurrency.getFromSrever)
        .filter(Boolean) as Array<PrefferedCurrency>,
      published: {
        jobs: [], // (props.meta.published?.jobs || []).map(JobListItem.fromMoreServer)
      }
    })
  }
}

export type CustomerDetailsFromServerProps = GeneralInfoServerProps & IndividualInfoServerProps & CompanyInfoServerProps & {
  type: typeof USER_TYPE_CUSTOMER_PERSON | typeof USER_TYPE_CUSTOMER_COMPANY
  first_save: number
  user_id: number
  avg_reputation: number
  avg_reviews: number
  internal_country_id: number | null
  meta: {
    completed: {
      gigs: number
      jobs: number
    }
    published?: {
      jobs?: Array<JobListItemServerProps>
    }
    user: {
      banned_at: string
      name: string
      type: AccountTypes
    }
    review?: Array<ReviewServerProps>
  }
  relations: {
    Skill: Array<SkillFromServer> | null
    Channel: Array<ChannelFromServer> | null
    Currency: Array<PrefferedCurrencyServerProps> | null
  }
}
