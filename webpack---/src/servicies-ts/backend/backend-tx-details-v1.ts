import { meTransactionCreate } from '@/api/transactions/me'
import { Blockchain } from '@/constants-ts/blockchain'

export default class BackendTxDetailsV1 {
  public static async createContract (
    {
      postfix = 'Eth',
      gigOfferId,
      jobId,
      scId,
      blockchain,
      customerWallet,
      backendCurrencyId,
      deadline,
    }
      : {
      postfix: 'Eth' | 'Erc20',
      gigOfferId?: string,
      jobId?: string,
      scId?: string,
      blockchain: Blockchain,
      customerWallet: string,
      backendCurrencyId: number,
      deadline: number,
    }
  ): Promise<void> {
    await meTransactionCreate({
      gig_offer_id: gigOfferId,
      job_id: jobId,
      sc_id: scId,
      event: 'ContractCreated',
      method: postfix === 'Eth' ? 'createContractEth' : 'createContractErc20',
      blockchain,
      params: {
        customer_wallet: customerWallet,
        currency: backendCurrencyId,
        deadline: deadline,
      },
    })
  }

  public static async payToFreelancer (
    {
      postfix = 'Eth',
      gigOfferId,
      gigJobId,
      jobId,
      scId,
      blockchain,
    }
      : {
      postfix: 'Eth' | 'Erc20',
      gigOfferId: string,
      gigJobId: string,
      jobId: string,
      scId: string,
      blockchain: Blockchain,
    }
  ): Promise<void> {
    await meTransactionCreate({
      gig_offer_id: gigOfferId,
      gig_job_id: gigJobId,
      job_id: jobId,
      sc_id: scId,
      event: 'PayToFreelancer',
      method: postfix === 'Eth' ? 'payToFreelancerEth' : 'payToFreelancerErc20',
      blockchain,
    })
  }

  public static async returnFundsToCustomer (
    {
      postfix = 'Eth',
      gigOfferId,
      gigJobId,
      jobId,
      scId,
      blockchain
    }
      : {
      postfix: 'Eth' | 'Erc20',
      gigOfferId: string,
      gigJobId: string,
      jobId: string,
      scId: string,
      blockchain: Blockchain,
    }
  ): Promise<void> {
    await meTransactionCreate({
      gig_offer_id: gigOfferId,
      gig_job_id: gigJobId,
      job_id: jobId,
      sc_id: scId,
      event: 'ReturnFundsToCustomer',
      method: postfix === 'Eth' ? 'returnFundsToCustomerEth' : 'returnFundsToCustomerErc20',
      blockchain,
    })
  }
}
