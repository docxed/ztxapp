<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <div v-for="(item, i) in items" :key="i">
          <v-list-item :to="item.to" router exact v-if="item.role.includes(getUser.role)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
      <v-btn
        absolute
        right
        bottom
        @click.stop="miniVariant = !miniVariant"
        class="mb-4 purple"
        dark
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed color="purple" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!-- Me -->
      <div v-if="getUser" class="mr-3">
        <v-menu offset-y rounded="rounded">
          <template v-slot:activator="{ on, attrs }">
            <v-chip class="ma-2" pill v-bind="attrs" v-on="on" color="white black--text">
              {{ `😝 ${getUser.name || "ไม่ได้ตั้งชื่อ"}` }} <v-icon>mdi-menu-down</v-icon>
            </v-chip>
          </template>
          <v-list>
            <v-list-item @click="$router.push('/signout')">
              <v-list-item-title>ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main>
      <Nuxt />
      <message-snackbar
        v-for="(data, index) in getMessage"
        :key="`message-${data.title}`"
        :data="data"
        :index="index"
      />
      <layouts-loader />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  async mounted() {
    this.helloServer()
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-view-dashboard",
          title: "แดชบอร์ด",
          to: "/",
          role: ["user", "admin"],
        },
        {
          icon: "mdi-clock",
          title: "จับเวลาเล่นเกม",
          to: "/playtimeout",
          role: ["user", "admin"],
        },
        {
          icon: "mdi-note",
          title: "บันทึกความดี",
          to: "/note",
          role: ["user", "admin"],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "🚀 ZTX App",
    }
  },
  computed: {
    ...mapGetters("users", ["getUser", "getToken"]),
    ...mapGetters("messages", ["getMessage"]),
  },
  methods: {
    async helloServer() {
      this.$loader(true)
      this.$axios
        .get("/hello")
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.$loader(false)
        })
    },
  },
}
</script>
