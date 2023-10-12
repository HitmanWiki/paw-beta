import { Contract } from 'web3-eth-contract/types'
import { AbiItem } from 'web3-utils/types'
import Web3Type from 'web3/types'
import { Blockchain } from '@/constants-ts/blockchain'

export default class Web3Contract {
  web3Instance: Web3Type
  contractInstance: Contract
  blockchain: Blockchain

  constructor (web3: Web3Type, blockchain: Blockchain, jsonInterface: AbiItem[], address: string) {
    this.web3Instance = web3
    const jsonInterface_ = JSON.parse(JSON.stringify(jsonInterface))
    const cont = new web3.eth.Contract(jsonInterface_, address, {})
    this.contractInstance = cont
    this.blockchain = blockchain
  }
}
