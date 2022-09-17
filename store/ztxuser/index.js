export const state = () => ({
  users: [],
})

export const getters = {
  getUsers: (state) => {
    return state.users
  },
}

export const mutations = {
  SET_USERS: (state, data) => {
    state.users = data
  },
}

export const actions = {
  async getUsers({ commit }) {
    const response = await this.$axios.get("/users")
    commit("SET_USERS", response.data.users)
  },
}
