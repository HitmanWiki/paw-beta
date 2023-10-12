import { getBalances as fetchBalances } from '@/servicies/balance'
import { getBalances as getBalancesTron } from '@/servicies-ts/blockchain/tron/balance'
import { Blockchain } from '@/constants-ts/blockchain'
import {
  CURRENCIES_BLOCKCHAIN_ARBITRUM,
  CURRENCIES_BLOCKCHAIN_BINANCE,
  CURRENCIES_BLOCKCHAIN_ETHEREUM,
  CURRENCIES_BLOCKCHAIN_FANTOM,
  CURRENCIES_BLOCKCHAIN_POLYGON,
  CURRENCIES_BLOCKCHAIN_TRON
} from '@/constants-ts/currency'
import Currency from '@/models-ts/Currency'

/**
 * Removes insignificant trailing zeros
 * Ex. for 1.00100000 returns 1.00100
 * @param  {string} value
 * @param {number} minDecimal
 * @param {number} maxDecimal
 * @returns {string}
 */
export function decimalRemoveZeros (value: string, minDecimal: number = 5, maxDecimal: number = 8) {
  const val = value.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')
  const arr = val.split(/[.,]+/)
  if (arr.length > 1) {
    return arr[1].length > minDecimal ? `${arr[0]}.${arr[1].substring(0, maxDecimal)}` : `${arr[0]}.${arr[1].padEnd(minDecimal, '0')}`
  } else {
    return `${arr[0]}.${new Array(minDecimal).fill(0).join('')}`
  }
}

/**
 * Fetch balances by Blockchain
 * @param {string} addressEth
 * @param {string} addressTron
 * @returns {[Blockchain]: {[Currency]}} map with balances in all blockhains
 */
export async function getBalances ({ addressEth, addressTron }: { addressEth?: string, addressTron?: string }) {
  const balances = {
    ...(
      addressEth
        ? {
          [Blockchain.Ethereum]: {},
          [Blockchain.Binance]: {},
          [Blockchain.Polygon]: {},
          [Blockchain.Fantom]: {},
          [Blockchain.Arbitrum]: {},
        }
        : {}
    ),
    ...(
      addressTron
        ? {
          [Blockchain.Tron]: {}
        }
        : {}
    )
  }
  if (addressEth) {
    const [balancesEth, balancesBsc, balancesMatic, balancesFantom, balancesArbitrum] = await Promise.all([
      fetchBalances({
        address: addressEth,
        blockchain: Blockchain.Ethereum,
        tokens: CURRENCIES_BLOCKCHAIN_ETHEREUM,
        chainId: undefined,
      }),
      fetchBalances({
        address: addressEth,
        blockchain: Blockchain.Binance,
        tokens: CURRENCIES_BLOCKCHAIN_BINANCE,
        chainId: undefined,
      }),
      fetchBalances({
        address: addressEth,
        blockchain: Blockchain.Polygon,
        tokens: CURRENCIES_BLOCKCHAIN_POLYGON,
        chainId: undefined,
      }),
      fetchBalances({
        address: addressEth,
        blockchain: Blockchain.Fantom,
        tokens: CURRENCIES_BLOCKCHAIN_FANTOM,
        chainId: undefined,
      }),
      fetchBalances({
        address: addressEth,
        blockchain: Blockchain.Arbitrum,
        tokens: CURRENCIES_BLOCKCHAIN_ARBITRUM,
        chainId: undefined,
      }),
    ])
    balances[Blockchain.Ethereum] = balancesEth
    balances[Blockchain.Binance] = balancesBsc
    balances[Blockchain.Polygon] = balancesMatic
    balances[Blockchain.Fantom] = balancesFantom
    balances[Blockchain.Arbitrum] = balancesArbitrum
  }
  if (addressTron) {
    balances[Blockchain.Tron] = await getBalancesTron({
      address: addressTron,
      tokens: CURRENCIES_BLOCKCHAIN_TRON,
    })
  }
  return balances
}

/**
 * Get balance of currency for address
 * @param {string} address
 * @param {Currency} currency
 * @return {string}
 */
export async function getBalanceByAddress ({ address, currency }: { address: string, currency: Currency }) {
  let balance
  if (currency.blockchain === Blockchain.Tron) {
    balance = await getBalancesTron({ address, tokens: [currency] })
  } else {
    balance = await fetchBalances({
      address,
      blockchain: currency.blockchain,
      chainId: undefined,
      tokens: [currency]
    })
  }
  return balance[currency.name]
}
