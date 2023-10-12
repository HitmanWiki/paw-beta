import BigNumber from 'bignumber.js'
import { WithdrawsStatus } from '@/constants-ts/withdraw'
import { convertToLocal } from '@/utils/date'

export default class WithdrawalRequest {
  id: number
  createdAt: string
  updatedAt: string
  amount: BigNumber
  status: WithdrawsStatus

  constructor (props: Partial<WithdrawalRequest>) {
    Object.assign(this, props)
  }

  static fromServer (data: WithdrawalRequestFromServer) {
    return new WithdrawalRequest({
      id: data.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      amount: new BigNumber(data.amount || 0),
      status: data.status,
    })
  }
}

export type WithdrawalRequestFromServer = {
  id: number
  created_at: string
  updated_at: string
  amount: string,
  status: WithdrawsStatus
}
