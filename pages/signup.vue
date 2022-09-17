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
            <v-card-title>ลงทะเบียนเข้าใช้งาน</v-card-title>
            <v-card-text>
              <v-form
                @submit.prevent="submitSignup()"
                ref="signupForm"
                v-model="validSignup"
                lazy-validation
              >
                <v-text-field
                  color="purple"
                  :value="signupData.email"
                  @change="update({ email: $event })"
                  :rules="[$rules.required, ...$rules.emailRules]"
                  hint="กรุณากรอกอีเมล"
                  label="อีเมล"
                />
                <v-text-field
                  color="purple"
                  :value="signupData.name"
                  @change="update({ name: $event })"
                  :rules="[$rules.required]"
                  hint="กรุณากรอกชื่อ"
                  label="ชื่อ"
                />
                <v-text-field
                  color="purple"
                  :value="signupData.password"
                  @change="update({ password: $event })"
                  :rules="[$rules.required]"
                  hint="กรุณากรอกรหัสผ่าน"
                  type="password"
                  label="รหัสผ่าน"
                />
                <v-card-actions>
                  <p v-if="errSignupMessage" class="caption red--text mt-2">
                    {{ errSignupMessage }}
                  </p>
                  <v-spacer />
                  <v-btn
                    type="submit"
                    :disabled="!validSignup"
                    color="purple white--text"
                    :loading="signupIsLoading"
                  >
                    <span class="button">ลงทะเบียนเข้าใช้งาน</span>
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
export default {
  middleware: ["isGuest"],
  layout: "full-screen",
  head() {
    return {
      title: "ลงทะเบียนเข้าใช้งาน",
      meta: [
        {
          hid: "ZTX App - ลงทะเบียนเข้าใช้งาน",
          name: "ZTX App - ลงทะเบียนเข้าใช้งาน",
          content: "ZTX App | ลงทะเบียนเข้าใช้งาน",
        },
      ],
    }
  },
  data: () => ({
    validSignup: false,
    errSignupMessage: "",
    signupIsLoading: false,
    signupData: {
      email: "",
      password: "",
      name: "",
    },
    signupIsLoading: false,
  }),
  methods: {
    update(event) {
      this.signupData = {
        ...this.signupData,
        ...event,
      }
    },
    async signup() {
      this.signupIsLoading = true
      this.$axios
        .post("/signup", {
          ...this.signupData,
        })
        .then((response) => {
          this.signupIsLoading = false
          this.$router.push("/signin")
        })
        .catch((error) => {
          this.errSignupMessage = error.response.data.message
        })
        .finally(() => {
          this.signupIsLoading = false
        })
    },
    submitSignup() {
      if (this.$refs.signupForm.validate()) {
        this.signup()
      }
    },
  },
}
</script>
