import cloneDeep from 'lodash/cloneDeep'
import { Avatar } from '@/models/user'
import File, { FileFromServer } from '@/models-ts/File'

export default class CompanyInfo {
  avatar: File | null
  website: string
  companyName: string
  employees: string | null
  description: string
  countries: Array<{ id: number, name: string }>

  constructor (
    {
      avatar = null,
      website = '',
      description = '',
      companyName = '',
      employees = null,
      countries = [],
    }: Partial<CompanyInfo>
  ) {
    Object.assign(this, cloneDeep({
      avatar,
      website,
      description,
      companyName,
      employees,
      countries
    }))
  }

  static fromServer (props: CompanyInfoServerProps) {
    return new CompanyInfo({
      avatar: props.relations.CompanyLogo?.length ? File.fromServer(props.relations.CompanyLogo[0]) : null,
      companyName: props.company_name || '',
      employees: props.employees || null,
      website: props.company_website || '',
      description: props.company_description || '',
      countries: (props.relations.Country || []).map(c => ({ id: c.id, name: c.name })),
    })
  }

  toServer () {
    return {
      company_name: this.companyName.trim(),
      company_website: this.website.trim(),
      company_description: this.description.trim(),
      employees: this.employees || null,
      relations: {
        CompanyLogo: this.avatar ? [this.avatar] : undefined,
        Country: this.countries.map(c => ({ id: c.id })),
      }
    }
  }
}

export type CompanyInfoServerProps = {
  company_name: string | null
  company_website: string | null
  company_description: string | null
  employees: string | null
  relations: {
    CompanyLogo: Array<FileFromServer>
    Country: Array<{ id: number, name: string }> | null
  }
}
