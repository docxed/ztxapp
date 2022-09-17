<template>
  <div class="text-center time-display" :class="isCheat && 'red--text'">
    <span>{{ (isCheat ? "-" : "") + timeDisplay }}</span>
  </div>
</template>
<script>
export default {
  props: {
    timeDisplay: {
      type: String,
      required: true,
    },
    isCheat: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  created() {},
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {},
}
</script>
<style scoped>
.time-display {
  font-size: 4em;
  color: white;
  background-color: black;
  border-radius: 15px;
}
</style>
