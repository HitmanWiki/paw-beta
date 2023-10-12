import TronWebContract from '@/models-ts/TronWebContract'
import cloneDeep from 'lodash/cloneDeep'
import { Blockchain, EXPLORER_URL_BY_BLOCKCHAIN, getTronArtifactsNameByNode } from '@/constants-ts/blockchain'
import { getTronWebInstanceAsync } from '@/servicies-ts/blockchain/tron/tronweb'
import TronLinkProvider from '@/servicies-ts/blockchain/tron/provider-tronlink'
import { ContractType, UserFeesV2 } from '@/constants-ts/contracts'
import {
  ICreateContractParamsV2,
  IPayToFreelancerParamsV2, IRefundToCustomerByCustomerParamsV2,
  IRefundToCustomerByFreelancerParamsV2
} from '@/servicies-ts/blockchain/laborx-contract-v2'

export const TRONWEB_PROVIDER = process.env.VUE_APP_TRONWEB_PROVIDER || 'https://api.trongrid.io'

let contracts: any = { }

export async function getLaborXContractTronAsync (contractType = ContractType.ReadWithTronWeb): Promise<LaborXContractTronV2> {
  if (!contracts[contractType]) {
    const artifacts: any = (
      await import(/* webpackChunkName: "lx-contract-v2" */
        '@chronotech/laborx.sc.artifacts/contracts.v2/LaborXContract.json')
    )
    contracts[contractType] = new LaborXContractTronV2()
    if (contractType === ContractType.WriteWithTronLink) {
      TronLinkProvider.initWithoutAwait()
      await TronLinkProvider.connect()
      const tronWeb = TronLinkProvider.tronWeb
      await contracts[contractType].init(
        tronWeb,
        cloneDeep(artifacts.abi),
        artifacts.networks[getTronArtifactsNameByNode(TRONWEB_PROVIDER)].address
      )
    } else {
      const tronWeb = await getTronWebInstanceAsync()
      await contracts[contractType].init(
        tronWeb,
        cloneDeep(artifacts.abi),
        artifacts.networks[getTronArtifactsNameByNode(TRONWEB_PROVIDER)].address
      )
    }
  }
  return contracts[contractType]
}

export interface ITransferParams {
  from: string,
  recipient: string,
  amount: string,
}

export class LaborXContractTronV2 extends TronWebContract {
  public async createContract (
    {
      contractId,
      freelancer,
      disputer = '0x0000000000000000000000000000000000000000',
      token,
      amount,
      duration,
      percentToBaseConvert = '0',
      value = '0',
    }: ICreateContractParamsV2
  ): Promise<any> {
    let res = await this.contractInstance.createContract(
      contractId,
      freelancer,
      disputer,
      token,
      Number(amount),
      Number(process.env.VUE_APP_MODE === 'dev' ? '1' : duration),
      Number(percentToBaseConvert)
    ).send({
      feeLimit: 100000000,
      callValue: Number(value)
    })
    return res
  }

  public async payToFreelancer (
    {
      contractId,
    }: IPayToFreelancerParamsV2
  ): Promise<any> {
    let res = await this.contractInstance.payToFreelancer(contractId).send({
      feeLimit: 100000000
    })
    return res
  }

  public async refundToCustomerByFreelancer (
    {
      contractId,
    }: IRefundToCustomerByFreelancerParamsV2
  ): Promise<any> {
    let res = await this.contractInstance.refundToCustomerByFreelancer(contractId).send({
      feeLimit: 100000000
    })
    return res
  }

  public async refundToCustomerByCustomer (
    {
      contractId,
    }: IRefundToCustomerByCustomerParamsV2
  ): Promise<any> {
    let res = await this.contractInstance.refundToCustomerByCustomer(contractId).send({
      feeLimit: 100000000
    })
    return res
  }

  public async methodSwitch (methodName: string, methodArgs: any): Promise<any> {
    let res: any = null
    switch (methodName) {
      case 'createContract':
        res = await this.createContract(methodArgs)
        return res
      case 'payToFreelancer':
        res = await this.payToFreelancer(methodArgs)
        return res
      case 'refundToCustomerByFreelancer':
        res = await this.refundToCustomerByFreelancer(methodArgs)
        return res
      case 'refundToCustomerByCustomer':
        res = await this.refundToCustomerByCustomer(methodArgs)
        return res
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

  public contractLink (): string {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[Blockchain.Tron]
    return `${explorerUrl}/#/address/${this.contractInstance.address}`
  }
}
