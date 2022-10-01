<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-container class="mt-10">
      <v-row class="mb-3">
        <v-col>
          <v-row class="mb-3">
            <v-col>
              <h2>Dashboard</h2>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mb-5 mx-2">
        <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              color="purple"
              v-model="date"
              label="ประจำเดือน"
              prepend-icon="mdi-calendar"
              hint="กรุณาเลือกเดือน"
              readonly
              v-bind="attrs"
              dense
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" type="month" scrollable color="purple" locale="th">
            <v-spacer></v-spacer>
            <v-btn text color="purple" @click="modal = false"> ยกเลิก </v-btn>
            <v-btn text color="purple" @click="$refs.dialog.save(date)"> ตกลง </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-row>

      <v-row class="text-center mb-5">
        <v-col cols="4" class="my-auto">
          <div style="font-size: 1em">แต้มบุญ 😇</div>
          <div style="font-size: 2em">{{ goodPoints }}</div>
        </v-col>
        <v-col cols="4" class="my-auto"
          ><div class="grey--text text--darken-2" :style="`font-size: ${isMobile ? 1.3 : 2}em`">
            แต้มที่ทำได้
          </div>
          <div style="font-size: 3em">{{ allPoints }}</div>
        </v-col>
        <v-col cols="4" class="my-auto">
          <div style="font-size: 1em">แต้มบาป 👿</div>
          <div style="font-size: 2em">{{ badPoints }}</div>
        </v-col>
      </v-row>

      <!-- User Select -->
      <dashboard-user-select
        ref="userSelect"
        :userData.sync="userData"
        :userItems="usersItems"
        @goData="goData($event)"
      />

      <v-row class="ml-5">
        <v-container class="px-0" fluid>
          <v-switch v-model="isDisplayGood" label="แสดงความดี"></v-switch>
        </v-container>
      </v-row>
      <v-container fluid class="d-flex">
        <v-card width="100vw">
          <!-- Coupon Table -->
          <dashboard-table :dashData="allDashData" :me="getUser" :users="getUsers" />
        </v-card>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "แดชบอร์ด",
      meta: [
        {
          hid: "ZTX App - แดชบอร์ด",
          name: "ZTX App - แดชบอร์ด",
          content: "ZTX App | แดชบอร์ด",
        },
      ],
    }
  },
  mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
  },
  async created() {
    this.overlay = true
    await this.$store.dispatch("ztxuser/getUsers")
    await this.fetchNotes()
    this.usersItems = this.getUsers.filter((user) => user.role === "user")
    if (this.usersItems.length > 0) {
      this.userData = { ...this.userDataDefault, _id: this.usersItems[0]._id }
      this.goData(this.userData)
    } else {
      this.userData = { ...this.userDataDefault }
    }
    this.overlay = false
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,
    usersItems: [],
    allDashData: [],
    isMobile: false,
    overlay: false,
    allNoteData: [],
    noteIsLoading: false,
    userData: {},
    userDataDefault: {
      _id: "",
    },
    allPoints: 0,
    goodPoints: 0,
    badPoints: 0,
    isDisplayGood: true,
  }),
  computed: {
    ...mapGetters("users", ["getUser", "getToken"]),
    ...mapGetters("ztxuser", ["getUsers"]),
  },
  watch: {
    isDisplayGood(val) {
      this.goData()
    },
    date(newVal, oldVal) {
      if (newVal !== oldVal) this.goData()
    },
  },
  methods: {
    goData(user) {
      const { _id: id } = user || this.userData
      if (!id) return
      const notesData = this.allNoteData.filter(
        (note) =>
          note.status &&
          (note.by === id || note.whoBad === id) &&
          new Date(note.createdAt).toISOString().substr(0, 7) === this.date
      )

      this.allPoints = 0
      this.goodPoints = 0
      this.badPoints = 0

      this.allDashData = []
      notesData.forEach((note) => {
        if (note.type === "good" && note.by === id) {
          this.goodPoints += note.point
          if (this.isDisplayGood) this.allDashData.push(note)
        } else if (note.type === "bad" && id === note.whoBad) {
          this.badPoints -= note.point
          if (!this.isDisplayGood) this.allDashData.push(note)
        }
      })
      this.allPoints = this.goodPoints - this.badPoints
    },
    async fetchNotes() {
      const response = await this.$axios.get("/notes")
      this.allNoteData = []
      this.allNoteData = response.data.notes
    },
  },
}
</script>
