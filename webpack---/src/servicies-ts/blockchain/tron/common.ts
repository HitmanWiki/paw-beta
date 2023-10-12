import Deferred from 'promise-deferred'
import { getTronWebInstanceAsync } from '@/servicies-ts/blockchain/tron/tronweb'

export async function awaitTxBlockchain (
  {
    txId,
    blockConfirmations = 1,
  }: {
    txId: string,
    blockConfirmations?: Number,
  }
) {
  const deferred = new Deferred()
  const interv = setInterval(async () => {
    const tronWeb = await getTronWebInstanceAsync()
    const res = await tronWeb.trx.getTransactionInfo(txId)
    if (res && res?.receipt) { // TODO TRX check unsucessfull receipt
      deferred.resolve(res?.receipt)
      clearInterval(interv)
    }
  }, 500)
  return deferred.promise
}
