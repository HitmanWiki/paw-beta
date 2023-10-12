import { AbiItem } from 'web3-utils/types'

export default class TronWebContract {
  tronWebInstance: any
  contractInstance: any
  address: any

  async init (tronWeb: any, jsonInterface: AbiItem, address: string) {
    this.tronWebInstance = tronWeb
    this.address = address
    this.contractInstance = await tronWeb.contract(jsonInterface, address)
  }
}
