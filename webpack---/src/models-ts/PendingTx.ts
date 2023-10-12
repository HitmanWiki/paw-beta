export enum TypeAwait {
  FromBackend = 1,
  FromBlockchain = 2
}

export enum StatusTransaction {
  Pending = 1,
  Finished = 2,
  Failed = 3,
  UserClosed = 4
}

export default class PendingTx {
  typeAwait: TypeAwait
  txId: string
  params: any
  status: StatusTransaction
  title: string
  text: string
  createdAt: number

  constructor (props: Partial<PendingTx>) {
    this.createdAt = Date.now()
    this.status = StatusTransaction.Pending
    Object.assign(this, props)
  }
}
