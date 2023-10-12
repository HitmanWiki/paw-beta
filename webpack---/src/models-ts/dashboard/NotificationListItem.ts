import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import { GigStatuses } from '@/constants-ts/gig/gigStatuses'
import { JobStatus } from '@/constants-ts/job/jobStatuses'
import { JobStage } from '@/constants-ts/job/jobStages'
import { ContractVersion } from '@/constants-ts/contracts'
import { Blockchain } from '@/constants-ts/blockchain'
import { Statuses } from '@/constants-ts/vacancies/statuses'

export default class NotificationListItem {
  id: number
  text: string
  event: string
  readed: boolean
  btnsLoaders: Array<boolean>
  gig_id: number | null
  gig_job_id: number | null
  job_id: number | null
  vacancy_id: number | null
  params: {
    winner?: 'Freelancer' | 'Customer' | 'Both'
    room_id?: string | null
    job_id?: string | null
    gig_id?: string | null
    slug?: string | null
    link?: string | null
    gig?: {
      id: number
      slug: string
      name: string
      status: GigStatuses
    } | null
    job?: {
      id: number
      slug: string
      name: string
      status: JobStatus
      stage: JobStage
      contract_version: ContractVersion
      blockchain: Blockchain
      txid?: string | null
      customer_id: number
      customer_wallet: number
      freelancer_id: number
      freelancer_wallet: string
    } | null
    vacancy?: {
      id: number
      slug: string
      status: Statuses
    } | null
    review?: {
      id: number
    } | null
    // offer?: {
    //   id: number
    //   freelancer_id: number
    // }
  }

  constructor (data: Partial<NotificationListItem>) {
    Object.assign(this, cloneDeep({
      ...data,
      btnsLoaders: [false, false],
    }))
  }

  static fromServer (data: NotificationListItemFromServer) {
    const text = unescape(data.text).replaceAll(/\u200B/g, '')
    const gigParams = data.params?.gig
    const jobParams = data.params?.job
    const vacancyParams = data.params?.vacancy
    const reviewParams = data.params?.review && !Array.isArray(data.params?.review) ? data.params.review : null
    return new NotificationListItem({
      id: data.id,
      text,
      event: data.event,
      readed: data.read === 1,
      gig_id: data.gig_id,
      gig_job_id: data.gig_job_id,
      job_id: data.job_id,
      vacancy_id: data.vacancy_id,
      params: data.params ? {
        winner: data.params.winner,
        room_id: data.params.room_id,
        job_id: data.params.job_id,
        gig_id: data.params.gig_id,
        slug: data.params.slug,
        link: data.params.link,
        gig: gigParams ? {
          id: gigParams.id,
          slug: gigParams.slug,
          name: gigParams.name,
          status: gigParams.status,
        } : null,
        job: jobParams ? {
          id: jobParams.id,
          slug: jobParams.slug,
          name: jobParams.name,
          status: jobParams.status,
          stage: jobParams.stage,
          contract_version: jobParams.contract_version,
          blockchain: jobParams.blockchain,
          txid: jobParams.txid,
          customer_id: jobParams.customer_id,
          customer_wallet: jobParams.customer_wallet,
          freelancer_id: jobParams.freelancer_id,
          freelancer_wallet: jobParams.freelancer_wallet,
        } : null,
        vacancy: vacancyParams ? {
          id: vacancyParams.id,
          slug: vacancyParams.slug,
          status: vacancyParams.status,
        } : null,
        review: reviewParams ? {
          id: reviewParams.id,
        } : null
      } : {}
    })
  }

  get byGig () {
    return !!this.gig_id
  }

  get byVacancy () {
    return !!this.vacancy_id
  }
}

export interface NotificationListItemFromServer {
  id: number
  text: string
  event: string
  read: number
  btnsLoaders: Array<boolean>
  byGig: boolean
  byVacancy: boolean
  gig_id: number | null
  job_id: number | null
  gig_job_id: number | null
  vacancy_id: number | null
  params?: {
    winner?: 'Freelancer' | 'Customer' | 'Both'
    room_id?: string | null
    job_id?: string | null
    gig_id?: string | null
    slug?: string | null
    link?: string | null
    gig?: {
      id: number
      slug: string
      name: string
      status: GigStatuses
    }
    job?: {
      id: number
      slug: string
      name: string
      status: JobStatus
      stage: JobStage
      contract_version: ContractVersion
      blockchain: Blockchain
      txid?: string | null
      customer_id: number
      customer_wallet: number
      freelancer_id: number
      freelancer_wallet: string
    }
    vacancy?: {
      id: number
      slug: string
      status: Statuses
    }
    review?: {
      id: number
    }
  }
}
