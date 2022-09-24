<template>
  <v-container>
    <v-form @submit.prevent="submitCreate()" ref="noteDataForm" v-model="validNote" lazy-validation>
      <v-textarea
        color="purple"
        :value="noteData.content"
        @change="update({ content: $event })"
        :rules="[$rules.required]"
        label="รายละเอียด"
        hint="กรุณาใส่รายละเอียด"
        prepend-icon="mdi-note"
        dense
        outlined
        clearable
        :disabled="disableFields.includes('content')"
      ></v-textarea>
      <v-select
        color="purple"
        item-color="purple"
        :value="noteData.type"
        @change="update({ type: $event })"
        :rules="[$rules.selected]"
        :items="typeItems"
        item-text="title"
        item-value="value"
        label="ประเภท"
        prepend-icon="mdi-filter"
        hide-details
        dense
        outlined
        :disabled="disableFields.includes('type')"
        class="mb-5"
      />
      <v-select
        color="purple"
        item-color="purple"
        :value="noteData.whoBad"
        @change="update({ whoBad: $event })"
        :rules="[$rules.selected]"
        :items="whoBadItems"
        item-text="title"
        item-value="value"
        label="ผู้กระทำความชั่ว"
        prepend-icon="mdi-account-alert"
        hide-details
        dense
        outlined
        :disabled="disableFields.includes('type')"
        class="mb-5"
        v-if="noteData.type === 'bad'"
      />
      <v-checkbox
        color="purple"
        :input-value="noteData.isImg"
        @change="update({ isImg: $event })"
        :rules="[(v) => !!v || 'กรุณาติกถูกในช่องนี้']"
        label="ฉันได้ส่งรูปหลักฐานเข้ากลุ่มไลน์แล้ว"
        dense
        class="ml-5"
        :disabled="disableFields.includes('isImg')"
      ></v-checkbox>

      <!-- Rating -->
      <div v-if="me && me.role === 'admin'">
        <v-select
          color="purple"
          item-color="purple"
          :value="noteData.status"
          @change="update({ status: $event })"
          :rules="[$rules.selected]"
          :items="statusItems"
          item-text="title"
          item-value="value"
          label="สถานะ"
          prepend-icon="mdi-list-status"
          hide-details
          dense
          outlined
          :disabled="disableFields.includes('status')"
          class="mb-5"
        />
        <v-text-field
          color="purple"
          :value="noteData.point"
          @change="update({ point: $event })"
          :rules="[$rules.required]"
          type="number"
          label="จำนวนแต้ม"
          suffix="แต้ม"
          hint="กรุณาใส่จำนวนแต้ม"
          prepend-icon="mdi-hand-coin"
          dense
          outlined
        />
      </div>

      <!-- Action -->
      <v-card-actions>
        <p v-if="errCreateNoteMessage" class="caption red--text mt-2">{{ errCreateNoteMessage }}</p>
        <v-spacer />
        <v-btn
          type="submit"
          :disabled="!validNote"
          color="purple"
          :loading="createNoteIsLoading"
          depressed
          dark
        >
          <v-icon left size="24">{{ isUpdating ? "mdi-pencil" : "mdi-plus-thick" }}</v-icon>
          <span class="button">{{ isUpdating ? "แก้ไข" : "เพิ่ม" }}</span>
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>
<script>
export default {
  props: {
    noteData: {
      type: Object,
      required: true,
    },
    createNoteIsLoading: {
      type: Boolean,
      default: false,
    },
    errCreateNoteMessage: {
      type: String,
      default: "",
    },
    disableFields: {
      type: Array,
      default: () => [],
    },
    isUpdating: {
      type: Boolean,
      default: false,
    },
    me: {
      type: Object,
      default: () => {},
    },
    users: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.whoBadItems = this.users
      .filter((user) => user.role !== "admin")
      .map((user) => ({
        title: user.name,
        value: user._id,
      }))
  },
  data: () => ({
    validNote: false,
    typeItems: [
      {
        title: "ความดี",
        value: "good",
      },
      {
        title: "ความชั่ว",
        value: "bad",
      },
    ],
    statusItems: [
      {
        title: "ตรวจสอบแล้ว",
        value: true,
      },
      {
        title: "รอตรวจสอบ",
        value: false,
      },
    ],
    whoBadItems: [],
  }),
  methods: {
    update(event) {
      const { point, type } = event
      if (point) {
        event.point = parseInt(point)
      } else if (type) {
        if (type === "good") event.whoBad = ""
      }
      this.$emit("update:noteData", { ...this.noteData, ...event })
    },
    submitCreate() {
      if (this.$refs.noteDataForm.validate()) {
        this.$emit("submitNote")
      }
    },
    resetValidation() {
      this.$refs.noteDataForm.resetValidation()
    },
    reset() {
      this.$refs.noteDataForm.reset()
    },
  },
}
</script>
