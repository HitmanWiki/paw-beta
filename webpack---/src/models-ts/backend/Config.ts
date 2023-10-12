export default class Config {
  name: string
  value: string

  constructor ({ name, value }: Required<Config>) {
    Object.assign(this, { name, value })
  }
}
