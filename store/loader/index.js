export const state = () => ({
  text: "",
  visible: false,
})

export const mutations = {
  set(state, data) {
    for (const key in data) {
      state[key] = data[key]
    }
  },
}

export const actions = {
  show(context, { text }) {
    if (!text) text = "กำลังโหลด..."
    context.commit("set", {
      text,
      visible: true,
    })
  },

  hide(context) {
    context.commit("set", {
      text: "",
      visible: false,
    })
  },
}
