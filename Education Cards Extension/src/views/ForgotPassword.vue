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
          Forgot Password
        </div>
        <form @submit.prevent="submitForm" style="padding: 15px">
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
            <div
              class="col-12 col-offset-4"
              style="display: flex; justify-content: center"
            >
              <button type="submit" class="btn btn-dark">
                <faicon icon="sign-in-alt" /> Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomString } from "@/services/functions.services.js";
import { fetchF } from "@/services/functions.services.js";
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    submitForm() {
      var _this = this;
      fetchF("forgotLicense/" + this.email, {}, "GET", false, true).then(() => {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "successfully sent email",
              type: "success",
            },
          ],
        });
      });
    },
  },
};
</script>
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
  padding: 20px 20px;
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
.modal .close {
  border: none;
  background: none;
}
.modal {
  background: rgba(0, 0, 0, 0.379);
}
.modal.show {
  display: block;
}
</style>
