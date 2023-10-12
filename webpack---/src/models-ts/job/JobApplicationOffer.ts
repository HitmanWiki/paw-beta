import cloneDeep from 'lodash/cloneDeep'
import { convertToLocal } from '@/utils/date'
import { GigOfferStages } from '@/constants-ts/gig/gigOfferStages'
import { GigTimeTypes } from '@/constants-ts/gig/gigTimeTypes'
import { JobOfferStages } from '@/constants-ts/job/jobOfferStages'

export default class JobApplicationOffer {
  id: number
  createdAt: Date
  deadline: number
  budget: string
  stage: JobOfferStages
  freelancerId: number
  customerId: number
  freelancerWallet: string

  constructor (data: Partial<JobApplicationOffer>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: JobApplicationOfferFromServer) {
    return new JobApplicationOffer({
      id: data.id,
      createdAt: new Date(convertToLocal(data.created_at)),
      deadline: data.deadline,
      budget: data.budget,
      stage: data.stage,
      freelancerId: data.freelancer_id,
      customerId: data.customer_id,
      freelancerWallet: data.freelancer_wallet,
    })
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type JobApplicationOfferFromServer = {
  id: number
  created_at: Date
  deadline: number
  budget: string
  stage: JobOfferStages
  freelancer_id: number
  customer_id: number
  freelancer_wallet: string
  job_application_id: number
}
