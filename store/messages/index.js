export const state = () => ({
  message: {},
})

export const getters = {
  getMessage: (state) => {
    return Object.values(state.message)
  },
}

export const mutations = {
  SET_MESSAGE: async (state, { message }) => {
    const newMessage = { ...state.message }
    newMessage[message.title] = message
    state.message = newMessage
  },
  REMOVE_MESSAGE: (state, title) => {
    const newMessage = { ...state.message }
    delete newMessage[title]
    state.message = newMessage
  },
}

export const actions = {
  setMessage({ commit }, data) {
    return commit("SET_MESSAGE", {
      message: data,
    })
  },
  clearMessage({ commit }, title) {
    return commit("REMOVE_MESSAGE", title)
  },
}
