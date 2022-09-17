<template>
  <v-container class="mt-10">
    <v-row class="mb-3">
      <v-col>
        <v-row class="mb-3">
          <v-col>
            <h2>⏰ จับเวลาเล่นเกม</h2>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "จับเวลาเล่นเกม",
      meta: [
        {
          hid: "ZTX App - จับเวลาเล่นเกม",
          name: "ZTX App - จับเวลาเล่นเกม",
          content: "ZTX App | จับเวลาเล่นเกม",
        },
      ],
    }
  },
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
  },
  created() {},
  data: () => ({
    isMobile: false,
  }),
  computed: {},
  watch: {},
  methods: {},
}
</script>
