// @ts-ignore
import { serializeError } from 'serialize-error'
// @ts-ignore
import extract from 'extract-json-from-string'
import { Blockchain, EXPLORER_URL_BY_BLOCKCHAIN, EXPLORERS_BY_CHAIN_ID } from '@/constants-ts/blockchain'

export function extractRevert (error: Error):string | undefined {
  let lastMessage: string | undefined
  try {
    const serialized = serializeError(error)
    lastMessage = serialized?.message
    if (!serialized?.message) return lastMessage
    const extracted = extract(serialized?.message)
    lastMessage = extracted.length <= 0
      ? lastMessage
      : JSON.stringify(extracted[0])
    if (extracted.length <= 0) return lastMessage
    return extracted[0]?.message || extracted[0]?.originalError?.message || serialized?.message
  } catch (err) {
    console.error(err)
    return lastMessage
  }
}

/**
 * @returns {string} transaction URL in blockchain explorer
 */
export function getTxLink (
  { blockchain = Blockchain.Ethereum, chainId, tx }:
  { blockchain?: Blockchain, chainId?: string, tx: string }
) {
  if (blockchain === Blockchain.Tron) {
    return `${process.env.VUE_APP_EXPLORER_TRON}/#/transaction/${tx}`
  } else if (chainId) {
    return `${EXPLORERS_BY_CHAIN_ID[chainId]}/tx/${tx}`
  }
  return `${EXPLORER_URL_BY_BLOCKCHAIN[blockchain]}/tx/${tx}`
}
