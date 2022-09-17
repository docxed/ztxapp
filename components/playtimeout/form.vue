<template>
  <v-form @submit.prevent="submitTime()" ref="timeForm" v-model="validTimeForm">
    <v-row>
      <v-col>
        <v-text-field
          color="purple"
          type="number"
          :value="timeData.h"
          @change="update({ h: $event })"
          label="ชั่วโมง"
          hint="กรุณากรอกจำนวนชั่วโมง"
          min="0"
          max="23"
          max-width="2"
          dense
          filled
          class="time-field text-center"
        />
      </v-col>
      <v-col>
        <v-text-field
          color="purple"
          type="number"
          :value="timeData.m"
          @change="update({ m: $event })"
          label="นาที"
          hint="กรุณากรอกจำนวนนาที"
          min="0"
          max="59"
          max-width="2"
          dense
          filled
          class="time-field"
        />
      </v-col>
      <v-col>
        <v-text-field
          color="purple"
          type="number"
          :value="timeData.s"
          @change="update({ s: $event })"
          label="วินาที"
          hint="กรุณากรอกจำนวนวินาที"
          min="0"
          max="59"
          max-width="2"
          dense
          filled
          class="time-field"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  props: {
    timeData: {
      type: Object,
      default: () => ({
        h: 0,
        m: 0,
        s: 0,
      }),
    },
  },
  mounted() {},
  created() {},
  data: () => ({
    validTimeForm: false,
  }),
  computed: {},
  watch: {},
  methods: {
    update(event) {
      this.$emit("update:timeData", { ...this.timeData, ...event })
    },
    submitTime() {},
  },
}
</script>
<style scoped>
.time-field {
  font-size: 2em;
}
</style>
