import BigNumber from 'bignumber.js'

export const WITHDRAW_LIMIT = new BigNumber(1)

export enum WithdrawsStatus {
  NEW = 1,
  PENDING = 2,
  DONE = 3,
  DECLINED = 4,
  ERROR = 5,
}

export const EARNS_DIRECT = 1
export const EARNS_REFERRAL = 2
