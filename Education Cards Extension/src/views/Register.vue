<template>
  <div class="main">
    <div class="topPart row">
      <div
        class="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12"
        style="
          box-shadow: rgb(0 0 0 / 33%) 0px 0px 30px 0px;
          border-radius: 15px;
          border: 1px solid rgb(211, 224, 233);
        "
      >
        <div
          style="
            border-bottom: 1px solid rgb(211, 224, 233);
            text-align: left;
            display: flex;
            padding: 10px;
          "
        >
          Register
        </div>
        <form @submit.prevent="registerBtn" style="padding: 15px">
          <div
            class="form-group"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <label class="col-4 control-label" style="padding-right: 10px"
              >E-Mail Address</label
            >
            <div
              class="col-6"
              style="margin: 0; padding-left: 10px; display: inline-block"
            >
              <input
                type="email"
                name="email"
                class="form-control"
                required
                v-model="email"
              />
            </div>
          </div>
          <div
            class="form-group"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <label class="col-4 control-label" style="padding-right: 10px"
              >Password</label
            >
            <div
              class="col-6"
              style="margin: 0; padding-left: 10px; display: inline-block"
            >
              <input
                type="password"
                name="password"
                class="form-control"
                required
                v-model="password"
              />
            </div>
          </div>
          <div
            class="form-group"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <label class="col-4 control-label" style="padding-right: 10px"
              >Profile picture</label
            >
            <div
              class="col-6"
              style="margin: 0; padding-left: 10px; display: inline-block"
            >
              <input
                type="file"
                class="form-control"
                accept="image/*"
                @input="encodeImageFileAsURL"
              />
            </div>
          </div>

          <div
            class="form-group"
            style="
              visibility: hidden;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <div class="col-4" style="display: flex"></div>
            <div class="col-6 col-offset-4" style="display: flex">
              <div class="checkbox">
                <label>
                  <input type="checkbox" name="remember" data-np-checked="1" />
                  Remember Me
                </label>
              </div>
            </div>
          </div>
          <div
            class="form-group"
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 15px;
            "
          >
            <div class="col-2" style="display: flex"></div>
            <div class="col-10 col-offset-4" style="display: flex">
              <button type="submit" class="btn btn-dark">
                <faicon icon="sign-in-alt" /> Register
              </button>
              <div style="display: flex; align-items: center; margin-left: 10px">
                Already have an account?
                <router-link :to="{ name: 'Login' }">Sign in here</router-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { UserDataClass } from "@/services/userData.services";
import { fetchF } from "@/services/functions.services.js";
import { setLocalStorage, getRandomString } from "@/services/functions.services";
export default {
  name: "Register",
  methods: {
    encodeImageFileAsURL: function (e) {
      var _this = this;
      var element = e.target;
      var file = element.files[0];
      if (file.size > 3000000) {
        e.preventDefault();
        e.target.value = "";
        return alert("file is above 3 megabytes");
      }
      var reader = new FileReader();
      reader.onloadend = function () {
        _this.photo = reader.result;
      };
      reader.readAsDataURL(file);
    },
    registerBtn: async function () {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const passwordRegex = /[^-\s]{8,}/g;

      if ((String(this.email).toLowerCase().match(emailRegex) || []).length == 0) {
        this.$store.dispatch("changeData", {
          option: "alertEl",
          value: "Please use a valid email address",
        });
        return;
      }
      if ((this.password.match(passwordRegex) || []).length == 0) {
        this.$store.dispatch("changeData", {
          option: "alertEl",
          value: "Please enter at least 8 characters password without hyphen and spaces",
        });
        return;
      }
      var rsp = await fetchF(
        "createUser",
        {
          email: this.email,
          password: this.password,
          userImg: this.photo,
        },
        "POST",
        false,
        true
      );
      if (rsp.isSuccess == true) {
        setLocalStorage("access_token", rsp.access_token);
        setLocalStorage("refresh_token", rsp.refresh_token);
        this.$store
          .dispatch("changeData", {
            option: "isInitiated",
            value: false,
          })
          .then(() => {
            this.$store.dispatch("changeData", {
              option: "alertEl",
              value: "Account created successfully",
            });
          });
      } else {
        this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ...this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: rsp.err,
              type: "error",
            },
          ],
        });
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
      photo: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/bootstrap.min.css";
.main {
  z-index: 0;
  margin: 0 20px;
  height: calc(100vh - 100px);
  background-color: #fff;
}
.topPart > form {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}
.topPart > form > input {
  margin-bottom: 10px;
}
.topPart {
  transition: all 500ms ease !important;
  text-align: center;
  align-self: center;
  background-color: white;
  height: 100%;
  width: 100%;
  flex: 0 2 auto;
  min-height: 0px;
  outline: none;
  border: 0;
  border-bottom: 5px solid rgba(0, 0, 0, 0.1);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media (max-width: 800px) {
  .main {
    z-index: 2 !important;
  }
}
</style>
