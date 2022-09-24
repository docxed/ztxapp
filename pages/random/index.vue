<template>
  <v-container class="mt-10">
    <v-row class="mb-3">
      <v-col>
        <v-row class="mb-3">
          <v-col>
            <h2>🫵 สุ่มผู้เล่น</h2>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Player Board -->
    <v-row>
      <v-col cols="12" sm="6" md="4" class="mx-auto">
        <random-board :usersData="usersData" :total="total" :stages="stages" :emojis="emojis" />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center">
        <v-btn
          color="purple white--text"
          @click="randomNumber()"
          :loading="stages === 'random'"
          :disabled="this.usersData.length === 0"
        >
          สุ่ม!</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "สุ่มผู้เล่น",
      meta: [
        {
          hid: "ZTX App - สุ่มผู้เล่น",
          name: "ZTX App - สุ่มผู้เล่น",
          content: "ZTX App | สุ่มผู้เล่น",
        },
      ],
    }
  },
  async mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
    this.fetchPlayers()
  },
  created() {},
  data: () => ({
    isMobile: false,
    usersData: [],
    total: 0,
    stages: "init",
    emojis: [
      "😂",
      "😝",
      "😁",
      "😱",
      "👉",
      "🙌",
      "🍻",
      "🔥",
      "🌈",
      "🎈",
      "🌹",
      "💄",
      "🎀",
      "⚽",
      "🎾",
      "🏁",
      "😡",
      "👿",
      "🐻",
      "🐶",
      "🐬",
      "🐟",
      "🍀",
      "👀",
      "🚗",
      "🍎",
      "💝",
      "💙",
      "👌",
      "😍",
      "😉",
      "😓",
      "😳",
      "💪",
      "💩",
      "🍸",
      "🔑",
      "💖",
      "🌟",
      "🎉",
      "🌺",
      "🎶",
      "👠",
      "🏈",
      "⚾",
      "🏆",
      "👽",
      "💀",
      "🐵",
      "🐮",
      "🐩",
      "🐎",
      "💣",
      "👃",
      "👂",
      "🍓",
      "💘",
      "💜",
      "👊",
      "💋",
      "😘",
      "😜",
      "😵",
      "🙏",
      "👋",
      "🚽",
      "💃",
      "💎",
      "🚀",
      "🌙",
      "🎁",
      "⛄",
      "🌊",
      "⛵",
      "🏀",
      "🎱",
      "💰",
      "👶",
      "👸",
      "🐰",
      "🐷",
      "🐍",
      "🐫",
      "🔫",
      "👄",
      "🚲",
      "🍉",
      "💛",
      "💚",
    ],
  }),
  computed: {
    ...mapGetters("ztxuser", ["getUsers"]),
  },
  watch: {},
  methods: {
    notify() {
      let message = ""
      let stickerPackageId = "6136"
      let stickerId = "10551381"

      message = `🎉 ${this.usersData[this.total].label} คือผู้เล่นแรก 🎉`

      this.$axios.post("/notify", {
        message,
        stickerPackageId,
        stickerId,
      })
    },
    randomNumber() {
      this.stages = "random"
      let animation = setInterval(() => {
        this.total = Math.floor(Math.random() * this.emojis.length)
      }, 100)
      setTimeout(() => {
        clearInterval(animation)
        this.total = Math.floor(Math.random() * this.usersData.length)
        this.stages = "result"
        this.notify()
      }, 5000)
    },
    async fetchPlayers() {
      await this.$store.dispatch("ztxuser/getUsers")
      this.usersData = [...this.getUsers]
        .filter((user) => user.role === "user")
        .map((user) => {
          return { ...user, label: user.name }
        })
      this.total = Math.floor(Math.random() * this.usersData.length)
    },
  },
}
</script>
