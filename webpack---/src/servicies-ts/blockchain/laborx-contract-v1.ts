import Web3Contract from '@/models-ts/Web3Contract'
import { UserFeesV1 } from '@/constants-ts/contracts'
import { Blockchain, BlockchainByChainId, EXPLORER_URL_BY_BLOCKCHAIN } from '@/constants-ts/blockchain'
import getWeb3InstanceAsync from '@/servicies-ts/blockchain/web3'

interface ChainIdKeyContractValue {
  [key: number]: LaborXContractV1;
}

let contractsByChainId: ChainIdKeyContractValue = {}

export async function getLaborXContractV1Async ({ chainId }: { chainId: number }): Promise<LaborXContractV1> {
  const web3 = await getWeb3InstanceAsync({
    chainId
  })
  const artifacts: any = (
    await import(/* webpackChunkName: "lx-contract-v1" */
      '@chronotech/laborx.sc.artifacts/contracts.v1/LaborXContract.json')
  )
  const address = artifacts.networks[chainId].address
  contractsByChainId[chainId] = new LaborXContractV1(
    web3,
    BlockchainByChainId[String(chainId)],
    artifacts.abi,
    address
  )
  return contractsByChainId[chainId]
}

export interface ICreateContractParamsV1 {
  postfix: 'Eth' | 'Erc20',
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
  customerAddress: string,
  freelancerAddress: string,
  disputerAddress: string,
  currencyAddress: string,
  amount: string,
  hoursInSeconds: string,
  value?: string,
}

export interface IPayToFreelancerParamsV1 {
  postfix: 'Eth' | 'Erc20',
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
}

export interface IReturnFundsToCustomerParamsV1 {
  postfix: 'Eth' | 'Erc20',
  mode: 'encodeABI' | 'estimateGas',
  from: string,
  contractId: string,
}

export default class LaborXContractV1 extends Web3Contract {
  public createContract (
    {
      postfix = 'Eth',
      mode = 'encodeABI',
      from,
      contractId,
      customerAddress,
      freelancerAddress,
      disputerAddress = '0x0000000000000000000000000000000000000000',
      currencyAddress,
      amount,
      hoursInSeconds,
      value = '0',
    }: ICreateContractParamsV1
  ): string | Promise<number> {
    const methodName = postfix === 'Eth'
      ? 'createContractEth'
      : 'createContractErc20'
    const methodArgs = postfix === 'Eth'
      ? [contractId, customerAddress, freelancerAddress, disputerAddress, amount, hoursInSeconds === '0' ? 60 : hoursInSeconds]
      : [
        contractId,
        customerAddress,
        freelancerAddress,
        disputerAddress,
        currencyAddress,
        amount,
        hoursInSeconds === '0' ? 60 : hoursInSeconds
      ]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from, value })
  }

  public payToFreelancer (
    {
      postfix = 'Eth',
      mode = 'encodeABI',
      from,
      contractId,
    }: IPayToFreelancerParamsV1
  ): string | Promise<number> {
    const methodName = postfix === 'Eth'
      ? 'payToFreelancerEth'
      : 'payToFreelancerErc20'
    const methodArgs = [contractId]
    return mode === 'encodeABI'
      ? this.contractInstance.methods[methodName].apply(this, methodArgs).encodeABI()
      : this.contractInstance.methods[methodName].apply(this, methodArgs).estimateGas({ from })
  }

  public returnFundsToCustomer (
    {
      postfix = 'Eth',
      mode = 'encodeABI',
      from,
      contractId,
    }: IReturnFundsToCustomerParamsV1
  ): string | Promise<number> {
    const methodName = postfix === 'Eth'
      ? 'returnFundsToCustomerEth'
      : 'returnFundsToCustomerErc20'
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
      case 'returnFundsToCustomer':
        return this.returnFundsToCustomer(methodArgs)
    }
    return ''
  }

  public async getServiceFeesForAccount (account: string): Promise<UserFeesV1> {
    const {
      _customerFee,
      _freelancerFee
    } = await this.contractInstance.methods.getServiceFeesForAccount(account).call()
    return { customerFee: _customerFee, freelancerFee: _freelancerFee }
  }

  public contractLink (blockchain: Blockchain): string {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[blockchain]
    return `${explorerUrl}/address/${this.contractInstance.options.address}`
  }
}
