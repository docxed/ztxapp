export const state = () => ({
  user: null,
  token: null,
})

export const getters = {
  getUser: (state) => {
    return state.user
  },
  getToken: (state) => {
    return state.token
  },
}

export const mutations = {
  SET_USER: (state, data) => {
    for (let key in data) {
      state.user = data
    }
  },
  SET_TOKEN: (state, data) => {
    state.token = data
  },
}

export const actions = {
  setUser({ commit }, data) {
    commit("SET_USER", data)
  },
  setToken({ commit }, data) {
    commit("SET_TOKEN", data)
  },
  async login({ commit }, data) {
    const response = await this.$axios.post("/signin", data)
    const { token, authData } = response.data
    const cookieList = [
      {
        name: "token",
        value: token,
      },
      {
        name: "authData",
        value: authData,
      },
    ]
    await this.$cookies.setAll(cookieList)
    actions.setUser({ commit }, authData)
    actions.setToken({ commit }, token)
  },
  async logout({ commit }) {
    await this.$cookies.removeAll()
    actions.setUser({ commit }, null)
    actions.setToken({ commit }, null)
  },
}
