<template>
  <v-snackbar
    :value="true"
    :color="data.color"
    :timeout="3000"
    transition="slide-x-reverse-transition"
    bottom
    right
    :style="{ 'margin-bottom': calcMargin(index) }"
    @input="clearMessage(data.title)"
  >
    <span class="body-2">{{ data.type }} | {{ data.title }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn icon v-bind="attrs" @click.native="clearMessage(data.title)">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  methods: {
    ...mapActions("messages", ["clearMessage"]),

    calcMargin(index) {
      return index * 60 + "px"
    },
  },
}
</script>
