import { BaseCurrencies, Blockchain, ChainId } from '@/constants-ts/blockchain'
import { getCurrency } from '@/utils-ts/currencies'
import { CURRENCY_FIELD_BACKEND_ID, WNATIVE_BY_BLOCKCHAIN } from '@/constants-ts/currency'

export default class Currency {
  displayName: string
  name: string
  backendId: number
  backendName: string
  blockchain: Blockchain
  network: keyof typeof ChainId | null
  decimals: number
  inputDecimals: number
  maxDecimals: number
  address: string
  address1Inch: string
  minWithdraw: string
  image: string | null

  constructor (props: Partial<Currency>) {
    Object.assign(this, props)
  }

  static fromServer (props: CurrencyServerProps) {
    return getCurrency({ field: CURRENCY_FIELD_BACKEND_ID, value: props.id })
  }

  public get baseUnits (): number { // For old js code support. Remove after refactoring
    return 10 ** this.decimals
  }

  public get decimalsDivider (): number {
    return 10 ** this.decimals
  }

  public get isBaseCurrency (): boolean {
    return this.name === BaseCurrencies[this.blockchain]
  }

  public get baseCurrency (): Currency {
    return getCurrency({
      blockchain: this.blockchain,
      value: BaseCurrencies[this.blockchain]
    })!
  }

  public get contractTokenAddress (): string {
    return this.isBaseCurrency ? WNATIVE_BY_BLOCKCHAIN[this.blockchain]! : this.address
  }

  public get imageURL (): string {
    const basePath = '/static/images/blockchain/currencies/'
    if (this.image) {
      return this.image.startsWith('http') ? this.image : `${basePath}${this.image}`
    }
    return `${basePath}empty.svg`
  }

  static toArrayCurrencies (
    {
      arr,
      blockchain = Blockchain.Ethereum,
      network = Number(ChainId[Blockchain.Ethereum])
    }:
      {
        arr: Object[],
        blockchain: Blockchain,
        network: keyof typeof ChainId | string | undefined
      }
  ) {
    return arr
      .map((item: any) => new Currency({
        ...item,
        decimals: parseInt(item.baseUnitsDegree),
        blockchain,
        network,
        address1Inch: item.address1Inch || item.address,
      }))
  }
}

export type CurrencyServerProps = {
  id: number,
  name: string,
}
