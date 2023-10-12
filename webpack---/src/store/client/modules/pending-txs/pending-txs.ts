import uniqueId from 'lodash/uniqueId'
import { Commit, Dispatch, Module } from 'vuex'
import PendingTx, { StatusTransaction, TypeAwait } from '@/models-ts/PendingTx'
import { IPendingTxsState } from './types'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import { awaitTxBlockchain } from '@/servicies/blockchain/common'
import { awaitTxBlockchain as awaitTxBlockchainTron } from '@/servicies-ts/blockchain/tron/common'
import { awaitTxCombined } from '@/servicies/backend/transaction'
import { getTxLink } from '@/utils/etherscan'
import { Blockchain, getChainIdByBlockchain } from '@/constants-ts/blockchain'
import { getTxLink as getTxLinkTron } from '@/utils-ts/tron/tronscan'

const getInitialState = (): IPendingTxsState => ({
  txs: [],
})

const pendingTxs = (): Module<IPendingTxsState, any> => {
  return ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
      resetState (state: IPendingTxsState) {
        Object.assign(state, getInitialState())
      },
      addTx (state: IPendingTxsState, tx: PendingTx) {
        state.txs.push(tx)
      },
      changeTxStatus (state: IPendingTxsState, { txId, status }: { txId: string, status: StatusTransaction }) {
        const item = state.txs.find((item: PendingTx) => item.txId.toLowerCase() === txId.toLowerCase())
        if (item) {
          item.status = status
        }
      }
    },
    actions: {
      async initialLoad (
        { state, commit, dispatch }: { state: IPendingTxsState, commit: Commit, dispatch: Dispatch },
      ) {
        state.txs.map(async (tx) => {
          try {
            if (tx.status === StatusTransaction.Pending && (Date.now() - tx.createdAt) < 172800000) {
              dispatch('snacks/openSnackbar', {
                id: tx.txId,
                type: SnackTypes.LOADING_WITH_CLOSE,
                duration: -1,
                title: tx.title,
                text: tx.text,
                onCloseCb: () => {
                  commit('changeTxStatus', { txId: tx.txId, status: StatusTransaction.UserClosed })
                }
              }, { root: true })
              if (tx.typeAwait === TypeAwait.FromBackend) {
                await awaitTxCombined(tx.params)
              }
              if (tx.typeAwait === TypeAwait.FromBlockchain) {
                if (tx.params.blockchain === Blockchain.Tron) {
                  await awaitTxBlockchainTron({ txId: tx.txId })
                } else {
                  await awaitTxBlockchain(tx.params)
                }
              }
              commit('changeTxStatus', { txId: tx.txId, status: StatusTransaction.Finished })
              dispatch('snacks/deleteSnackbar', tx.txId, { root: true })
            }
          } catch (err) {
            console.error(err)
            dispatch('snacks/deleteSnackbar', tx.txId, { root: true })
            commit('changeTxStatus', { txId: tx.txId, status: StatusTransaction.Failed })
            const chainId = tx.params?.chainId || getChainIdByBlockchain(tx.params?.blockchain)
            const link = tx.params.blockchain === Blockchain.Tron
              ? getTxLinkTron({ tx: tx.txId })
              : getTxLink({ chainId, tx: tx.txId })
            dispatch('snacks/openSnackbar', {
              id: uniqueId(),
              type: SnackTypes.FAILURE,
              title: 'Transaction failure',
              // eslint-disable-next-line max-len
              text: `<a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">Transaction</a> failed. Please try again.`,
            }, { root: true })
          }
        })
      },
      async addAndAwaitTx (
        {
          state,
          commit,
          dispatch
        }: {
          state: IPendingTxsState,
          commit: Commit,
          dispatch: Dispatch
        }, tx: PendingTx) {
        try {
          commit('addTx', tx)
          dispatch('snacks/openSnackbar', {
            id: tx.txId,
            type: SnackTypes.LOADING,
            duration: -1,
            title: tx.title,
            text: tx.text
          }, { root: true })
          if (tx.typeAwait === TypeAwait.FromBackend) {
            await awaitTxCombined(tx.params)
          }
          if (tx.typeAwait === TypeAwait.FromBlockchain) {
            if (tx.params.blockchain === Blockchain.Tron) {
              await awaitTxBlockchainTron({ txId: tx.txId })
            } else {
              await awaitTxBlockchain(tx.params)
            }
          }
          commit('changeTxStatus', { txId: tx.txId, status: StatusTransaction.Finished })
        } catch (err) {
          commit('changeTxStatus', { txId: tx.txId, status: StatusTransaction.Failed })
          throw err
        }
      }
    },
  })
}

export default pendingTxs
