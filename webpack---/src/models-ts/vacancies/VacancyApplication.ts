import unescape from 'lodash/unescape'
import { VacancyApplicationStatuses } from '@/constants-ts/vacancies/vacancyApplicationStatuses'
import cloneDeep from 'lodash/cloneDeep'
import File, { FileFromServer } from '@/models-ts/File'
import Skill, { SkillFromServer } from '@/models-ts/Skill'
import UserInfo, { UserInfoFromServer } from '@/models-ts/user/UserInfo'
import { parseSlug } from '@/utils-ts/parser'
import { PositionType } from '@/constants-ts/vacancies/positionTypes'
import { stripDescriptionTags } from '@/utils-ts/strings'
import { Stages } from '@/constants-ts/vacancies/statuses'

export default class VacancyApplication {
  id: number
  isRead: boolean
  freelancer: UserInfo & { position: string }
  customer: UserInfo
  status: VacancyApplicationStatuses
  comment: string
  cvFile?: File
  vacancyId: number
  vacancy: {
    id: number
    slug: string
    // status: JobStatus
    stage: Stages
    updated_at: string
    published_at?: string
    name: string
    description: string
    countryName: string | null
    cityName: string | null
    positionOffice: boolean
    positionRemote: boolean
    positionType: PositionType | null
    payments_is_crypto: number
    salary_type: number
    salary_from: number
    salary_to: number
    skills: Array<Skill>
  }
  constructor (data: Partial<VacancyApplication>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: VacancyApplicationFromServer) {
    const freelancer = data.relations.Freelancer
    const customer = data.relations.Customer
    const vacancy = data.relations.Vacancy
    const files = data.relations.File || []
    let cvFile
    if (files.length) {
      cvFile = File.fromServer(files[0])
    }
    return new VacancyApplication({
      id: data.id,
      isRead: Boolean(data.is_read),
      status: data.status,
      comment: data.comment,
      cvFile,
      vacancyId: data.vacancy_id,
      freelancer: {
        ...UserInfo.fromServer(freelancer),
        position: freelancer.profile.position,
      },
      customer: UserInfo.fromServer(customer),
      vacancy: {
        id: vacancy.id || 0,
        slug: parseSlug(vacancy?.slug),
        updated_at: vacancy.updated_at,
        published_at: vacancy.published_at,
        // stage: data.relations?.Job.stage,
        // status: data.relations?.Job.status,
        name: unescape(vacancy?.name),
        description: stripDescriptionTags(vacancy.description, { stripLinks: true }),
        cityName: vacancy.city_name,
        countryName: vacancy.country_name,
        positionOffice: Boolean(vacancy.position_office),
        positionRemote: Boolean(vacancy.position_remote),
        positionType: vacancy.position_type,
        payments_is_crypto: vacancy.payments_is_crypto,
        salary_type: vacancy.salary_type,
        salary_from: Number(vacancy.salary_from || 0),
        salary_to: Number(vacancy.salary_to || 0),
        skills: (vacancy.relations.Skill || []).map(Skill.fromServer),
        stage: vacancy.stage,
      },
    })
  }

  get hasCompensation () {
    return this.vacancy.salary_from > 0 || this.vacancy.salary_to > 0
  }

  get location () {
    const vacancy = this.vacancy
    if (!vacancy.cityName && !vacancy.countryName) {
      return null
    }
    if (vacancy.cityName && vacancy.cityName !== vacancy.countryName) {
      return `${vacancy.cityName}, ${vacancy.countryName}`
    }
    return vacancy.cityName
  }

  get remoteInfo () {
    const vacancy = this.vacancy
    if (vacancy.positionRemote) {
      return vacancy.positionOffice ? 'Hybrid' : 'Remote'
    }
    return 'Office'
  }
}

export type VacancyApplicationFromServer = {
  id: number
  is_read: number
  status: VacancyApplicationStatuses
  comment: string,
  vacancy_id: number
  relations: {
    Vacancy: {
      id: number
      stage: Stages
      // status: JobStatus
      updated_at: string
      published_at?: string
      slug: string
      name: string
      description: string
      country_name: string
      city_name: string
      position_office: number
      position_remote: number
      position_type: PositionType
      payments_is_crypto: number
      salary_type: number
      salary_from: string
      salary_to: string
      relations: {
        Skill: Array<SkillFromServer>
      }
    }
    File: Array<FileFromServer>
    Freelancer: UserInfoFromServer & { profile: { position: string } }
    Customer: UserInfoFromServer
  }
}
