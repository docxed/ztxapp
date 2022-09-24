<template>
  <v-data-table
    :headers="headers"
    :items="noteData"
    :search="search"
    class="elevation-1"
    child-flex
    :loading="noteIsLoading"
    loading-text="กำลังโหลดข้อมูลบันทึก...โปรดรอสักครู่"
    no-data-text="ไม่พบข้อมูลบันทึก"
    sort-by="createdAt"
    :sort-desc="sortDesc"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-spacer />
        <v-text-field
          color="grey darken-4"
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
        />
      </v-toolbar>
    </template>
    <template v-slot:[`item.type`]="{ item }">
      {{ typeItems[item.type].title }}
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip
        class="ma-2"
        :color="item.point > 0 ? 'green' : 'red'"
        text-color="white"
        v-if="item.status"
        >{{ item.point }} แต้ม</v-chip
      >
      <v-chip class="ma-2" v-else>รอตรวจสอบ</v-chip>
    </template>
    <template v-slot:[`item.createdAt`]="{ item }">
      {{
        $momentFormat({
          date: formatDateToFill(item.createdAt),
          format: "lll",
        })
      }}
    </template>
    <template v-slot:[`item.by`]="{ item }">
      {{ nameUser(item.by) }}
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="$emit('updateItem', item)" v-if="permissionEdit(item)"
        >mdi-pencil</v-icon
      >
      <v-icon
        small
        class="mr-2"
        @click="$emit('deleteItem', { ...item, confirmType: 'delete' })"
        v-if="me && me.role === 'admin'"
        >mdi-delete</v-icon
      >
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: {
    noteData: {
      type: Array,
      required: true,
    },
    noteIsLoading: {
      type: Boolean,
      default: false,
    },
    me: {
      type: Object,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  mounted() {},
  data: () => ({
    search: "",
    sortDesc: true,
    typeItems: {
      bad: {
        title: "ความชั่ว 👿",
      },
      good: {
        title: "ความดี 😇",
      },
    },
  }),
  computed: {
    headers() {
      return [
        { text: "รายละเอียด", value: "content" },
        { text: "ประเภท", value: "type" },
        { text: "สถานะ", value: "status" },
        { text: "วันที่บันทึก", value: "createdAt" },
        { text: "โดย", value: "by" },
        { text: "", value: "actions", sortable: false },
      ]
    },
  },
  methods: {
    permissionEdit(item) {
      let flag = false
      if (this.me) {
        if (this.me.role === "admin") {
          flag = true
        } else if (item.by === this.me.id) {
          if (item.status) {
            flag = false
          } else {
            flag = true
          }
        }
      }
      return flag
    },
    formatDateToFill(date) {
      return date
        ? this.$moment(new Date(date.seconds ? date.seconds * 1000 : date)).toDate()
        : null
    },
    nameUser(user) {
      const userFound = this.users.find((u) => u._id === user)
      return userFound ? userFound.name : ""
    },
  },
}
</script>
