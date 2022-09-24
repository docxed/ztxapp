<template>
  <v-container class="mt-10">
    <v-row class="mb-3">
      <v-col>
        <v-row class="mb-3">
          <v-col>
            <h2>😇/👿 บันทึกความดี/ความชั่ว</h2>
          </v-col>
        </v-row>
        <v-btn depressed color="primary" @click="openDialogCreate()"
          ><v-icon left> mdi-plus </v-icon>บันทึกความดี/ความชั่ว</v-btn
        >
        <v-btn :small="isMobile" icon @click="fetchNotes()" class="ml-2">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-container fluid class="d-flex">
      <v-card width="100vw">
        <!-- Coupon Table -->
        <note-table
          :noteData="allNoteData"
          :noteIsLoading="noteIsLoading"
          :me="getUser"
          :users="getUsers"
          @updateItem="updateItem($event)"
          @deleteItem="openConfirmDialog($event)"
        />
      </v-card>
    </v-container>

    <!-- Create Note Form -->
    <dialog-form formTitle="เพิ่มบันทึกความดี/ความชั่ว" v-model="dialogCreate">
      <note-form
        ref="createForm"
        :noteData.sync="noteData"
        :errCreateNoteMessage="errCreateNoteMessage"
        :createNoteIsLoading="createNoteIsLoading"
        :me="getUser"
        :users="getUsers"
        @submitNote="createNote()"
      />
    </dialog-form>

    <!-- Update Note Form -->
    <dialog-form formTitle="แก้ไขบันทึกความดี/ความชั่ว" v-model="dialogUpdate">
      <note-form
        ref="updateForm"
        :me="getUser"
        :users="getUsers"
        :noteData.sync="noteUpdate"
        :errCreateNoteMessage="errCreateNoteMessage"
        :createNoteIsLoading="createNoteIsLoading"
        @submitNote="updateNote()"
        isUpdating
      />
    </dialog-form>

    <!-- Note Confirm Dialog -->
    <dialog-confirm
      v-model="dialogConfirm"
      :title="confirmTitle"
      :name="confirmName"
      :color="confirmColor"
      @close="closeConfirm()"
      @submit="submitConfirm(toStatus, confirmId)"
    />
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {
  middleware: ["isAuth"],
  head() {
    return {
      title: "บันทึกความดี",
      meta: [
        {
          hid: "ZTX App - บันทึกความดี",
          name: "ZTX App - บันทึกความดี",
          content: "ZTX App | บันทึกความดี",
        },
      ],
    }
  },
  async mounted() {
    this.isMobile = this.$vuetify.breakpoint.xsOnly ? true : false
    await this.$store.dispatch("ztxuser/getUsers")
    this.fetchNotes()
  },
  created() {},
  data: () => ({
    dialogConfirm: false,
    confirmTitle: "",
    confirmName: "",
    confirmColor: "",
    toStatus: "",
    confirmId: "",
    isMobile: false,
    dialogCreate: false,
    noteData: {},
    noteDataDefault: {
      content: "",
      type: "good",
      whoBad: "",
      point: 0,
      status: false,
      by: "",
    },
    errCreateNoteMessage: "",
    noteIsLoading: false,
    createNoteIsLoading: false,
    allNoteData: [],
    dialogUpdate: false,
    noteUpdate: {},
  }),
  computed: {
    ...mapGetters("users", ["getUser", "getToken"]),
    ...mapGetters("ztxuser", ["getUsers"]),
  },
  watch: {
    dialogCreate(val) {
      val || this.closeCreate()
    },
  },
  methods: {
    async fetchNotes() {
      this.noteIsLoading = true
      const response = await this.$axios.get("/notes")
      this.allNoteData = []
      this.allNoteData = response.data.notes
      this.noteIsLoading = false
    },
    async createNote() {
      this.createNoteIsLoading = true
      const { content, isImg, type, whoBad, status, point } = this.noteData
      const { id: by } = this.getUser
      await this.$axios
        .post("/createnote", { content, isImg, type, whoBad, status, point, by })
        .then(() => {
          const payloadData = {
            message: `✏️ ${this.getUser.name} ${
              type === "good" ? "บันทึกความดี" : "รายงานความชั่ว" + this.findUser(whoBad)
            } ว่า ${content}`,
            stickerPackageId: "",
            stickerId: "",
          }
          this.notify(payloadData)
          if (status) {
            const payloadData = {
              message: `✔️ ${this.getUser.name} ได้ทำการตวจสอบ ${content} ของ ${this.findUser(
                by
              )} แล้ว`,
              stickerPackageId: "",
              stickerId: "",
            }
            this.notify(payloadData)
          }
          this.closeCreate()
          this.fetchNotes()
        })
        .catch((error) => {
          console.error(error)
          this.errCreateNoteMessage = error.message
        })
        .finally(() => {
          this.createNoteIsLoading = false
        })
    },
    openDialogCreate() {
      this.noteData = { ...this.noteDataDefault }
      this.dialogCreate = true
    },
    closeCreate() {
      this.$refs.createForm.resetValidation()
      this.errCreateNoteMessage = ""
      this.dialogCreate = false
    },
    async updateNote() {
      this.createNoteIsLoading = true
      const { _id, content, isImg, type, whoBad, status, point, by } = this.noteUpdate
      await this.$axios
        .put(`/notes/${_id}`, { content, isImg, type, whoBad, status, point })
        .then(() => {
          if (status) {
            const payloadData = {
              message: `✔️ ${this.getUser.name} ได้ทำการตวจสอบ ${content} ของ ${this.findUser(
                by
              )} แล้ว`,
              stickerPackageId: "",
              stickerId: "",
            }
            this.notify(payloadData)
          }
          this.fetchNotes()
          this.resetUpdateNoteForm()
        })
        .catch((error) => {
          console.error(error)
          this.errCreateNoteMessage = error.message
        })
        .finally(() => {
          this.createNoteIsLoading = false
        })
    },
    updateItem(item) {
      this.noteUpdate = Object.assign({}, item)
      this.dialogUpdate = true
    },
    resetUpdateNoteForm() {
      this.$refs.updateForm.resetValidation(true)
      this.noteUpdate = { ...this.noteDataDefault }
      this.errCreateNoteMessage = ""
      this.dialogUpdate = false
    },
    async deleteNote(id) {
      await this.$axios
        .delete(`/notes/${id}`)
        .then(() => {
          this.fetchNotes()
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {})
    },
    async notify(payloadData) {
      const { message, stickerPackageId, stickerId } = payloadData

      await this.$axios.post("/notify", {
        message,
        stickerPackageId,
        stickerId,
      })
    },
    findUser(id) {
      const userFound = this.getUsers.find((u) => u._id === id) || { name: "-" }
      return userFound.name
    },
    // Confirm Dialog
    openConfirmDialog(value) {
      if (value.confirmType === "delete") {
        this.confirmTitle = `ต้องการลบรายการ บันทึก`
        this.confirmName = `${value.content}`
        this.confirmColor = "red"
      }
      this.toStatus = value.confirmType
      this.confirmId = value._id
      this.dialogConfirm = true
    },
    async submitConfirm(status, confirmId) {
      if (status === "delete") {
        await this.deleteNote(confirmId)
        this.closeConfirm()
      }
    },
    closeConfirm() {
      this.dialogConfirm = false
    },
  },
}
</script>
