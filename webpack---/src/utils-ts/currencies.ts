import BigNumber from 'bignumber.js'
import Currency from '@/models-ts/Currency'
import Rate from '@/models-ts/Rate'
import { Blockchain, WalletGroup } from '@/constants-ts/blockchain'
import {
  CURRENCIES,
  CURRENCY_FIELD_BACKEND_ID,
  CURRENCY_FIELD_BACKEND_NAME,
  CURRENCY_FIELD_NAME,
} from '@/constants-ts/currency'
import { getRateByCurrency } from '@/utils/currency'
import { formatCurrency, formatUsd } from '@/utils/moneyFormat'

export function getCurrency ({
  blockchain = Blockchain.Ethereum,
  value = 'ETH',
  field = CURRENCY_FIELD_NAME
}: {
  blockchain?: Blockchain,
  value: string | number | null,
  field?: typeof CURRENCY_FIELD_NAME | typeof CURRENCY_FIELD_BACKEND_ID | typeof CURRENCY_FIELD_BACKEND_NAME
}) {
  return CURRENCIES.find(currency => {
    switch (field) {
      case CURRENCY_FIELD_NAME:
        if (currency.name === value && currency.blockchain === blockchain) return true
        break
      case CURRENCY_FIELD_BACKEND_ID:
        if (currency.backendId === value && currency.blockchain === blockchain) return true
        break
      case CURRENCY_FIELD_BACKEND_NAME:
        if (currency.backendName === value && currency.blockchain === blockchain) return true
        break
    }
    return false
  })
}

export function getPreferredCurrency (preferredCurrencies: Currency[] = [], walletGroup = WalletGroup.Cloud): Currency | null {
  const priorityCurrencies = walletGroup === WalletGroup.TronLink
    ? [
      { blockchain: Blockchain.Tron, name: 'USDT' },
      { blockchain: Blockchain.Tron, name: 'TRX' },
    ]
    : [
      { blockchain: Blockchain.Ethereum, name: 'ETH' },
      { blockchain: Blockchain.Ethereum, name: 'DAI' },
      { blockchain: Blockchain.Ethereum, name: 'USDC' },
      { blockchain: Blockchain.Ethereum, name: 'USDT' },
      { blockchain: Blockchain.Binance, name: 'BNB' },
      { blockchain: Blockchain.Binance, name: 'BUSD' },
      { blockchain: Blockchain.Binance, name: 'USDT' },
      { blockchain: Blockchain.Binance, name: 'DAI' },
    ]
  for (let currency of priorityCurrencies) {
    const preferred = preferredCurrencies
      .find(item => currency.name === item.name && currency.blockchain === item.blockchain)
    if (preferred) {
      return preferred
    }
  }
  const preferredCurrenciesByGroup = walletGroup === WalletGroup.TronLink
    ? preferredCurrencies.filter((item) => item.blockchain === Blockchain.Tron)
    : preferredCurrencies.filter((item) => item.blockchain !== Blockchain.Tron)
  return preferredCurrenciesByGroup.length > 0 ? preferredCurrenciesByGroup[0] : null
}

export function convertToUsd (
  { value = 0, currency, rates, format = true }:
    { value: BigNumber | number | string, currency: Currency, rates: Rate[], format?: boolean }
) {
  const rate = getRateByCurrency(currency, rates)
  const valueBN = value instanceof BigNumber ? value : new BigNumber(value)
  const usdBN = valueBN.multipliedBy(rate)
  return format ? formatUsd(usdBN) : usdBN
}

export function convertFromUsd (
  { value = new BigNumber(0), currency, rates }:
    { value: BigNumber | number | string, currency: Currency, rates: Rate[] }
) {
  const rate = getRateByCurrency(currency, rates)
  const valueBN = value instanceof BigNumber ? value : new BigNumber(value)
  return new BigNumber(
    formatCurrency(
      valueBN.dividedBy(rate),
      {
        currency,
        formatWithCommas: false,
        minDecimal: currency.maxDecimals,
        maxDecimal: currency.maxDecimals,
      }
    )
  )
}
