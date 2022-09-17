<template>
  <div class="text-center player-display">
    <span>{{ ["random"].includes(stages) ? emojis[total] : usersData[total]?.label || "-" }}</span>
  </div>
</template>
<script>
export default {
  props: {
    usersData: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    emojis: {
      type: Array,
      required: true,
    },
    stages: {
      type: String,
      required: true,
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
.player-display {
  font-size: 4em;
  color: white;
  background-color: black;
  border-radius: 15px;
}
</style>
