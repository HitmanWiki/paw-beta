import BigNumber from 'bignumber.js'
import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Skill from '@/models-ts/Skill'
import Avatar from '@/models/user/Avatar'
import File, { FileFromServer } from '@/models-ts/File'
import { BACKEND_CURRENCY_USDT_ID, CURRENCY_FIELD_BACKEND_ID } from '@/constants-ts/currency'
import { Blockchain } from '@/constants-ts/blockchain'
import { CAT_GENERATED_PDF } from '@/constants/file'
import { STATUS_NEW, STATUS_PUBLISHED, STATUS_DRAFT, JobStatus } from '@/constants-ts/job/jobStatuses'
import { STAGE_NEW, STAGE_STARTED, JobStage } from '@/constants-ts/job/jobStages'
import { JobModerationStages } from '@/constants-ts/job/jobModerationStages'
import { addDays, convertToLocal, convertToUTC, formatDate } from '@/utils/date'
import { getCurrency } from '@/utils-ts/currencies'
import { getUrl } from '@/utils/file'
import { formatCurrency, formatUsd } from '@/utils/moneyFormat'
import { parseSlug } from '@/utils-ts/parser'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { DATE_TIME_FORMAT } from '@/constants/date'
import JobListItem, { JobMoreFromServer } from './JobListItem'
import GigListItem, { GigListItemServerProps } from '../gigs/GigListItem'
import { JobApplicationOfferFromServer } from './JobApplicationOffer'
import JobApplication from './JobApplication'
import { JobApplicationStatuses } from '@/constants-ts/job/jobApplicationStatuses'
import JobApplicationMeta from './JobApplicationMeta'

export default class Job {
  id: number
  contractVersion: number | null
  slug: string
  sc_id: string
  created_at: string
  published_at: string
  edited_at: string
  name: string
  description: string
  blockchain: Blockchain
  budget: string
  delivery_time_at?: string | null
  currency: number | null
  estimate: number | null
  inProgressAt: string | null
  escrow_balance: string | null
  customer_wallet: string | null
  freelancer_wallet: string | null
  customer_id: number
  freelancer_id: number | null
  freelancer: {
    id: number
    name: string
    avatar: Avatar
    avgReviews: number | null
    reviewsCount: number
    type: AccountTypes
  } | null
  moderation_stage?: JobModerationStages | null
  relations: {
    File: Array<File>
    Skill: Array<Skill>
    Customer: {
      id: number
      name: string
      avatar: Avatar
      avgReviews: number | null
      createdAt: string
      meta: {}
      website: string | null
      type: AccountTypes
      reviewsCount: number
    } | null
    Review: Array<{
      id: number
      fromClient: boolean
      created_at: string
      text: string | null
      rates: {}
      user: {
        id: number
        name: string
        avatar: Avatar | null
        type: number
      }
    }>
  }
  applications: Array<JobApplication>
  status: JobStatus
  stage: JobStage
  more: {
    byCategory: Array<JobListItem>
    byUser: Array<JobListItem>
    gigsByCategory: Array<GigListItem>
  }
  isDone: boolean
  meta: {}

  constructor (data: Partial<Job> | void) {
    Object.assign(this, cloneDeep({
      id: 0,
      contractVersion: 2,
      slug: '',
      sc_id: null,
      created_at: '',
      published_at: '',
      edited_at: '',
      name: '',
      description: '',
      blockchain: Blockchain.Ethereum,
      budget: '0.00',
      currency: BACKEND_CURRENCY_USDT_ID,
      estimate: 0,
      inProgressAt: null,
      escrow_balance: null,
      customer_wallet: null,
      freelancer_wallet: null,
      delivery_time_at: null,
      customer_id: 0,
      freelancer_id: null,
      relations: {
        File: [],
        Skill: [],
        Offer: [],
        Customer: null,
        Review: [],
      },
      applications: [],
      status: STATUS_NEW,
      stage: STAGE_NEW,
      more: {
        byCategory: [],
        byUser: [],
        gigsByCategory: []
      },
      meta: {},
      ...data,
    }))
  }

  static fromServer (data: JobFromServer) {
    const freelancerData = data.relations.Freelancer
    const freelancer = (!freelancerData || Array.isArray(freelancerData)) ? null : {
      id: freelancerData?.id,
      name: unescape(freelancerData?.name),
      avatar: Avatar.fromServer(freelancerData.avatar),
      type: freelancerData.type,
      avgReviews: freelancerData.rating.avg_reviews,
      reviewsCount: freelancerData.reviews_count,
    }

    return new Job({
      id: data.id,
      contractVersion: data.contract_version,
      slug: parseSlug(data.slug),
      sc_id: data.sc_id,
      created_at: data.created_at,
      published_at: data.updated_at,
      edited_at: data.edited_at || data.created_at,
      name: unescape(data.name),
      description: data.description,
      delivery_time_at: data.delivery_time_at ? convertToLocal(data.delivery_time_at) : null,
      blockchain: data.blockchain,
      budget: data.budget ? String(Number(data.budget).toFixed(2)) : '0.00',
      currency: data.currency,
      estimate: data.deadline ? data.deadline / 86400 : 0, // from seconds to day
      inProgressAt: data.in_progress_at ? convertToLocal(data.in_progress_at) : null,
      escrow_balance: data.escrow_balance,
      customer_wallet: data.customer_wallet,
      freelancer_wallet: data.freelancer_wallet,
      customer_id: data.customer_id,
      freelancer_id: data.freelancer_id,
      freelancer: freelancer,
      status: data.status,
      stage: data.stage,
      meta: data.meta,
      more: {
        byCategory: (data.more?.jobs?.by_category || []).map(JobListItem.fromMoreServer),
        byUser: (data.more?.jobs?.by_user || []).map(JobListItem.fromMoreServer),
        gigsByCategory: (data.more?.gigs?.by_category || []).map(GigListItem.fromServer),
      },
      moderation_stage: data.moderation_stage,
      relations: {
        File: (data.relations?.File || []).map(File.fromServer),
        Skill: (data.relations.Skill || []).map(Skill.fromServer),
        Customer: data.relations.Customer ? {
          id: data.relations.Customer.id,
          name: unescape(data.relations.Customer.name),
          avatar: Avatar.fromServer(data.relations.Customer.avatar),
          avgReviews: data.relations.Customer.rating?.avg_reviews || 0,
          reviewsCount: data.relations.Customer?.reviews_count || 0,
          createdAt: data.relations.Customer.profile?.created_at,
          meta: data.relations.Customer.meta,
          website: data.relations.Customer.profile?.website || '',
          type: data.relations.Customer.type,
        } : null,
        // TODO change Review when rewrite Freelance model to ts
        Review: (data.relations.Review || []).map((review: ReviewFromServer) => {
          const result = {
            id: review.id,
            created_at: review.created_at,
            text: review.text || null,
            fromClient: false,
            user: {
              id: 0,
              name: '',
              avatar: new Avatar(),
              type: 0 as AccountTypes,
            },
            rates: {},
          }
          if (review.from_user_id === data.relations?.Customer?.id) {
            result.fromClient = true
            result.user.id = data.relations.Customer?.id
            result.user.type = data.relations.Customer?.type
            result.user.name = unescape(data.relations.Customer?.name)
            result.user.avatar = data.relations.Customer?.avatar ? Avatar.fromServer(data.relations.Customer?.avatar) : new Avatar()
          } else {
            result.fromClient = false
            // const freelancer = { ...(data.relations.Offer || [])
            //   .map(offer => offer.relations.Freelancer)
            //   .find(freelancer => freelancer.id === review.from_user_id)
            // }
            result.user.id = freelancer?.id || 0
            result.user.type = freelancer?.type || 0
            result.user.name = unescape(freelancer?.name)
            result.user.avatar = freelancer?.avatar ? Avatar.fromServer(freelancer.avatar) : new Avatar()
          }
          result.rates = (review.relations?.Rate || []).reduce((res: any, rate: any) => {
            res[rate.category] = rate.rate
            return res
          }, {})
          return result
        }),
      },
      applications: (data.relations.Application || []).map(app => {
        const appFreelancer = app.relations.Freelancer
        const customer = data.relations.Customer!
        return JobApplication.fromServer({
          id: app.id,
          status: app.status,
          is_read: app.is_read,
          comment: app.comment,
          budget: app.budget,
          deadline: app.deadline,
          tabs_meta: app.tabs_meta,
          relations: {
            Offers: (data.relations.Offer || []).filter(offer => offer.job_application_id === app.id),
            Job: {
              id: data.id,
              slug: data.slug,
              name: data.name,
              stage: data.stage,
              status: data.status,
              budget: data.budget,
              delivery_time_at: data.delivery_time_at ? convertToLocal(data.delivery_time_at) : null,
              blockchain: data.blockchain,
              currency: data.currency,
              escrow_balance: data.escrow_balance,
              deadline: data.deadline,
              in_progress_at: data.in_progress_at,
              is_done: data.is_done,
              contract_version: data.contract_version,
              relations: {
                File: data.relations.File,
              },
            },
            Freelancer: {
              id: appFreelancer.id,
              name: appFreelancer.name,
              type: appFreelancer.type,
              avatar: appFreelancer.avatar,
              rating: {
                avg_reviews: appFreelancer.avg_rating.avg_reviews,
              },
              reviews_count: (appFreelancer.reviews || []).length,
            },
            Customer: {
              id: customer.id,
              name: customer.name,
              type: customer.type,
              avatar: customer.avatar,
              rating: {
                avg_reviews: customer.rating?.avg_reviews || 0,
              },
              reviews_count: customer.reviews_count,
            }
          }
        })
      }),
      isDone: Boolean(data.is_done || false),
    })
  }

  toServer () {
    return {
      name: this.name.trim(),
      description: this.description,
      currency: this.currency,
      budget: this.budget,
      blockchain: this.blockchain,
      delivery_time_at: this.delivery_time_at ? convertToUTC(this.delivery_time_at, DATE_TIME_FORMAT) : null,
      deadline: this.deadline,
      relations: {
        Skill: this.relations.Skill.map(({ id }) => ({ id })),
        File: this.relations.File,
      }
    }
  }

  get isDraft () {
    return this.status === STATUS_DRAFT
  }

  get isPublished () {
    return this.status === STATUS_PUBLISHED
  }

  get isNotStarted () {
    return this.stage === STAGE_NEW
  }

  get wasStarted () {
    return ![STAGE_NEW, STAGE_STARTED].includes(this.stage)
  }

  get selectedCurrency () {
    return getCurrency({ value: this.currency, blockchain: this.blockchain, field: CURRENCY_FIELD_BACKEND_ID })
  }

  // get selectedOffer () {
  //   return (this.relations?.Offer || []).find(offer => offer.stage === OFFER_ACCEPTED)
  // }

  get deadline () {
    const inProgressAt = this.inProgressAt || ''
    const estimate = this.estimate || 0
    return addDays(inProgressAt, estimate)
  }

  get formattedBudget () {
    if (this.isNotStarted) {
      return `$${formatUsd(this.budget)}`
    }
    const currency = this.selectedCurrency!
    const escrowBalance = new BigNumber(this.escrow_balance || 0).dividedBy(currency.baseUnits)
    return `${formatCurrency(escrowBalance, { currency })} ${currency.name}`
  }

  get document () {
    const pdf = this.relations.File.find((file: any) => file.category === CAT_GENERATED_PDF)
    return pdf && getUrl(pdf)
  }
}

export type JobFromServer = {
  id: number
  contract_version: number | null
  slug: string
  sc_id: string
  created_at: string
  updated_at: string
  published_at: string
  edited_at: string
  name: string
  description: string
  blockchain: number
  budget: string
  delivery_time_at?: string
  currency: number
  deadline: number
  is_done: number
  in_progress_at: string | null
  escrow_balance: string | null
  customer_wallet: string | null
  freelancer_wallet: string | null
  customer_id: number
  freelancer_id: number | null
  status: JobStatus
  stage: JobStage
  meta: {}
  moderation_stage?: JobModerationStages | null
  relations: {
    File: Array<FileFromServer>
    Skill: Array<Skill>
    Offer?: Array<JobApplicationOfferFromServer> | null
    Application?: Array<JobApplicationFromServer> | null
    Customer: {
      id: number
      type: AccountTypes
      name: string
      rating: {
        avg_reviews: number
      } | null
      reviews_count: number
      profile: {
        created_at: string
        website: string | null
      }
      avatar: {}
      meta: {}
    } | null
    Freelancer: {
      id: number
      type: number
      name: string
      rating: {
        avg_reviews: number
      }
      avatar: {}
      reviews_count: number
    } | Array<any>
    Review: Array<ReviewFromServer> | null
  }
  more: {
    jobs: {
      by_category: Array<JobMoreFromServer> | null
      by_user: Array<JobMoreFromServer> | null
    }
    gigs: {
      by_category: Array<GigListItemServerProps> | null
    }
  } | null
}

export type ReviewFromServer = {
  id: number
  created_at: string
  text: string
  from_user_id: number
  relations: {
    Rate: Array<{
      category: string
      rate: number
    }> | null
  } | null
}

type JobApplicationFromServer = {
  id: number
  status: JobApplicationStatuses
  is_read: number
  comment?: string
  deadline: number
  budget: string
  tabs_meta?: JobApplicationMeta | null
  relations: {
    Freelancer: {
      id: number
      name: string
      type: AccountTypes
      avatar: {} | Array<any>
      avg_rating: {
        avg_reviews: number
      }
      reviews: Array<any> | null
    }
  }
}
