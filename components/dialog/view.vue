<template>
  <v-dialog
    scrollable
    :value="value"
    @input="$emit('input', $event)"
    max-width="1200px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card>
      <v-card-title>
        <span class="title">{{ formTitle }}</span>
        <v-spacer />
        <v-btn color="red" fab @click="$emit('input', false)">
          <v-icon color="white" size="36">mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container v-if="['image/png', 'image/jpeg'].includes(type)">
          <v-card elevation="0">
            <v-img :src="data" max-height="70vh" contain />
          </v-card>
        </v-container>
        <v-container v-else-if="type === 'application/pdf'">
          <v-card elevation="0" height="70vh">
            <object :data="data" type="application/pdf" width="100%" height="100%" />
          </v-card>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    formTitle: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
