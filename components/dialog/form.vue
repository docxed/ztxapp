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
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
  },
}
</script>
