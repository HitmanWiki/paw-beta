import Currency from '@/models-ts/Currency'
import { Blockchain } from '@/constants-ts/blockchain'
import { CURRENCY_FIELD_BACKEND_ID } from '@/constants-ts/currency'
import { getCurrency } from '@/utils-ts/currencies'

export default class PrefferedCurrency extends Currency {
  static getFromSrever (props: PrefferedCurrencyServerProps) {
    const curr = getCurrency({ field: CURRENCY_FIELD_BACKEND_ID, value: props.currency, blockchain: props.blockchain })
    return curr ? new PrefferedCurrency(curr) : null
  }

  toServer () {
    return {
      currency: this.backendId,
      blockchain: this.blockchain,
    }
  }
}

export type PrefferedCurrencyServerProps = {
  currency: number
  blockchain: Blockchain
}
