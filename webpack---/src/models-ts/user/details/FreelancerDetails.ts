import cloneDeep from 'lodash/cloneDeep'
import unescape from 'lodash/unescape'
import Education, { EducationFromServerProps } from '@/models-ts/user/Education'
import Channel, { ChannelFromServer } from '@/models-ts/user/Channel'
import File, { FileFromServer } from '@/models-ts/File'
import { Avatar } from '@/models/user'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import PrefferedCurrency, { PrefferedCurrencyServerProps } from '@/models-ts/user/PrefferedCurrency'
import WorkExperience, { WorkExperienceFromServerProps } from '@/models-ts/user/WorkExperience'
import Review, { ReviewServerProps } from '@/models-ts/user/Review'
import PortfolioProject, { PortfolioProjectFromServerProps } from '@/models-ts/user/PortfolioProject'
import GigShort, { GigShortServerProps } from '@/models-ts/gigs/GigShort'
import AccountType from '@/constants-ts/user/AccountType'

export default class FreelancerDetails {
  id: number
  isPretty: boolean
  firstName?: string
  lastName?: string
  fullName?: string
  bannedAt? :string
  avatar: Avatar
  type: AccountType
  avgReview: string
  reputation: number
  completedGigs: number
  completedJobs: number
  website: string
  skills: Array<Skill>
  specialization: string
  cityName: string
  countryName: string
  rate: string
  currencies: Array<PrefferedCurrency>
  bio: string
  channels: Array<Channel>
  workExperience: Array<WorkExperience>
  educations: Array<Education>
  reviews: Array<Review>
  portfolio: Array<PortfolioProject>
  gigs: Array<GigShort>
  cv: Array<File>
  internalCountryId: number | null

  constructor (data: Partial<FreelancerDetails>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: FreelancerDetailsServerProps) {
    return new FreelancerDetails({
      id: data.user_id,
      isPretty: data.is_pretty,
      type: data.type,
      avatar: Avatar.fromServer(data.relations.avatar),
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.meta?.user?.name || '',
      bannedAt: data.meta?.user?.banned_at || '',
      avgReview: Number(data.avg_reviews || 0).toFixed(2),
      reputation: data.avg_reputation || 0,
      completedGigs: data.meta?.completed?.gigs || 0,
      completedJobs: data.meta?.completed?.jobs || 0,
      website: data.website || '',
      cityName: data.city_name || '',
      countryName: data.country_name || '',
      skills: (data.relations.Skill || []).map(Skill.fromServer),
      specialization: data.specialization || '',
      rate: data.rate || '',
      bio: data.bio || '',
      currencies: (data.relations.Currency || [])
        .map(PrefferedCurrency.getFromSrever)
        .filter(Boolean) as Array<PrefferedCurrency>,
      channels: (data.relations.Channel || []).map(Channel.fromServer),
      workExperience: (data.relations.Experience || []).map(WorkExperience.fromServer),
      educations: (data.relations.Education || []).map(Education.fromServer),
      reviews: (data.meta?.review || []).map(Review.fromServer),
      portfolio: (data.relations.Portfolio || []).map(PortfolioProject.fromServer),
      internalCountryId: data.internal_country_id,
      gigs: (data.meta?.gigs || []).map(gig => GigShort.fromServer({
        id: gig.id,
        slug: gig.slug,
        type: gig.type,
        name: gig.name,
        description: gig.description,
        banners: gig.banners,
        skills: gig.skills,
        rate: gig.rate,
        timeType: gig.time_type,
        user_id: gig.user_id,
        userName: data.meta.user?.name || '',
        userType: data.type,
        avatar: data.relations.avatar,
        avgReview: data.avg_reviews || 0,
        userReviews: (data.meta?.review || []).length,
      })),
      cv: (data.relations.Cv || []).map(File.fromServer),
    })
  }
}

export type FreelancerDetailsServerProps = {
  user_id: number
  is_pretty: boolean
  type: AccountType
  first_name?: string
  last_name?: string
  avg_reviews?: number
  avg_reputation?: number
  website?: string
  city_name: string | null
  country_name: string | null
  rate: string | null
  bio: string | null
  specialization: string | null
  internal_country_id: number | null
  relations: {
    Skill: Array<SkillFromServer> | null
    Currency: Array<PrefferedCurrencyServerProps> | null
    Experience: Array<WorkExperienceFromServerProps> | null
    Education: Array<EducationFromServerProps> | null
    Portfolio: Array<PortfolioProjectFromServerProps> | null
    avatar: {}
    Channel: Array<ChannelFromServer>
    Cv: Array<FileFromServer> | null
  }
  meta: {
    completed?: {
      gigs: number,
      jobs: number,
    }
    user?: {
      name: string
      banned_at: string
    }
    review?: Array<ReviewServerProps>
    gigs?: Array<{
      id: number
      slug: string
      description: string
      type: number
      name: string
      skills: Array<SkillFromServer>
      banners: Array<FileFromServer>
      user_id: number
      rate: string
      time_type: number
    }>
  }
}
