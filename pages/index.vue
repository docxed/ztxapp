<template>
  <v-row justify="center" align="center"> </v-row>
</template>

<script>
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "แดชบอร์ด",
      meta: [
        {
          hid: "ZTX App - แดชบอร์ด",
          name: "ZTX App - แดชบอร์ด",
          content: "ZTX App | แดชบอร์ด",
        },
      ],
    }
  },
  mounted() {
    this.$axios.get("/users")
  },
}
</script>
