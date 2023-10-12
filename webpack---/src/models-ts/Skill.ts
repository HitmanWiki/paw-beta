export default class Skill {
  id: number | string
  name: string
  url: string
  is_custom: number
  freelancers_score: number
  freelancers_score_based_on: number
  customers_score: number
  customers_score_based_on: number
  freelancers_start_of_month_counter: number
  relations?: {
    Parent: Array<{
      parent_id: number
      skill_id: number
    }>
  }
  meta?: {
    count?: {
      jobs: number
      gigs: number
    }
  }

  constructor ({
    id,
    name,
    url,
    is_custom,
    freelancers_score,
    freelancers_score_based_on,
    customers_score,
    freelancers_start_of_month_counter,
    customers_score_based_on,
    relations,
    meta,
  }: Partial<Skill>) {
    Object.assign(this, {
      id,
      name,
      url,
      is_custom,
      freelancers_score,
      freelancers_score_based_on,
      freelancers_start_of_month_counter,
      customers_score,
      customers_score_based_on,
      relations,
      meta,
    })
  }

  static fromServer (props: SkillFromServer) {
    return new Skill({
      ...props,
      url: props.url || '',
    })
  }

  toServer () {
    return this.is_custom ? { name: this.name.trim() } : { id: this.id }
  }
}

export type SkillFromServer = {
  id: number | string
  name: string
  url: string
  is_custom: number
  freelancers_score: number
  freelancers_score_based_on: number
  freelancers_start_of_month_counter: number
  customers_score: number
  customers_score_based_on: number
  relations?: {
    Parent: Array<{
      parent_id: number
      skill_id: number
    }>
  }
  meta?: {
    count?: {
      jobs: number
      gigs: number
    }
  }
}
