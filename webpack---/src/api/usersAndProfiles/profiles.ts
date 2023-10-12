import { BACKEND_LOYAL, BACKEND_PUBLIC } from '../base'

export interface BrowseFreelancersFilter {
  limit?: number
  offset?: number
  skills?: Array<string>
  review?: number
  search?: string
  orderField?: 'date' | 'rate',
  orderType?: 'asc' | 'desc',
  rateFrom?: number,
  rateTo?: number,
}

export async function getWorker (id: string | number) {
  return BACKEND_PUBLIC.get('/profiles/freelancer', { params: { id } })
}

export async function getCustomer (id: string | number) {
  return BACKEND_PUBLIC.get('/profiles/customer', { params: { id } })
}

export async function getRecruiter (id: string | number) {
  return BACKEND_PUBLIC.get('/profiles/recruiter', { params: { id } })
}

export async function getJobSeeker (id: string | number) {
  return BACKEND_LOYAL.get('/profiles/job-seeker', { params: { id } })
}

export async function searchFreelancers (params: BrowseFreelancersFilter) {
  return BACKEND_PUBLIC.get('profiles/providers', { params })
}
