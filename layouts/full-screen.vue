<template>
  <v-app>
    <v-container fill-height>
      <nuxt />
      <!-- Message | Snackbar -->
      <message-snackbar
        v-for="(data, index) in getMessage"
        :key="`message-${data.title}`"
        :data="data"
        :index="index"
      />
    </v-container>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters("messages", ["getMessage"]),
  },
}
</script>
