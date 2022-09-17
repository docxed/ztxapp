<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
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
    console.log(this.getUser)
    console.log(this.getToken)
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
        },
        {
          icon: "mdi-clock",
          title: "จับเวลาเล่นเกม",
          to: "/playtimeout",
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
  methods: {},
}
</script>
