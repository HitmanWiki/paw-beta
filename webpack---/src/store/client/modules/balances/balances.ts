import Balances from '@/models/Balances'
import LoadableModel from '@/models-ts/LoadableModel'
import { Blockchain, WalletGroup } from '@/constants-ts/blockchain'
import { EARNS_DIRECT, EARNS_REFERRAL } from '@/constants-ts/withdraw'
import { getBalance, getWithdraws } from '@/api/timewarp'
import { getTimeWarpBalanceInfo } from '@/servicies/blockchain/TimeWarpContract'
import { getBalances } from '@/utils-ts/balance'
import { getEscrowBalance } from '@/api/balances'
import { IBalancesState } from './types'
import { Commit } from 'vuex'
import Wallet from '@/models-ts/Wallet'
import WithdrawalRequest from '@/models-ts/WithdrawalRequest'

const getInitialState = (): IBalancesState => ({
  interval: null,
  miningBalance: new LoadableModel(),
  referralBalance: new LoadableModel(),
  timeWarpBalance: new LoadableModel({ isLoading: false, value: [] }),
  escrowBalance: new LoadableModel({ isLoading: false, value: '0.00' }),
  balances: new LoadableModel({
    isLoading: true,
    isLoaded: false,
    value: new Balances()
  }),
  withdrawals: new LoadableModel({ isLoading: false, value: [] }),
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state: IBalancesState) {
      if (state.interval) {
        clearInterval(state.interval)
      }
      Object.assign(state, getInitialState())
    },
    setInterval: (state: IBalancesState, interval: NodeJS.Timeout) => {
      state.interval = interval
    },
    setUserBalances (state: IBalancesState, balances: Balances) {
      state.balances.loaded(balances)
    },
    setMiningBalances (state: IBalancesState, balance: string) {
      state.miningBalance.loaded(balance)
    },
    setTimeWarpBalanceLoading (state: IBalancesState) {
      state.timeWarpBalance.loading()
    },
    setTimeWarpBalanceLoaded (state: IBalancesState, balance: Array<any>) {
      state.timeWarpBalance.loaded(balance)
    },
    rejectTimeWarpBalanceLoading (state: IBalancesState) {
      state.timeWarpBalance.reject()
    },
    setReferralBalances (state: IBalancesState, balance: string) {
      state.referralBalance.loaded(balance)
    },
    setEscrowBalanceLoading (state: IBalancesState) {
      state.escrowBalance.loading()
    },
    setEscrowBalanceLoaded (state: IBalancesState, balance: string) {
      state.escrowBalance.loaded(balance)
    },
    rejectEscrowBalanceLoading (state: IBalancesState) {
      state.escrowBalance.reject()
    },
    setWithdrawalsLoading (state: IBalancesState) {
      state.withdrawals.loading()
    },
    setWithdrawalsLoaded (state: IBalancesState, list: Array<WithdrawalRequest>) {
      state.withdrawals.loaded(list)
    },
  },
  actions: {
    async loadMiningBalance ({ commit }: { commit: Commit }) {
      const balance = await getBalance()
      commit('setMiningBalances', String(balance[EARNS_DIRECT]))
    },
    async loadBonusBalance ({ commit }: { commit: Commit }) {
      const balance = await getBalance()
      commit('setMiningBalances', String(balance[EARNS_DIRECT]))
      commit('setReferralBalances', String(balance[EARNS_REFERRAL]))
    },
    async loadTimeWarpBalance ({ state, commit }: { state: IBalancesState, commit: Commit }, wallets: Array<Wallet>) {
      if (!state.timeWarpBalance.isLoading) {
        try {
          commit('setTimeWarpBalanceLoading')
          const walletsInfo = wallets
            .reduce((walletsInfo: Array<{ address: string, blockchain: Blockchain}>, { address, group }) => {
              return group !== WalletGroup.TronLink
                ? walletsInfo.concat(
                  { address, blockchain: Blockchain.Binance },
                  { address, blockchain: Blockchain.Ethereum },
                  { address, blockchain: Blockchain.Polygon },
                )
                : walletsInfo
            }, [])
          const info = await Promise.all(walletsInfo.map(getTimeWarpBalanceInfo))
          commit('setTimeWarpBalanceLoaded', info)
        } catch (e) {
          console.error(e)
          commit('rejectTimeWarpBalanceLoading')
          throw e
        }
      }
    },
    async loadBalances ({ commit, state, rootState }: { commit: Commit, state: IBalancesState, rootState: any }) {
      if (state.interval) {
        clearInterval(state.interval)
      }
      const getBalance = async function () {
        try {
          let balances
          if (rootState.user.wallet.group === WalletGroup.TronLink) {
            balances = await getBalances({
              addressTron: rootState.user.wallet.address
            })
          } else {
            balances = await getBalances({
              addressEth: rootState.user.wallet.address
            })
          }
          if (balances) {
            commit('setUserBalances', new Balances(balances))
          }
        } catch (e) {
          console.error(e)
        }
      }
      const interval = setInterval(getBalance, 15000)
      commit('setInterval', interval)
      getBalance()
    },
    async loadEscrowBalance ({ state, commit }: { state: IBalancesState, commit: Commit }) {
      if (!state.escrowBalance.isLoading) {
        try {
          commit('setEscrowBalanceLoading')
          const data = await getEscrowBalance()
          commit('setEscrowBalanceLoaded', data.balance.amount)
        } catch (e) {
          console.error(e)
          commit('rejectEscrowBalanceLoading')
          throw e
        }
      }
    },
    async loadWithdrawals ({ state, commit }: { state: IBalancesState, commit: Commit }) {
      if (!state.withdrawals.isLoading) {
        commit('setWithdrawalsLoading')
        const list = await getWithdraws()
        commit('setWithdrawalsLoaded', list.map(WithdrawalRequest.fromServer))
      }
    },
  }
})
