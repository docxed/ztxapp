import Vue from "vue"
import axios from "axios"

export default (context, inject) => {
  const $axios = axios.create({
    baseURL: `${process.env.NUXT_ENV_ZTXAPP_ENDPOINT}/api`,
  })
  $axios.interceptors.request.use(
    function (config) {
      const token = context.$cookies.get("token")
      config.headers["Authorization"] = `Bearer ${token}`
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  $axios.interceptors.response.use(
    async function (response) {
      const { message } = response.data
      const { store } = context
      if (message) {
        await store.dispatch("messages/setMessage", {
          title: message.title,
          type: message.type,
          color: "green",
        })
      }
      return response
    },
    async function (error) {
      if (error.response.status === 400) {
        const { store } = context
        try {
          const { message } = error.response.data
          if (Array.isArray(message)) {
            for (const m of message) {
              await store.dispatch("messages/setMessage", {
                title: m.message ? m.message : m,
                type: "เกิดข้อผิดพลาด",
                color: "red",
              })
            }
          } else {
            await store.dispatch("messages/setMessage", {
              title: message,
              type: "เกิดข้อผิดพลาด",
              color: "red",
            })
          }
        } catch {
          await store.dispatch("messages/setMessage", {
            title: "โปรดลองใหม่อีกครั้ง",
            type: "เกิดข้อผิดพลาด",
            color: "red",
          })
        }
      } else if (error.response.status === 401) {
        const { store, redirect } = context
        await store.dispatch("messages/setMessage", {
          title: "โปรดทำการเข้าสู่ระบบใหม่อีกครั้ง",
          type: "หมดอายุการใช้งาน",
          color: "red",
        })
        return redirect("/signout")
      } else if (error.response.status === 403) {
        const { role } = error.response.data
        const { store } = context
        await store.dispatch("messages/setMessage", {
          title: "สามารถใช้งานได้เฉพาะ " + role + " เท่านั้น โปรดลองใหม่อีกครั้ง",
          type: "ไม่มีสิทธ์ในการใช้งาน",
          color: "red",
        })
      }
      return Promise.reject(error)
    }
  )

  Vue.prototype.$axios = $axios

  inject("axios", $axios)
}
