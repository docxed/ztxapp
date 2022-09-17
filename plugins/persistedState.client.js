import createPersistedState from "vuex-persistedstate"

export default ({ store }) => {
  createPersistedState({
    key: "info",
    paths: ["users"],
  })(store)
}
