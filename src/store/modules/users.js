import firebase from '../../api/firebase'

const state = () => ({
    loggedIn: false,
    loginLoading: false,
    loginFailed: false
})

const getters = {}

const actions = {
    login({commit}, form) {
        commit('setLoading', true);
        return firebase.auth.signInWithEmailAndPassword(form.email, form.password).then(
            () => {
                commit('setLoggedIn', true);
                commit('setLoading', false);
                commit('setLoginFailed', false);
            },
            (err) => {
                commit('setLoading', false);
                commit('setLoggedIn', true);
                commit('setLoginFailed', true);
                console.error(err)
            }
        )
    },

    logout({commit}) {
        commit('setLoading', true);
        return firebase.auth.signOut().then(() => {
            commit('setLoggedIn', false);
            commit('setLoading', false);
        },
        () => {
            commit('setLoading', false);
        })
    }
}

const mutations = {
    setLoading(state, loading) {
        state.loginLoading = loading
    },

    setLoggedIn(state, logged) {
        state.loggedIn = logged
    },

    setLoginFailed(state, isFailed) {
        state.loginFailed = isFailed
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
