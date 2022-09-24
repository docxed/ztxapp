<template>
  <v-dialog scrollable :value="value" @input="$emit('input', $event)" max-width="700px">
    <v-card>
      <v-card-title class="title">
        <span v-if="name">
          {{ title }} <strong class="mx-2">{{ name }}</strong> หรือไม่ ?
        </span>
        <span v-else>{{ title }} หรือไม่ ?</span>
      </v-card-title>

      <v-card-text>
        <p :class="`${description.color}--text`" v-if="description">
          <strong>หมายเหตุ</strong> {{ description.text }}
        </p>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" text @click="$emit('close', $event)">ยกเลิก</v-btn>
        <v-btn :color="color" dark class="button" @click="$emit('submit', $event)">ยืนยัน</v-btn>
        <v-spacer />
      </v-card-actions>
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
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    description: {
      type: Object,
      default: () => null,
    },
    color: {
      type: String,
      required: true,
    },
  },
}
</script>
