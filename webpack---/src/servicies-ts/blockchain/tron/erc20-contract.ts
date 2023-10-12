import TronWebContract from '@/models-ts/TronWebContract'
import { ContractType, UserFeesV1 } from '@/constants-ts/contracts'
import { Blockchain, EXPLORER_URL_BY_BLOCKCHAIN, ChainId } from '@/constants-ts/blockchain'
import { getTronWebInstanceAsync } from '@/servicies-ts/blockchain/tron/tronweb'
import TronLinkProvider from '@/servicies-ts/blockchain/tron/provider-tronlink'
import { IApproveParams } from '@/servicies-ts/blockchain/erc20-contract'
import Currency from '@/models-ts/Currency'
import { getCurrencyInfo } from '@/api/currency'

let contracts: any = {
  [ContractType.ReadWithTronWeb]: {},
  [ContractType.WriteWithTronLink]: {},
}

export async function getErc20ContractTronAsync (
  { contractType = ContractType.ReadWithTronWeb, address }: { contractType?: ContractType, address: string }
): Promise<Erc20ContractTron> {
  if (!contracts[contractType][address]) {
    const artifacts: any = (
      await import(/* webpackChunkName: "erc20-v1.json" */
        '@chronotech/laborx.sc.artifacts/contracts.v1/ERC20.json')
    )
    contracts[contractType][address] = new Erc20ContractTron()
    if (contractType === ContractType.WriteWithTronLink) {
      TronLinkProvider.initWithoutAwait()
      await TronLinkProvider.connect()
      const tronWeb = TronLinkProvider.tronWeb
      await contracts[contractType][address].init(tronWeb, artifacts.abi, address)
    } else {
      const tronWeb = await getTronWebInstanceAsync()
      await contracts[contractType][address].init(tronWeb, artifacts.abi, address)
    }
  }
  return contracts[contractType][address]
}

export interface ITransferParams {
  from: string,
  recipient: string,
  amount: string,
}

export class Erc20ContractTron extends TronWebContract {
  methods: { [k: string]: any }
  public async transfer (
    {
      recipient,
      amount
    }: ITransferParams
  ): Promise<any> {
    let res = await this.contractInstance.transfer(
      recipient,
      Number(amount),
    ).send({
      feeLimit: 100000000,
    })
    return res
  }

  public async approve (
    {
      spender,
      amount
    }: IApproveParams
  ): Promise<any> {
    let res = await this.contractInstance.approve(
      spender,
      amount,
    ).send({
      feeLimit: 100000000,
    })
    return res
  }

  public async allowance (owner: string, spender: string): Promise<string> {
    const value = await this.contractInstance.allowance(owner, spender).call()
    return value.toString(10)
  }

  public async balanceOf (account: string): Promise<string> {
    const value = await this.contractInstance.balanceOf(account).call()
    return value.toString(10)
  }

  public contractLink ():string {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[Blockchain.Tron]
    return `${explorerUrl}/#/address/${this.contractInstance.address}`
  }

  public async toCurrency () {
    const currency: Partial<Currency> = {}
    const getName = this.contractInstance.methods.name().call()
      .then((name: string) => { currency.displayName = (name || '').replace(/ Token$/g, '') })
    const getSymbol = this.contractInstance.methods.symbol().call()
      .then((symb: string) => { currency.name = currency.backendName = symb })
    const getDecimals = this.contractInstance.methods.decimals().call()
      .then((decimals: number) => { currency.decimals = decimals })
    await Promise.all([getName, getSymbol, getDecimals])
    try {
      const info = await getCurrencyInfo(this.contractInstance.address)
      currency.image = info.logo
    } catch (e) {
      console.error('Error fething token image', this.contractInstance.address, e)
    }
    return new Currency({
      blockchain: Blockchain.Tron,
      network: Number(ChainId[Blockchain.Tron]),
      inputDecimals: 5,
      maxDecimals: 7,
      address: this.contractInstance.address,
      ...currency
    })
  }
}
