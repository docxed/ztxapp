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

    <!-- Time Progress -->
    <v-row>
      <v-col cols="12" sm="6" md="3" class="mx-auto">
        <v-progress-linear v-model="timeProgressValue" color="purple"></v-progress-linear>
      </v-col>
    </v-row>

    <!-- Time Display -->
    <v-row v-if="['running', 'pause'].includes(stages)">
      <v-col cols="12" sm="6" md="5" lg="4" class="mx-auto">
        <playtimeout-display :timeDisplay="convertMillisecondsToTime(milliseconds)" />
      </v-col>
    </v-row>

    <!-- Time Display Cheat -->
    <v-row v-else-if="['cheat'].includes(stages)">
      <v-col cols="12" sm="6" md="5" lg="4" class="mx-auto">
        <playtimeout-display :timeDisplay="convertMillisecondsToTime(millisecondsCheat)" isCheat />
      </v-col>
    </v-row>

    <!-- Time Form -->
    <v-row v-else>
      <v-col cols="12" sm="6" md="5" lg="4" class="mx-auto">
        <playtimeout-form :timeData.sync="timeData" />
      </v-col>
    </v-row>

    <!-- Time Button -->
    <v-row>
      <v-col class="mx-auto text-center">
        <span v-if="['running', 'pause'].includes(stages)">
          <v-btn color="warning white--text" @click="timePause()" v-if="stages === 'running'"
            >หยุดขั่วคราว</v-btn
          >
          <v-btn color="success white--text" @click="timeResume()" v-else>ดำเนินการต่อ</v-btn
          ><v-btn @click="timeStop()" class="ml-2">ยกเลิก</v-btn>
        </span>
        <span v-else-if="!['cheat'].includes(stages)">
          <v-btn color="purple white--text" @click="timeStart()">เริ่มจับเวลา</v-btn>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
import moment from "moment"
moment.locale("th")
import { setPreciseInterval, clearPreciseInterval } from "precise-interval"
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
    this.timeReset()
  },
  created() {},
  data: () => ({
    isMobile: false,
    milliseconds: 0,
    millisecondsDefault: 3 * 60 * 60 * 1000, // 3 hours
    timeData: {
      h: 0,
      m: 0,
      s: 0,
    },
    stages: "init",
    timeProgressValue: 0,
    millisecondsInit: 0,
    millisecondsCheat: 0,
    timer: null,
    timerCheat: null,
  }),
  computed: {
    ...mapGetters("users", ["getUser", "getToken"]),
  },
  watch: {
    autoRefresh(val) {
      if (val && !this.timerCheat) {
        // it seems to me this additional check would make sense?
        this.timerCheat = setInterval(() => {
          location.reload()
        }, 10 * 1000)
      } else {
        clearPreciseInterval(this.timerCheat)
      }
    },
  },
  methods: {
    notify(value) {
      const { type, time } = value
      const prefix = `${moment().format("LT")} น. |`
      let message = ""
      let stickerPackageId = ""
      let stickerId = ""

      // Set Payload
      if (type === "running") {
        let timeStart = new Date()
        let timeOut = timeStart.setSeconds(timeStart.getSeconds() + time / 1000)
        message = `${prefix} 🤣 ${this.getUser.name} เริ่มจับเวลาเล่นเกม ${moment
          .utc(time)
          .format("H:mm:ss")} ชั่วโมง และจะหมดเวลาเล่นใน ${moment(timeOut).format("LT")} น.`
        stickerPackageId = `1070`
        stickerId = `17844`
      } else if (type === "pause") {
        message = `${prefix} ⏸️ ${this.getUser.name} หยุดจับเวลาขั่วคราว`
        stickerPackageId = ``
        stickerId = ``
      } else if (type === "resume") {
        let timeStart = new Date()
        let timeOut = timeStart.setSeconds(timeStart.getSeconds() + time / 1000)
        message = `${prefix} ⏯️ ${this.getUser.name} จับเวลาต่อ และจะหมดเวลาเล่นใน ${moment(
          timeOut
        ).format("LT")} น.`
        stickerPackageId = ``
        stickerId = ``
      } else if (type === "stop") {
        message = `${prefix} ⏹️ ${this.getUser.name} รีเซ็ตเวลา`
        stickerPackageId = ``
        stickerId = ``
      } else if (type === "timeup") {
        message = `${prefix} 🥲 ${this.getUser.name} หมดเวลาเล่นเกมแล้ว`
        stickerPackageId = `446`
        stickerId = `2008`
      } else if (type === "cheat") {
        message = `${prefix} 🚨 ${this.getUser.name} โกงเวลาเล่น ${time / 60 / 1000} นาที`
        stickerPackageId = `1070`
        stickerId = `17855`
      }

      // Send Request
      this.$axios.post("/notify", {
        message,
        stickerPackageId,
        stickerId,
      })
    },
    convertMillisecondsToTime(milliseconds) {
      return moment.utc(milliseconds).format("HH:mm:ss")
    },
    convertTimeDatatoMilliseconds(timeData) {
      return timeData.h * 60 * 60 * 1000 + timeData.m * 60 * 1000 + timeData.s * 1000
    },
    timeReset() {
      this.milliseconds = this.millisecondsDefault
      this.timeData = {
        h: moment.duration(this.milliseconds).hours(),
        m: moment.duration(this.milliseconds).minutes(),
        s: moment.duration(this.milliseconds).seconds(),
      }
      this.timeProgressValue = 0
      this.stages = "init"
      this.millisecondsInit = 0
      this.millisecondsCheat = 0
      this.timer = null
      this.timerCheat = null
    },
    timeStart() {
      this.milliseconds = this.convertTimeDatatoMilliseconds(this.timeData)
      this.millisecondsInit = this.milliseconds
      this.stages = "running"
      this.timeProgressValue = 0
      this.notify({ type: "running", time: this.milliseconds })
      this.timer = setPreciseInterval(() => {
        this.milliseconds -= 1000
        this.timeProgressValue =
          ((this.millisecondsInit - this.milliseconds) / this.millisecondsInit) * 100
        if (this.milliseconds === 0) {
          this.timeUp()
        }
      }, 1000)
    },
    timePause() {
      this.notify({ type: "pause", time: this.milliseconds })
      clearPreciseInterval(this.timer)
      this.stages = "pause"
    },
    timeStop() {
      this.notify({ type: "stop", time: this.milliseconds })
      clearPreciseInterval(this.timer)
      this.stages = "stop"
      this.timeData = {
        h: moment.duration(this.milliseconds).hours(),
        m: moment.duration(this.milliseconds).minutes(),
        s: moment.duration(this.milliseconds).seconds(),
      }
    },
    timeResume() {
      this.stages = "running"
      this.notify({ type: "resume", time: this.milliseconds })
      this.timer = setPreciseInterval(() => {
        this.milliseconds -= 1000
      }, 1000)
    },
    timeUp() {
      this.notify({ type: "timeup", time: this.milliseconds })
      clearPreciseInterval(this.timer)
      this.stages = "cheat"
      this.timerCheat = setPreciseInterval(() => {
        // notify every 5 minutes
        if (this.millisecondsCheat % (5 * 60 * 1000) === 0 && this.millisecondsCheat !== 0) {
          this.notify({ type: "cheat", time: this.millisecondsCheat })
        }
        this.millisecondsCheat += 1000
      }, 1000)
    },
  },
  beforeRouteLeave(to, from, next) {
    clearPreciseInterval(this.timer)
    clearPreciseInterval(this.timerCheat)
    next()
  },
}
</script>
<style scoped></style>
