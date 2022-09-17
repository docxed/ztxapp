export default function ({ app, error, redirect, store, route, req }) {
  const hasToken = app.$cookies.get("token")
  if (hasToken) {
    return redirect("/")
  }
}
