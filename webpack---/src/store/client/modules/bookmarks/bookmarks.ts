import flatMap from 'lodash/flatMap'
import { Commit } from 'vuex'
import { BookmarkTypes } from '@/constants-ts/bookmarks/bookmarkType'
import { addBookmark, removeBookmark, loadBookmarksVacancies, loadBookmarksJobs, loadBookmarksGigs } from '@/api/bookmarks'
import Bookmark from '@/models-ts/bookmarks/Bookmark'
import BookmarkListItem from '@/models-ts/bookmarks/BookmarkListItem'
import LoadableModel from '@/models-ts/LoadableModel'
import LoadablePageModel, { LoadablePagePagination } from '@/models-ts/LoadablePageModel'
import { IBookmarksState } from './types'

const getInitialState = (): IBookmarksState => ({
  bookmarks: new LoadableModel<Array<Bookmark>>(),
  vacancyBookmarks: new LoadablePageModel<BookmarkListItem>(),
  jobBookmarks: new LoadablePageModel<BookmarkListItem>(),
  gigBookmarks: new LoadablePageModel<BookmarkListItem>(),
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state: IBookmarksState) {
      Object.assign(state, getInitialState())
    },
    setBookmarks (state: IBookmarksState, bookmarks: {} = {}) {
      // @ts-ignore
      state.bookmarks.loaded(flatMap(Object.values(bookmarks)).map(Bookmark.fromServer))
    },
    addBookmark (state: IBookmarksState, bookmark: Bookmark) {
      state.bookmarks.loaded([ ...state.bookmarks.value, bookmark ])
    },
    removeBookmark (state: IBookmarksState, { id }: { id: number }) {
      const index = state.bookmarks.value.findIndex((b: Bookmark) => b.id === id)
      if (index !== -1) {
        const bookmarks = state.bookmarks.value.slice(0)
        bookmarks.splice(index, 1)
        state.bookmarks.loaded([ ...bookmarks ])
      }
    },
    setVacancyLoading (state: IBookmarksState) {
      state.vacancyBookmarks.loading()
    },
    setVacancyLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.vacancyBookmarks.loaded(data)
    },
    addVacancyLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.vacancyBookmarks.loadMore(data)
    },
    setJobLoading (state: IBookmarksState) {
      state.jobBookmarks.loading()
    },
    setJobLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.jobBookmarks.loaded(data)
    },
    addJobLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.jobBookmarks.loadMore(data)
    },
    setGigLoading (state: IBookmarksState) {
      state.gigBookmarks.loading()
    },
    setGigLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.gigBookmarks.loaded(data)
    },
    addGigLoaded (
      state: IBookmarksState,
      data: { pagination: LoadablePagePagination, values: Array<BookmarkListItem> }
    ) {
      state.gigBookmarks.loadMore(data)
    },
  },
  actions: {
    async addBookmark ({ commit }: { commit: Commit }, { id, type }: { id: number, type: BookmarkTypes }) {
      const response = await addBookmark({ entityId: id, type })
      commit('addBookmark', Bookmark.fromServer(response))
    },
    async removeBookmark ({ commit }: { commit: Commit }, { id }: { id: number }) {
      await removeBookmark(id)
      commit('removeBookmark', { id })
    },
    async loadVacancyBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      commit('setVacancyLoading')
      const { pagination, bookmarks } = await loadBookmarksVacancies({ limit, offset, orderField, orderType })
      commit('setVacancyLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
    async loadMoreVacancyBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      const { pagination, bookmarks } = await loadBookmarksVacancies({ limit, offset, orderField, orderType })
      commit('addVacancyLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
    async loadJobBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      commit('setJobLoading')
      const { pagination, bookmarks } = await loadBookmarksJobs({ limit, offset, orderField, orderType })
      commit('setJobLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
    async loadMoreJobBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      const { pagination, bookmarks } = await loadBookmarksJobs({ limit, offset, orderField, orderType })
      commit('addJobLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
    async loadGigBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      commit('setGigLoading')
      const { pagination, bookmarks } = await loadBookmarksGigs({ limit, offset, orderField, orderType })
      commit('setGigLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
    async loadMoreGigBookmarks (
      { commit }: { commit: Commit },
      { limit = 10, offset = 0, orderField = 'date', orderType = 'desc' }
    ) {
      const { pagination, bookmarks } = await loadBookmarksGigs({ limit, offset, orderField, orderType })
      commit('addGigLoaded', { pagination, values: bookmarks.map(BookmarkListItem.fromServer) })
    },
  }
})
