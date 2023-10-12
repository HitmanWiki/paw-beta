import { Commit } from 'vuex'
import {
  getCustomerCompleted,
  getCustomerInProgressOffers,
  getCustomerNegotiationsOffers,
  getFreelancerCompleted,
  getFreelancerInProgress,
  getFreelancerNegotiationsOffers,
  getMyServices,
  publishService,
  unpublishService
} from '@/api/gig'
import { IMyGigsState } from './types'
import MyGigListItem from '@/models-ts/gigs/MyGigListItem'
import LoadablePageModel, { LoadablePagePagination } from '@/models-ts/LoadablePageModel'
import { GigStatuses } from '@/constants-ts/gig/gigStatuses'
import MyGigApplication from '@/models-ts/gigs/MyGigApplication'
import GigOfferListItem from '@/models/lists/GigOfferListItem'

const getInitialState = (): IMyGigsState => ({
  freelancerPostedList: new LoadablePageModel<MyGigListItem>(),
  freelancerDraftsList: new LoadablePageModel<MyGigListItem>(),
  freelancerOffersList: new LoadablePageModel<MyGigApplication>(),
  freelancerInProgressList: new LoadablePageModel<GigOfferListItem>(),
  freelancerCompletedList: new LoadablePageModel<GigOfferListItem>(),
  customerOffersList: new LoadablePageModel<MyGigApplication>(),
  customerInProgressList: new LoadablePageModel<GigOfferListItem>(),
  customerCompletedList: new LoadablePageModel<GigOfferListItem>(),
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state: IMyGigsState) {
      Object.assign(state, getInitialState())
    },
    setFreelancerPostedListLoading (state: IMyGigsState) {
      state.freelancerPostedList.loading()
    },
    setFreelancerPostedListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigListItem> }
    ) {
      state.freelancerPostedList.loaded(data)
    },
    addFreelancerPostedList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigListItem> }
    ) {
      state.freelancerPostedList.loadMore(data)
    },
    setFreelancerDraftsListLoading (state: IMyGigsState) {
      state.freelancerDraftsList.loading()
    },
    setFreelancerDraftsListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigListItem> }
    ) {
      state.freelancerDraftsList.loaded(data)
    },
    addFreelancerDraftsList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigListItem> }
    ) {
      state.freelancerDraftsList.loadMore(data)
    },
    removeFromPublished (state: IMyGigsState, id: number) {
      const i = state.freelancerPostedList.values.findIndex(gig => gig.id === id)
      if (i !== -1) {
        state.freelancerPostedList.pagination.total = Math.max(state.freelancerPostedList.pagination.total - 1, 0)
        state.freelancerPostedList.pagination.offset = Math.max((state.freelancerPostedList.pagination.offset || 1) - 1, 0)
        state.freelancerPostedList.values.splice(i, 1)
      }
    },
    removeFromDrafts (state: IMyGigsState, id: number) {
      const i = state.freelancerDraftsList.values.findIndex(gig => gig.id === id)
      if (i !== -1) {
        state.freelancerDraftsList.pagination.total = Math.max(state.freelancerDraftsList.pagination.total - 1, 0)
        state.freelancerDraftsList.pagination.offset = Math.max((state.freelancerDraftsList.pagination.offset || 1) - 1, 0)
        state.freelancerDraftsList.values.splice(i, 1)
      }
    },
    setFreelancerOffersListLoading (state: IMyGigsState) {
      state.freelancerOffersList.loading()
    },
    setFreelancerOffersListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigApplication> }
    ) {
      state.freelancerOffersList.loaded(data)
    },
    addFreelancerOffersList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigApplication> }
    ) {
      state.freelancerOffersList.loadMore(data)
    },
    setFreelancerInProgressListLoading (state: IMyGigsState) {
      state.freelancerInProgressList.loading()
    },
    setFreelancerInProgressListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.freelancerInProgressList.loaded(data)
    },
    addFreelancerInProgressList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.freelancerInProgressList.loadMore(data)
    },
    setFreelancerCompletedListLoading (state: IMyGigsState) {
      state.freelancerCompletedList.loading()
    },
    setFreelancerCompletedListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.freelancerCompletedList.loaded(data)
    },
    addFreelancerCompletedList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.freelancerCompletedList.loadMore(data)
    },
    setCustomerOffersListLoading (state: IMyGigsState) {
      state.freelancerOffersList.loading()
    },
    setCustomerOffersListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigApplication> }
    ) {
      state.customerOffersList.loaded(data)
    },
    addCustomerOffersList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<MyGigApplication> }
    ) {
      state.customerOffersList.loadMore(data)
    },
    setCustomerInProgressListLoading (state: IMyGigsState) {
      state.customerInProgressList.loading()
    },
    setCustomerInProgressListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.customerInProgressList.loaded(data)
    },
    addCustomerInProgressList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.customerInProgressList.loadMore(data)
    },
    setCustomerCompletedListLoading (state: IMyGigsState) {
      state.customerCompletedList.loading()
    },
    setCustomerCompletedListLoaded (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.customerCompletedList.loaded(data)
    },
    addCustomerCompletedList (
      state: IMyGigsState,
      data: { pagination: LoadablePagePagination, values: Array<GigOfferListItem> }
    ) {
      state.customerCompletedList.loadMore(data)
    },
  },
  actions: {
    async publish ({ commit }: { commit: Commit }, id: number) {
      await publishService(id)
      commit('removeFromDrafts', id)
    },
    async unpublish ({ commit }: { commit: Commit }, id: number) {
      await unpublishService(id)
      commit('removeFromPublished', id)
    },
    async getFreelancerPostedGigsList ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerPostedListLoading')
      const { pagination, gigs } = await getMyServices(limit, offset, GigStatuses.PUBLISHED)
      commit('setFreelancerPostedListLoaded', { pagination, values: gigs.map(MyGigListItem.fromServer) })
    },
    async loadMoreFreelancerPostedGigsList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, gigs } = await getMyServices(limit, offset, GigStatuses.PUBLISHED)
      commit('addFreelancerPostedList', { pagination, values: gigs.map(MyGigListItem.fromServer) })
    },
    async getFreelancerDraftsGigsList ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerDraftsListLoading')
      const { pagination, gigs } = await getMyServices(limit, offset, GigStatuses.DRAFT)
      commit('setFreelancerDraftsListLoaded', { pagination, values: gigs.map(MyGigListItem.fromServer) })
    },
    async loadMoreFreelancerDraftsGigsList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, gigs } = await getMyServices(limit, offset, GigStatuses.DRAFT)
      commit('addFreelancerDraftsList', { pagination, values: gigs.map(MyGigListItem.fromServer) })
    },
    async getFreelancerNegotiationOffersList ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerOffersListLoading')
      const { pagination, applications } = await getFreelancerNegotiationsOffers(limit, offset)
      commit('setFreelancerOffersListLoaded', { pagination, values: applications.map(MyGigApplication.fromServer) })
    },
    async loadMoreFreelancerNegotiationOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, applications } = await getFreelancerNegotiationsOffers(limit, offset)
      commit('addFreelancerOffersList', { pagination, values: applications.map(MyGigApplication.fromServer) })
    },
    async getFreelancerInProgressOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      commit('setFreelancerInProgressListLoading')
      const { pagination, offers } = await getFreelancerInProgress(limit, offset)
      commit('setFreelancerInProgressListLoaded', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async loadMoreFreelancerInProgressOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, offers } = await getFreelancerInProgress(limit, offset)
      commit('addFreelancerInProgressList', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async refreshFreelancerInProgressOffersList (
      { state, commit }: { state: IMyGigsState, commit: Commit }
    ) {
      commit('setFreelancerInProgressListLoading')
      const { pagination, offers } = await getFreelancerInProgress(state.freelancerInProgressList.values.length, 0)
      commit('setFreelancerInProgressListLoaded', {
        pagination: {
          ...state.freelancerInProgressList.pagination,
          total: pagination.total,
        },
        values: offers.map(GigOfferListItem.fromServer)
      })
    },
    async getFreelancerCompletedOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      commit('setFreelancerCompletedListLoading')
      const { pagination, offers } = await getFreelancerCompleted(limit, offset)
      commit('setFreelancerCompletedListLoaded', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async loadMoreFreelancerCompletedOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, offers } = await getFreelancerCompleted(limit, offset)
      commit('addFreelancerCompletedList', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async getCustomerNegotiationOffersList ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setCustomerOffersListLoading')
      const { pagination, applications } = await getCustomerNegotiationsOffers(limit, offset)
      commit('setCustomerOffersListLoaded', { pagination, values: applications.map(MyGigApplication.fromServer) })
    },
    async loadMoreCustomerNegotiationOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, applications } = await getCustomerNegotiationsOffers(limit, offset)
      commit('addCustomerOffersList', { pagination, values: applications.map(MyGigApplication.fromServer) })
    },
    async getCustomerInProgressOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      commit('setCustomerInProgressListLoading')
      const { pagination, offers } = await getCustomerInProgressOffers(limit, offset)
      commit('setCustomerInProgressListLoaded', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async loadMoreCustomerInProgressOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, offers } = await getCustomerInProgressOffers(limit, offset)
      commit('addCustomerInProgressList', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async getCustomerCompletedOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      commit('setCustomerCompletedListLoading')
      const { pagination, offers } = await getCustomerCompleted(limit, offset)
      commit('setCustomerCompletedListLoaded', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
    async loadMoreCustomerCompletedOffersList (
      { commit }: { commit: Commit },
      { limit, offset }: { limit: number, offset: number }
    ) {
      const { pagination, offers } = await getCustomerCompleted(limit, offset)
      commit('addCustomerCompletedList', { pagination, values: offers.map(GigOfferListItem.fromServer) })
    },
  }
})
