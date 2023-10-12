import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import unescape from 'lodash/unescape'
import { JobApplicationStatuses } from '@/constants-ts/job/jobApplicationStatuses'
import { parseSlug } from '@/utils-ts/parser'
import UserInfo, { UserInfoFromServer } from '@/models-ts/user/UserInfo'
import JobApplicationOffer, { JobApplicationOfferFromServer } from './JobApplicationOffer'
import { addDays, convertToLocal, getDateFromString } from '@/utils/date'
import { JobOfferStages } from '@/constants-ts/job/jobOfferStages'
import { JobStage, STAGE_COMPLETED, STAGE_DEADLINE_OVERDUE, STAGE_DISPUTED, STAGE_NEW, STAGE_STARTED } from '@/constants-ts/job/jobStages'
import { Blockchain } from '@/constants-ts/blockchain'
import { JobStatus } from '@/constants-ts/job/jobStatuses'
import { FileFromServer } from '../File'
import { CAT_GENERATED_PDF } from '@/constants/file'
import { getUrl } from '@/utils/file'
import JobApplicationMeta from './JobApplicationMeta'

export default class JobApplication {
  id: number
  status: JobApplicationStatuses
  comment: string
  offer?: JobApplicationOffer | null
  deadline: number
  budget: string
  isRead: boolean
  job: {
    id: number
    slug: string
    status: JobStatus
    stage: JobStage
    name: string
    budget: string
    delivery_time_at?: string | null
    blockchain: Blockchain
    currency: number | null
    escrow_balance: string | null
    estimate: number | null
    inProgressAt: string | null
    isDone: boolean
    contractVersion: number | null
    invoiceUrl: string | null
  }
  freelancer: UserInfo | null
  customer: UserInfo | null
  hasOffers: boolean
  meta?: JobApplicationMeta | null

  constructor (data: Partial<JobApplication>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: JobApplicationFromServer) {
    const offer = maxBy((data.relations?.Offers || [])
      .filter(offer => [JobOfferStages.NEW, JobOfferStages.ACCEPTED_BY_CUSTOMER].includes(offer.stage))
      .map(offer => ({
        ...offer,
        createdDate: +(getDateFromString(offer.created_at)),
      })), 'createdDate')

    const invoiceFile = (data.relations.Job.relations?.File || []).find((file: any) => file.category === CAT_GENERATED_PDF)
    const invoiceUrl = invoiceFile ? getUrl(invoiceFile) : null
    const job = data.relations?.Job
    return new JobApplication({
      id: data.id,
      status: data.status,
      isRead: Boolean(data.is_read),
      comment: data.comment || '',
      deadline: data.deadline,
      budget: data.budget,
      offer: offer ? JobApplicationOffer.fromServer(offer) : null,
      hasOffers: !!(data.relations?.Offers || []).length,
      job: {
        id: job.id || 0,
        slug: parseSlug(job?.slug),
        stage: job.stage,
        status: job.status,
        name: unescape(job.name),
        delivery_time_at: job.delivery_time_at,
        budget: job.budget ? String(Number(job.budget).toFixed(2)) : '0.00',
        blockchain: job.blockchain,
        currency: job.currency,
        escrow_balance: job.escrow_balance,
        estimate: job.deadline ? job.deadline / 86400 : 0, // from seconds to day
        inProgressAt: job.in_progress_at ? convertToLocal(job.in_progress_at) : null,
        isDone: Boolean(job.is_done || false),
        contractVersion: job.contract_version,
        invoiceUrl,
      },
      customer: data.relations?.Customer ? UserInfo.fromServer(data.relations?.Customer) : null,
      freelancer: data.relations?.Freelancer ? UserInfo.fromServer(data.relations?.Freelancer) : null,
      meta: data.tabs_meta,
    })
  }

  get estimatedDeadline () {
    if (this.wasStarted) {
      const inProgressAt = this.job.inProgressAt || ''
      const estimate = this.job.estimate || 0
      return addDays(inProgressAt, estimate)
    }
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }

  get wasStarted () {
    return ![STAGE_NEW, STAGE_STARTED].includes(this.job.stage)
  }

  get isCompleted () {
    return [STAGE_COMPLETED, STAGE_DEADLINE_OVERDUE, STAGE_DISPUTED].includes(this.job.stage)
  }
}

export type JobApplicationFromServer = {
  id: number
  status: JobApplicationStatuses
  comment?: string
  deadline: number
  budget: string
  is_read: number
  tabs_meta?: JobApplicationMeta | null
  relations: {
    Offers?: Array<JobApplicationOfferFromServer>
    Job: {
      id: number
      stage: JobStage
      status: JobStatus
      slug: string
      name: string
      budget: string
      delivery_time_at?: string | null
      blockchain: Blockchain
      currency: number | null
      escrow_balance: string | null
      deadline: number
      in_progress_at: string | null
      is_done: number
      contract_version: number | null
      relations?: {
        File: Array<FileFromServer>
      }
    }
    Freelancer?: UserInfoFromServer
    Customer?: UserInfoFromServer
  }
}
