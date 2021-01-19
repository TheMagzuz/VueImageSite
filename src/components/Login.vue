<template>
  <div class="login-container">
    <b>Please login to access the site</b><br />
    <div class="login-form">
      <label for="username">Username: </label>
      <input type="text" name="username" v-model="username" /><br />
      <label for="password">Password: </label>
      <input type="password" name="password" v-model="password" /><br />
      <button @click="login">Login</button>
    </div>
    <p>
      {{ status }}
      <transition name="fade">
        <p class="login-error-message" v-show="loginFailed">
          {{ loginFailedReason }}
        </p>
      </transition>
    </p>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import { VueCookieNext } from "vue-cookie-next";

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
      loginFailed: false,
      loginFailedReason: "",
      status: "Please login",
    };
  },
  methods: {
    async login() {
      try {
        this.status = "Logging in...";
        let response = await axios.post(
          process.env.VUE_APP_CDN_IP + "/user/login",
          {
            username: this.username,
            password: this.password,
          },
          { withCredentials: true }
        );
        VueCookieNext.setCookie("jwt", response.data);
        this.$router.push({ path: "/" });
      } catch (err) {
        this.loginFailed = true;
        if (err.response.status == 401) {
          this.loginFailedReason = "Invalid username/password";
        } else {
          this.loginFailedReason =
            "Something weird happened during login. Logging to console";
          console.error(err);
        }
        setTimeout(() => (this.loginFailed = false), 5000);
      }
      this.status = "Please login";
    },
  },
});
</script>

<style scoped>
.login-container {
  text-align: left;
  margin: 10px;
}
.login-form {
  line-height: 2;
}

.login-error-message {
  color: red;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>
