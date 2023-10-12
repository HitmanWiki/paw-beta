import BigNumber from 'bignumber.js'

export const MAX_AMOUNT_APPROVE = new BigNumber(2).pow(96).dividedBy(2).minus(1).toFixed(0)