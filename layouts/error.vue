<template>
  <v-container fluid fill-height dark>
    <v-row justify="center" align="center">
      <p v-if="error.statusCode === 404" class="display-1 font-weight-black">
        {{ pageNotFound }}
      </p>
      <p v-else>
        {{ otherError }}
      </p>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "EmptyLayout",
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 ไม่พบหน้าที่คุณต้องการ",
      otherError: "เกิดข้อผิดพลาดบางประการ",
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
