<template>
  <v-dialog :value="visible" persistent width="300">
    <v-card color="primary" dark>
      <v-card-text class="pa-4">
        {{ text }}
        <v-progress-linear indeterminate color="white" class="my-2" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState("loader", ["text", "visible"]),
  },
}
</script>
