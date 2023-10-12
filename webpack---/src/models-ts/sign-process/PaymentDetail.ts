import { Store } from 'vuex'
import BigNumber from 'bignumber.js'
import Currency from '@/models-ts/Currency'
import { formatCurrency, formatUsd } from '@/utils/moneyFormat'
import storeFromContext from '@/store/storeFromContext'
import Rate from '@/models-ts/Rate'

export enum PaymentDetailsTypes {
  CustomerFee = 'customer-fee',
  Fee = 'fee',
  DepositAmount = 'amount',
}

export interface IPaymentDetailsCalc {
  details: PaymentDetail[],
  deposit: string,
}

export default class PaymentDetail {
  type: PaymentDetailsTypes
  name: string
  currency: Currency
  amount?: BigNumber
  gasLimit?: BigNumber
  gasPrice?: BigNumber

  constructor (props: Partial<PaymentDetail>) {
    Object.assign(this, props)
  }

  get amountTotal (): BigNumber| undefined {
    return this.type === PaymentDetailsTypes.Fee
      ? new BigNumber(this.gasLimit || 0).multipliedBy(this.gasPrice || 0)
      : this.amount
  }

  get amountFormat (): string {
    if (this.type === PaymentDetailsTypes.Fee) {
      return this.gasLimit && this.gasPrice
        ? formatCurrency(
          this.gasLimit.multipliedBy(this.gasPrice),
          {
            currency: this.currency,
            divider: this.currency.decimalsDivider || this.currency.baseUnits,
            minDecimal: this.currency.maxDecimals,
            maxDecimal: this.currency.maxDecimals,
          }
        )
        : '0.00'
    }
    return this.amount
      ? formatCurrency(
        this.amount,
        {
          currency: this.currency,
          divider: this.currency.decimalsDivider || this.currency.baseUnits,
          minDecimal: this.currency.maxDecimals,
          maxDecimal: this.currency.maxDecimals,
        }
      )
      : '0.00'
  }

  get amountFormatUsd (): string | null {
    const store: Store<any> = storeFromContext()
    const rates: Rate[] = store.state.app.rates
    const price: string = rates.find((rate: Rate) => rate.currency === this.currency?.name)?.price || '0'
    if (this.type === PaymentDetailsTypes.Fee) {
      return this.gasLimit && this.gasPrice
        ? formatUsd(
          new BigNumber(this.gasLimit.multipliedBy(this.gasPrice))
            .dividedBy(this.currency.decimalsDivider || this.currency.baseUnits)
            .multipliedBy(price)
        )
        : '0.00'
    }
    return this.amount
      ? formatUsd(
        new BigNumber(this.amount)
          .dividedBy(this.currency.decimalsDivider || this.currency.baseUnits)
          .multipliedBy(price)
      )
      : '0.00'
  }
}
