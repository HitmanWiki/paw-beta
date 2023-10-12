import { Blockchain, EXPLORER_URL_BY_BLOCKCHAIN } from '@/constants-ts/blockchain'

export function getTxLink ({ tx }: { tx: string }) {
  return `${EXPLORER_URL_BY_BLOCKCHAIN[Blockchain.Tron]}/#/transaction/${tx}`
}
