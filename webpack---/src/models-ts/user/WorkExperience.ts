import cloneDeep from 'lodash/cloneDeep'
import uniqueId from 'lodash/uniqueId'
import { formatDate, getDateFromString, isBefore } from '@/utils/date'

class WorkExperience {
  id: string | number
  organization: string
  position: string
  from: Date | null
  to: Date | null
  description: string

  constructor (
    {
      id = uniqueId('exp_'),
      organization = '',
      position = '',
      from = null,
      to = null,
      description = '',
    }: Partial<WorkExperience>) {
    Object.assign(this, cloneDeep({
      id,
      organization,
      position,
      from,
      to,
      description,
    }))
  }

  static fromServer (data: WorkExperienceFromServerProps) {
    const NOW = '1970-01'
    const toPrepared = data.to === '0' || isBefore(data.to, NOW) ? NOW : data.to
    return new WorkExperience({
      id: data.id,
      organization: data.organization,
      description: data.description || '',
      position: data.position,
      from: getDateFromString(data.from, false),
      to: getDateFromString(toPrepared, false),
    })
  }

  toServer () {
    const data: Partial<WorkExperienceFromServerProps> = {
      organization: this.organization.trim(),
      description: this.description.trim(),
      position: this.position.trim(),
      from: formatDate(this.from, 'YYYY-MM'),
      to: formatDate(this.to, 'YYYY-MM'),
    }
    if (!this.isNew) {
      data.id = this.id
    }
    return data
  }

  get range () {
    return [this.from, this.to]
  }
  set range (range) {
    this.from = range[0]
    this.to = range[1]
  }

  get isNew () {
    return typeof this.id === 'string' && this.id.startsWith('exp_')
  }

  isNow () {
    return this.to && formatDate(this.to, 'YYYY-MM') === '1970-01'
  }
}

export type WorkExperienceFromServerProps = {
  id: string | number
  organization: string
  position: string
  from: string
  to: string
  description: string | null
}

export default WorkExperience
