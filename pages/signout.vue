<template></template>
<script>
export default {
  async mounted() {
    await this.$store.dispatch("users/logout")
    this.$router.push("/signin")
  },
}
</script>
