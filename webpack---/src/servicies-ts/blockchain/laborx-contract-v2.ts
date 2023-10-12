import Web3Contract from '@/models-ts/Web3Contract'
import cloneDeep from 'lodash/cloneDeep'
import { UserFeesV1, UserFeesV2 } from '@/constants-ts/contracts'
import { Blockchain, BlockchainByChainId, EXPLORER_URL_BY_BLOCKCHAIN } from '@/constants-ts/blockchain'
import getWeb3InstanceAsync from '@/servicies-ts/blockchain/web3'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

let contractsByChainId: any = {}

export async function getLaborXContractV2Async ({ chainId }: { chainId: number }): Promise<LaborXContractV2> {
  if (!contractsByChainId[chainId]) {
    const web3 = await getWeb3InstanceAsync({
      chainId
    })
    const artifacts: any = (
      await import(/* webpackChunkName: "lx-contract-v2" */
        '@chronotech/laborx.sc.artifacts/contracts.v2/LaborXContract.json')
    )
    const address = artifacts.networks[chainId].address
    contractsByChainId[chainId] = new LaborXContractV2(
      web3,
      BlockchainByChainId[String(chainId)],
      cloneDeep(artifacts.abi),
      address
    )
  }
  return contractsByChainId[chainId]
}

export interface ICreateContractParamsV2 {
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
  freelancer: string,
  disputer: string,
  token: string,
  amount: string,
  duration: string,
  percentToBaseConvert: string,
  value?: string,
}

export interface IPayToFreelancerParamsV2 {
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
}

export interface IRefundToCustomerByFreelancerParamsV2 {
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
}

export interface IRefundToCustomerByCustomerParamsV2 {
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
}

export default class LaborXContractV2 extends Web3Contract {
  public createContract (
    {
      mode = 'encodeABI',
      from,
      contractId,
      freelancer,
      disputer = '0x0000000000000000000000000000000000000000',
      token,
      amount,
      duration,
      percentToBaseConvert = '0',
      value = '0',
    }: ICreateContractParamsV2
  ): string | Promise<number> {
    const methodName = 'createContract'
    const methodArgs = [
      contractId,
      freelancer,
      disputer,
      token,
      amount,
      process.env.VUE_APP_MODE === 'dev' ? '1' : duration,
      percentToBaseConvert,
    ]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from, value })
  }

  public payToFreelancer (
    {
      mode = 'encodeABI',
      from,
      contractId,
    }: IPayToFreelancerParamsV2
  ): string | Promise<number> {
    const methodName = 'payToFreelancer'
    const methodArgs = [contractId]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from })
  }

  public refundToCustomerByFreelancer (
    {
      mode = 'encodeABI',
      from,
      contractId,
    }: IRefundToCustomerByFreelancerParamsV2
  ): string | Promise<number> {
    const methodName = 'refundToCustomerByFreelancer'
    const methodArgs = [contractId]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from })
  }

  public refundToCustomerByCustomer (
    {
      mode = 'encodeABI',
      from,
      contractId,
    }: IRefundToCustomerByCustomerParamsV2
  ): string | Promise<number> {
    const methodName = 'refundToCustomerByCustomer'
    const methodArgs = [contractId]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from })
  }

  public methodSwitch (methodName: string, methodArgs: any): string | Promise<number> {
    switch (methodName) {
      case 'createContract':
        return this.createContract(methodArgs)
      case 'payToFreelancer':
        return this.payToFreelancer(methodArgs)
      case 'refundToCustomerByFreelancer':
        return this.refundToCustomerByFreelancer(methodArgs)
      case 'refundToCustomerByCustomer':
        return this.refundToCustomerByCustomer(methodArgs)
    }
    return ''
  }

  public async getServiceFees (): Promise<UserFeesV2> {
    const {
      _customerFee,
      _freelancerFee
    } = await this.contractInstance.methods.getServiceFees().call()
    return { _customerFee, _freelancerFee }
  }

  public contractLink (blockchain: Blockchain): string {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[blockchain]
    return `${explorerUrl}/address/${this.contractInstance.options.address}`
  }
}
