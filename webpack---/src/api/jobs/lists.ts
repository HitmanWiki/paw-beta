import { JobStage } from '@/constants-ts/job/jobStages'
import { BACKEND_PRIVATE, BACKEND_PUBLIC } from '../base'

export interface BrowseJobsFilter {
  limit?: number
  offset?: number
  skills?: Array<string>
  search?: string
  orderField?: 'date' | 'rate',
  orderType?: 'asc' | 'desc',
  rateFrom?: string | number,
  rateTo?: string | number,
  avgReviews?: number,
  customerId?: number
}

export async function getMyCustomerJobList ({ stages, limit, offset }: { stages?: Array<JobStage>, limit: number, offset: number }) {
  return BACKEND_PRIVATE.get('/me/simple-jobs/list-as-customer', {
    params: {
      stages,
      limit,
      offset,
    }
  })
}

export async function getMyCustomerCompletedJobList ({ limit, offset }: { limit: number, offset: number}) {
  return BACKEND_PRIVATE.get('/me/simple-jobs/list-as-customer-of-completed', {
    params: {
      limit,
      offset,
    }
  })
}

export async function getClientJobList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/simple-jobs/list', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getClientActiveList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/customer/in-progress', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getClientCompletedList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/customer/completed', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getWorkerOffersList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/freelancer/offers', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getWorkerNegotiationsList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/applications/negotiations-as-freelancer', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getWorkerArchivedList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/applications/archived-as-freelancer', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getWorkerActiveList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/freelancer/in-progress', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getWorkerCompletedList (limit: number, offset: number) {
  return BACKEND_PRIVATE.get('/me/jobs/simple/freelancer/completed', {
    params: {
      limit: limit,
      offset
    }
  })
}

export async function getPublicJobsList (params: BrowseJobsFilter) {
  return BACKEND_PUBLIC.get('/simple-jobs/list', { params })
}

export async function getCountCustomerContracts () {
  return BACKEND_PRIVATE.get('me/jobs/employer/count')
}

export async function getCountFreelancerContracts () {
  return BACKEND_PRIVATE.get('me/jobs/worker/count')
}

export async function getRecommendedJobs ({ limit, offset }: { limit: number, offset: number }) {
  return BACKEND_PRIVATE.get('/me/simple-jobs/list-of-recommended', {
    params: {
      limit: limit,
      offset: offset
    }
  })
}
