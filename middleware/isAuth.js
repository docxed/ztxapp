export default function ({ app, error, redirect, store, route, req }) {
  const hasToken = app.$cookies.get("token")
  if (!hasToken) {
    console.error({ statusCode: 401, message: "UNAUTHORIZED" })
    return redirect("/signin")
  }
}
