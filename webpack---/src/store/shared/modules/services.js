import LoadableModel from '@/models/LoadableModel'
import LoadablePageModel from '@/models/LoadablePageModel'
import Gig from '@/models/backend/Gig'
import ServiceListItem from '@/models/lists/ServiceListItem'
import {
    getService,
    getServices,
    getGigs
} from '@/api/gig'

const getInitialFilter = () => ({
    skill: '',
    totalLimit: 32,
    totalOffset: 0,
})

const getInitialState = () => ({
    ...getInitialFilter(),
    details: new LoadableModel(Object),
    gigs: new LoadablePageModel(Array),
    gigsBySkill: new LoadablePageModel(Array),
    prefetched: false,
})

export default () => {
    return ({
        namespaced: true,
        state: getInitialState(),
        getters: {
            service: state => state.details.value && Gig.fromServer(state.details.value),
            gigs: state => state.gigs.values ? state.gigs.values.map(ServiceListItem.fromServer) : [],
            gigsBySkill: state => state.gigsBySkill.values ? state.gigsBySkill.values.map(ServiceListItem.fromServer) : [],
        },
        mutations: {
            resetState(state) {
                Object.assign(state, getInitialState())
            },
            resetFilters(state) {
                Object.assign(state, getInitialFilter())
            },
            beforeReady(state) {
                state.details = new LoadableModel(Object, state.details)
                state.gigs = new LoadablePageModel(Object, state.gigs)
                state.gigsBySkill = new LoadablePageModel(Object, state.gigsBySkill)
            },
            clearDetails(state) {
                state.details = new LoadableModel(Object)
            },
            setPrefetched(state, flag) {
                state.prefetched = flag
            },
            setServiceLoading(state) {
                state.details.loading()
            },
            setServiceLoaded(state, service) {
                state.details.loaded(service)
            },
            setGigsLoading(state) {
                state.gigs.loading()
            },
            setGigsLoaded(state, gigs) {
                state.gigs.loaded(gigs)
            },
            addGigsLoaded(state, {
                values,
                pagination
            }) {
                state.gigs.loaded({
                    values: [...state.gigs.values, ...values],
                    pagination
                })
            },
            setGigsBySkillLoading(state) {
                state.gigsBySkill.loading()
            },
            setGigsBySkillLoaded(state, services) {
                state.gigsBySkill.loaded(services)
            },
            addGigsBySkillLoaded(state, {
                values,
                pagination
            }) {
                state.gigsBySkill.loaded({
                    values: [...state.gigsBySkill.values, ...values],
                    pagination
                })
            },
            setSkill(state, skill) {
                state.skill = skill
            },
            setPagination(state, {
                limit = 30,
                offset = 0
            }) {
                state.totalLimit = limit
                state.totalOffset = offset
            },
        },
        actions: {
            async load({
                commit
            }, {
                id,
                slug
            }) {
                commit('setServiceLoading')
                let service
                if (slug) {
                    service = await getService(`${slug}-${id}`)
                } else {
                    service = await getService(id)
                }
                commit('setServiceLoaded', service)
            },
            async loadGigs({
                commit,
                state
            }, {
                search,
                sort
            }) {
                commit('setGigsLoading')
                const gigs = await getGigs({
                    limit: state.totalLimit,
                    offset: state.totalOffset,
                    search,
                    order: sort,
                })
                commit('setGigsLoaded', {
                    values: gigs.gigs,
                    pagination: gigs.pagination
                })
            },
            async loadMoreGigs({
                commit,
                state
            }, {
                search,
                sort
            }) {
                const gigs = await getGigs({
                    limit: state.totalLimit,
                    offset: state.totalOffset,
                    search,
                    order: sort,
                })
                commit('addGigsLoaded', {
                    values: gigs.gigs,
                    pagination: gigs.pagination
                })
            },
            async loadGigsBySkill({
                commit,
                state
            }, {
                search,
                sort,
                subSkills
            }) {
                commit('setGigsBySkillLoading')
                const gigs = await getServices({
                    skill: state.skill,
                    subSkills: subSkills,
                    limit: state.totalLimit,
                    offset: state.totalOffset,
                    search: search,
                    order: sort,
                })
                commit('setGigsBySkillLoaded', {
                    values: gigs.gigs,
                    pagination: gigs.pagination
                })
            },
            async loadMoreGigsBySkill({
                commit,
                state
            }, {
                search,
                sort,
                subSkills
            }) {
                const gigs = await getServices({
                    skill: state.skill,
                    subSkills: subSkills,
                    limit: state.totalLimit,
                    offset: state.totalOffset,
                    search: search,
                    order: sort,
                })
                commit('addGigsBySkillLoaded', {
                    values: gigs.gigs,
                    pagination: gigs.pagination
                })
            }
        },
    })
}