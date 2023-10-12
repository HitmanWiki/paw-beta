const getInitialState = () => ({
    params: null,
    triggerCondition: null,
})

export default () => ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
        resetParams(state) {
            state.params = null
        },
        setParams(state, params = {}) {
            state.params = {
                ...state.params,
                ...params,
            }
        },
        resetTriggerCondition(state) {
            state.triggerCondition = null
        },
        setTriggerCondition(state, triggerCondition) {
            state.triggerCondition = triggerCondition
        }
    },
    actions: {}
})