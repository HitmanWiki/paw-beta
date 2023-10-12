import BigNumber from 'bignumber.js'
import {
    decimalRemoveZeros
} from '@/utils-ts/balance'
import {
    OUTPUT_FORMATS
} from '@/constants/utils/moneyFormat'
import {
    CURRENCY_FIELD_BACKEND_ID
} from '@/constants-ts/currency'
import {
    getCurrency
} from '@/utils/currency'
import {
    Blockchain,
    BaseCurrencies
} from '@/constants-ts/blockchain'

/** Formatter for ETH value
 * @param {BigNumber|string|number} value
 * @returns {string} Example '125,548.484544'
 */
export function formatCurrency(value, {
    blockchain = Blockchain.Ethereum,
    ...options
}) {
    let currency = options ? .currency || getCurrency({
        blockchain,
        value: BaseCurrencies[blockchain]
    })
    switch (typeof currency) {
        case 'number':
            currency = getCurrency({
                blockchain,
                value: currency,
                field: CURRENCY_FIELD_BACKEND_ID
            })
            break
        case 'string':
            currency = getCurrency({
                blockchain,
                value: currency
            })
            break
    }
    const optionsMerged = {
        ...{
            currency: getCurrency({
                blockchain
            }),
            divider: 1,
            outputFormat: OUTPUT_FORMATS.CURRENCY,
            roundDown: true,
            minDecimal: currency.inputDecimals,
            maxDecimal: currency.maxDecimals,
            formatWithCommas: true,
        },
        ...(options || {}),
    }
    const divider = optionsMerged.divider
    const outputFormat = optionsMerged.outputFormat
    const roundDown = optionsMerged.roundDown
    const minDecimal = optionsMerged.minDecimal
    const maxDecimal = optionsMerged.maxDecimal
    const formatWithCommas = optionsMerged.formatWithCommas
    if (currency.name === 'ETH') {
        return outputFormat === OUTPUT_FORMATS.CURRENCY ?
            outputCurrency(value, {
                divider,
                roundDown,
                formatWithCommas
            }) :
            outputComission(value, {
                divider,
                roundDown,
                minDecimal,
                maxDecimal,
                formatWithCommas
            })
    } else {
        return outputFormat === OUTPUT_FORMATS.CURRENCY ?
            outputCurrency(value, {
                divider,
                minDecimal,
                maxDecimal: minDecimal,
                roundDown,
                formatWithCommas
            }) :
            outputCurrency(value, {
                divider,
                minDecimal,
                maxDecimal,
                roundDown,
                formatWithCommas
            })
    }
}

export function formatUsdWithZeros(input, decimalPlaces = 2, withCents = true) {
    const inputValue = typeof input === 'string' ? input.replaceAll(',', '') : input
    const usd = formatUsd(inputValue, decimalPlaces, withCents)
    return usd === '0' ? '0.00' : usd
}

/** Formatter for USD value
 * @param {BigNumber|string|number} input
 * @returns {string} Example '125,548.48'
 */
export function formatUsd(input, decimalPlaces = 2, withCents = true) {
    const inputBn = input instanceof BigNumber ? input : new BigNumber(input)
    return inputBn.isZero() ? '0.00' : withCommas(inputBn.toFixed(withCents && inputBn.dp() > 0 ? decimalPlaces : 0))
}

/** Formatter for USD value
 * @param {BigNumber|string|number} input
 * @returns {string} Example '125,548.48'
 */
export function formatUsdWithCutCents(input, threshold) {
    let decimalPlaces = 2
    let withCents = true
    const inputBn = input instanceof BigNumber ? input : new BigNumber(input)
    const thresholdBn = threshold instanceof BigNumber ? threshold : new BigNumber(threshold)
    if (inputBn.gt(thresholdBn)) {
        decimalPlaces = 0
        withCents = false
    }
    return formatUsd(inputBn, decimalPlaces, withCents)
}

export function withCommas(s) {
    if (typeof s === 'number') {
        s = s.toString()
    }
    const parts = s.split('.')
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
}

export function outputCurrency(input, {
    divider = 1,
    roundDown = true,
    minDecimal = 5,
    maxDecimal = 7,
    formatWithCommas = false
}) {
    const wrapper = formatWithCommas ? withCommas : (val) => val
    return wrapper(
        decimalRemoveZeros(
            (input instanceof BigNumber ? input : new BigNumber(input))
            .dividedBy(divider)
            .toFixed(maxDecimal, roundDown ? 1 : null),
            minDecimal,
            maxDecimal,
        ),
    )
}

function outputComission(input, {
    divider,
    roundDown = true,
    minDecimal = 5,
    maxDecimal = 7,
    formatWithCommas = false
}) {
    const wrapper = formatWithCommas ? withCommas : (val) => val
    return wrapper(
        decimalRemoveZeros(
            (input instanceof BigNumber ? input : new BigNumber(input))
            .dividedBy(divider)
            .toFixed(maxDecimal, roundDown ? 1 : null),
            minDecimal,
            maxDecimal,
        ),
    )
}