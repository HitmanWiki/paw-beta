import Vue from 'vue'
import get from 'lodash/get'
import LoadablePageModel from '@/models/LoadablePageModel'
import NotificationListItem from '@/models-ts/dashboard/NotificationListItem'
import {
    getNotifications,
    getUnreadNotificationsCount,
    readNotifications
} from '@/api/notifications'

const getInitialState = () => ({
    list: new LoadablePageModel(NotificationListItem),
    dashboardNotifications: new LoadablePageModel(NotificationListItem),
    unreadedCount: 0,
})

export default () => ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
        resetState(state) {
            Object.assign(state, getInitialState())
        },
        setListLoading(state) {
            state.list.loading()
        },
        setListLoaded(state, data) {
            state.list.loaded(data)
        },
        readNotifications(state, ids) {
            if (ids) {
                state.list.values.forEach(note => {
                    if (ids.includes(note.id)) {
                        note.readed = true
                    }
                })
                state.dashboardNotifications.values.forEach(note => {
                    if (ids.includes(note.id)) {
                        note.readed = true
                    }
                })
                state.unreadedCount = Math.max(state.unreadedCount - ids.length, 0)
            } else {
                state.list.values.forEach(note => {
                    note.readed = true
                })
                state.dashboardNotifications.values.forEach(note => {
                    note.readed = true
                })
                state.unreadedCount = 0
            }
        },
        setUnreadedCount(state, count) {
            state.unreadedCount = count || 0
        },
        setNotificationData(state, {
            id,
            path,
            property,
            data
        }) {
            const note = state.list.values.find(note => note.id === id)
            const dashboardNote = state.dashboardNotifications.values.find(note => note.id === id)
            if (note) {
                const target = get(note, path)
                if (target) {
                    Vue.set(target, property, data)
                }
            }
            if (dashboardNote) {
                const target = get(dashboardNote, path)
                if (target) {
                    Vue.set(target, property, data)
                }
            }
        },
        setDashboardNotificationsLoading(state) {
            state.dashboardNotifications.loading()
        },
        setDashboardNotificationsLoaded(state, data) {
            state.dashboardNotifications.loaded(data)
        },
    },
    actions: {
        async loadNotifications({
            state,
            commit
        }, {
            limit = 10,
            offset = 0
        } = {}) {
            commit('setListLoading')
            const {
                pagination,
                notifications
            } = await getNotifications(limit, offset)
            if (offset === 0) {
                commit('setListLoaded', {
                    pagination,
                    values: notifications.map(NotificationListItem.fromServer)
                })
            } else {
                commit('setListLoaded', {
                    pagination,
                    values: state.list.values.concat(notifications.map(NotificationListItem.fromServer))
                })
            }
        },
        async reloadNotifications({
            commit,
            dispatch
        }) {
            commit('resetState')
            return dispatch('loadNotifications')
        },
        async readNotifications({
            commit,
            dispatch
        }, ids) {
            await readNotifications(ids)
            commit('readNotifications', ids)
        },
        async readAllNotifications({
            commit
        }) {
            await readNotifications()
            commit('readNotifications')
            commit('setUnreadedCount', 0)
        },
        async getUnreadNotificationsCount({
            commit,
            dispatch
        }) {
            const count = await getUnreadNotificationsCount()
            commit('setUnreadedCount', count)
        },
        async executeBtnRequest({
            commit
        }, {
            id,
            isFirstBtn,
            request
        }) {
            const property = isFirstBtn ? 0 : 1
            commit('setNotificationData', {
                id,
                path: 'btnsLoaders',
                property,
                data: true
            })
            try {
                await request()
            } finally {
                commit('setNotificationData', {
                    id,
                    path: 'btnsLoaders',
                    property,
                    data: false
                })
            }
        },
        async loadDashboardNotifications({
            commit
        }) {
            commit('setDashboardNotificationsLoading')
            const {
                pagination,
                notifications
            } = await getNotifications(2, 0)
            commit('setDashboardNotificationsLoaded', {
                pagination,
                values: notifications.map(NotificationListItem.fromServer)
            })
        },
    }
})