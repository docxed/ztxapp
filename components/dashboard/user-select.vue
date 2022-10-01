<template>
  <v-container>
    <v-autocomplete
      color="purple"
      item-color="purple"
      :value="userData._id"
      @change="update({ _id: $event })"
      label="ผู้เล่น"
      prepend-icon="mdi-account"
      dense
      outlined
      :items="userItems"
      item-text="name"
      item-value="_id"
      auto-select-first
    ></v-autocomplete>
  </v-container>
</template>
<script>
export default {
  props: {
    userItems: {
      type: Array,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
  },
  mounted() {},
  created() {},
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    update(event) {
      this.$emit("update:userData", { ...this.userData, ...event })
      this.$emit("goData", { ...this.userData, ...event })
    },
  },
}
</script>
