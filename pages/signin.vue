<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" sm="5">
        <div class="my-auto mx-3 text-center">
          <p class="display-2 font-weight-black">🚀 ZTX App</p>
        </div>
      </v-col>
      <v-col cols="12" sm="7">
        <div>
          <v-card class="my-10">
            <v-card-title>ลงชื่อเข้าใช้งาน</v-card-title>
            <v-card-text>
              <v-form
                @submit.prevent="submitSignin()"
                ref="signinForm"
                v-model="validSignin"
                lazy-validation
              >
                <v-text-field
                  color="purple"
                  :value="signinData.email"
                  @change="update({ email: $event })"
                  :rules="[$rules.required, ...$rules.emailRules]"
                  label="อีเมล"
                />
                <v-text-field
                  color="purple"
                  :value="signinData.password"
                  @change="update({ password: $event })"
                  type="password"
                  :rules="[$rules.required]"
                  label="รหัสผ่าน"
                />
                <v-card-actions>
                  <p v-if="errSigninMessage" class="caption red--text mt-2">
                    {{ errSigninMessage }}
                  </p>
                  <v-spacer />
                  <v-btn
                    type="submit"
                    :disabled="!validSignin"
                    color="purple white--text"
                    :loading="signinIsLoading"
                  >
                    <span class="button">เข้าสู่ระบบ</span>
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex"
export default {
  middleware: ["isGuest"],
  layout: "full-screen",
  head() {
    return {
      title: "ลงชื่อเข้าใช้งาน",
      meta: [
        {
          hid: "ZTX App - ลงชื่อเข้าใช้งาน",
          name: "ZTX App - ลงชื่อเข้าใช้งาน",
          content: "ZTX App | ลงชื่อเข้าใช้งาน",
        },
      ],
    }
  },
  data: () => ({
    validSignin: false,
    errSigninMessage: "",
    signinIsLoading: false,
    signinData: {
      email: "",
      password: "",
    },
  }),
  methods: {
    update(event) {
      this.signinData = {
        ...this.signinData,
        ...event,
      }
    },
    async signin() {
      this.signinIsLoading = true
      this.$store
        .dispatch("users/login", this.signinData)
        .then(() => {
          this.signinIsLoading = false
          this.$router.push("/")
        })
        .catch((error) => {
          console.error(error)
          this.errSigninMessage = error.response.data.message
        })
        .finally(() => {
          this.signinIsLoading = false
        })
    },
    submitSignin() {
      if (this.$refs.signinForm.validate()) {
        this.signin()
      }
    },
  },
}
</script>
