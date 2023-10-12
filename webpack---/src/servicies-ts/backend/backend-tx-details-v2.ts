import { meTransactionCreate } from '@/api/transactions/me'
import { Blockchain } from '@/constants-ts/blockchain'

export default class BackendTxDetails {
  public static async createContract (
    {
      gigOfferId,
      jobId,
      scId,
      blockchain,
      customerWallet,
      freelancerWallet,
      backendCurrencyId,
      deadline,
    }
      : {
      gigOfferId?: string,
      jobId?: string,
      scId?: string,
      blockchain: Blockchain,
      customerWallet: string,
      freelancerWallet: string,
      backendCurrencyId: number,
      deadline: number,
    }
  ): Promise<void> {
    await meTransactionCreate({
      gig_offer_id: gigOfferId,
      job_id: jobId,
      sc_id: scId,
      event: 'ContractCreated',
      method: 'createContract',
      blockchain,
      params: {
        customer_wallet: customerWallet,
        freelancer_wallet: freelancerWallet,
        currency: backendCurrencyId,
        deadline: deadline,
      },
    })
  }

  public static async payToFreelancer (
    {
      gigOfferId,
      gigJobId,
      jobId,
      scId,
      blockchain,
    }
      : {
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
      event: 'PayedToFreelancer',
      method: 'payToFreelancer',
      blockchain,
    })
  }

  public static async refundToCustomerByCustomer (
    {
      gigOfferId,
      gigJobId,
      jobId,
      scId,
      blockchain
    }
      : {
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
      event: 'RefundedToCustomer',
      method: 'refundToCustomerByCustomer',
      blockchain,
    })
  }

  public static async refundToCustomerByFreelancer (
    {
      gigOfferId,
      gigJobId,
      jobId,
      scId,
      blockchain
    }
      : {
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
      event: 'RefundedToCustomer',
      method: 'refundToCustomerByCustomer',
      blockchain,
    })
  }
}
