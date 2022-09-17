export default (context, inject) => {
  const store = context.store

  inject("loader", async (visible, text) => {
    if (visible) {
      store.dispatch("loader/show", { text })
    } else {
      store.dispatch("loader/hide")
    }
  })
}
