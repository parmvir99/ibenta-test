import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
/* eslint-disable */
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {
    getToken: state => state.token
  },
  actions: {
    _setCredentials_: ({ commit, state }, payload) => commit('_setCredentials_', payload)
  },
  mutations: {
    _setCredentials_ (state, payload) {
      state.token = payload
    }
  },
  plugins: [createPersistedState()]
})
