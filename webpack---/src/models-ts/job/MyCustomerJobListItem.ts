import BigNumber from 'bignumber.js'
import unescape from 'lodash/unescape'
import { BACKEND_CURRENCY_USDT_ID, CURRENCY_FIELD_BACKEND_ID } from '@/constants-ts/currency'
import { formatCurrency } from '@/utils/moneyFormat'
import { parseSlug } from '@/utils/parser'
import { stripDescriptionTags } from '@/utils-ts/strings'
import { JobApplicationStatuses } from '@/constants-ts/job/jobApplicationStatuses'
import { JobStatus } from '@/constants-ts/job/jobStatuses'
import { STAGE_NEW, STAGE_STARTED, JobStage } from '@/constants-ts/job/jobStages'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import { cloneDeep } from 'lodash'
import { getCurrency } from '@/utils-ts/currencies'
import { Blockchain } from '@/constants-ts/blockchain'
import { JobApplicationFromServer } from './JobApplication'
import UserInfo, { UserInfoFromServer } from '../user/UserInfo'
import { JobApplicationOfferFromServer } from './JobApplicationOffer'
import { JobOfferStages } from '@/constants-ts/job/jobOfferStages'
import { addDays } from '@/utils/date'
import { JobModerationStages } from '@/constants-ts/job/jobModerationStages'

export default class MyCustomerJobListItem {
  id: number
  sc_id: string
  status: JobStatus
  stage: JobStage
  moderationStage: JobModerationStages
  slug: string
  name: string
  description: string
  budget: string
  escrow_balance: string | null
  blockchain: Blockchain
  currency: number
  estimate: number | null
  offersCount: number
  offersCountNew: number
  offers: Array<any>
  skills: Array<Skill>
  freelancer: (UserInfo | null)
  customer_id: number
  freelancer_id?: number
  inProgressAt: string
  completedAt: string | null
  txid_created: string | null
  txid_completed: string | null
  contract_version: number | null
  customer_wallet: string
  job_application_id?: number
  hasReview: boolean

  constructor (data: Partial<MyCustomerJobListItem>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: MyJobListItemFromServer) {
    const apps = (data.relations.Application || []).filter(item => item.status === JobApplicationStatuses.NEW)
    return new MyCustomerJobListItem({
      id: data.id,
      sc_id: data.sc_id,
      status: data.status,
      stage: data.stage,
      moderationStage: data.moderation_stage,
      slug: parseSlug(data.slug),
      name: unescape(data.name),
      description: stripDescriptionTags(data.description, { stripLinks: true }),
      budget: data.budget || '0.00',
      blockchain: data.blockchain,
      currency: data.currency || BACKEND_CURRENCY_USDT_ID,
      offersCount: apps.length,
      offersCountNew: apps.filter(item => !item.is_read).length,
      escrow_balance: data.escrow_balance,
      estimate: data.deadline ? data.deadline / 86400 : 0, // from seconds to day
      inProgressAt: data.in_progress_at,
      completedAt: data.completed_at,
      txid_created: data.txid_created,
      txid_completed: data.txid_completed,
      contract_version: data.contract_version,
      customer_wallet: data.customer_wallet,
      customer_id: data.customer_id,
      freelancer_id: data.freelancer_id,
      skills: (data.relations.Skill || []).map(Skill.fromServer),
      freelancer: Array.isArray(data.relations.Freelancer) ? null : UserInfo.fromServer(data.relations.Freelancer),
      job_application_id: (data.relations.Offer || [])
        .find(offer => offer.stage === JobOfferStages.ACCEPTED_BY_CUSTOMER)?.job_application_id,
      hasReview: Array.isArray(data.relations.Review) ? false : !!data.relations.Review,
    })
  }

  get wasStarted () {
    return ![STAGE_NEW, STAGE_STARTED].includes(this.stage)
  }

  get currencyModel () {
    return getCurrency({ value: this.currency, blockchain: this.blockchain, field: CURRENCY_FIELD_BACKEND_ID })
  }

  get deadline () {
    if (this.inProgressAt) {
      const inProgressAt = this.inProgressAt
      const estimate = this.estimate || 0
      return addDays(inProgressAt, estimate)
    }
  }

  get escrowBalance () {
    if (this.escrow_balance && this.currencyModel) {
      return new BigNumber(this.escrow_balance).dividedBy(this.currencyModel.baseUnits)
    }
  }

  getBudgetFormat () {
    if (this.currencyModel) {
      if (this.escrowBalance) {
        return formatCurrency(this.escrowBalance, { currency: this.currencyModel })
      }
      return formatCurrency(this.budget, { currency: this.currencyModel })
    }
  }
}

export type MyJobListItemFromServer = {
  id: number
  sc_id: string
  status: JobStatus
  stage: JobStage
  moderation_stage: JobModerationStages
  slug: string
  name: string
  budget?: string
  description: string | null
  updated_at: string
  edited_at: string
  blockchain: Blockchain
  currency: number
  escrow_balance: string
  deadline: number | null
  customer_id: number
  freelancer_id?: number
  in_progress_at: string
  completed_at: string | null
  txid_created: string | null
  txid_completed: string | null
  contract_version: number | null
  customer_wallet: string
  relations: {
    Application: Array<Omit<JobApplicationFromServer, 'relations'>>
    Freelancer: UserInfoFromServer | Array<any>
    Skill: Array<SkillFromServer>
    Offer: Array<JobApplicationOfferFromServer>
    Review?: any
  }
}
