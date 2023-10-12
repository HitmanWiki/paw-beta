import BigNumber from 'bignumber.js'
import {
    CURRENCIES,
    CURRENCY_FIELD_BACKEND_ID,
    CURRENCY_FIELD_BACKEND_NAME,
    CURRENCY_FIELD_NAME,
} from '@/constants-ts/currency'
import {
    formatUsd,
    formatCurrency
} from '@/utils/moneyFormat'
import {
    Blockchain
} from '@/constants-ts/blockchain'

export function getCurrency({
    blockchain = Blockchain.Ethereum,
    value = 'ETH',
    field = CURRENCY_FIELD_NAME
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

export function getRateByCurrency(currency, rates = []) {
    let currencyName = null
    switch (typeof currency) {
        case 'object':
            currencyName = currency.backendName
            break
        case 'string':
            currencyName = currency
            break
        case 'number':
            currencyName = CURRENCIES.find(item => item.backendId === currency) ? .backendName
            break
    }
    let rate = rates.find(rate => rate.currency === currencyName)
    if (!rate) {
        currencyName = CURRENCIES.find(item => item.name === currency) ? .backendName
        rate = rates.find(rate => rate.currency === currencyName)
    }
    return rate ? rate.price : 0
}

export function convertToUsd({
    value = 0,
    currency = 'USDT',
    rates,
    format = true
}) {
    const rate = getRateByCurrency(currency, rates)
    const valueBN = value instanceof BigNumber ? value : new BigNumber(value)
    const usdBN = valueBN.multipliedBy(rate)
    return format ? formatUsd(usdBN) : usdBN
}

export function convertFromUsd({
    blockchain = Blockchain.Ethereum,
    value = new BigNumber(0),
    currency = 'USDT',
    rates
}) {
    const rate = getRateByCurrency(currency, rates)
    const valueBN = value instanceof BigNumber ? value : new BigNumber(value)
    return new BigNumber(
        formatCurrency(
            valueBN.dividedBy(rate), {
                blockchain,
                currency: getCurrency({
                    blockchain,
                    value: currency
                }),
                formatWithCommas: false,
            }
        ))
}