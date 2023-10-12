import cloneDeep from 'lodash/cloneDeep'
import { Avatar } from '@/models/user'
import File, { FileFromServer } from '@/models-ts/File'

export default class IndividualInfo {
  avatar: Avatar | null
  website: string
  internalCountryId: number | null
  description: string

  constructor (
    {
      avatar = null,
      website = '',
      description = '',
      internalCountryId = null,
    }: Partial<IndividualInfo>
  ) {
    Object.assign(this, cloneDeep({
      avatar,
      website,
      description,
      internalCountryId,
    }))
  }

  static fromServer (props: IndividualInfoServerProps) {
    return new IndividualInfo({
      avatar: props.relations.avatar?.length ? Avatar.fromServer(props.relations.avatar) : null,
      website: props.individual_website || '',
      description: props.individual_description || '',
      internalCountryId: props.internal_country_id,
    })
  }

  toServer () {
    return {
      individual_description: this.description.trim(),
      individual_website: this.website.trim(),
      internal_country_id: this.internalCountryId,
    }
  }
}

export type IndividualInfoServerProps = {
  individual_website: string | null
  individual_description: string | null
  internal_country_id: number | null
  relations: {
    avatar: Array<FileFromServer>
  }
}
