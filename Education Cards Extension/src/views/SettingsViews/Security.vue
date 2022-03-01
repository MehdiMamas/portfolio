<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">Update Payment Method</div>
      <div class="panel-body">
        <!---->
        <div class="col-2" style="display: inline-flex; height: 10px"></div>
        <form
          role="form"
          class="col-10 form-horizontal"
          style="display: inline-flex; flex-direction: column"
          @submit.prevent="updateUserDataForm"
        >
          <div class="form-group mb-2" style="display: flex">
            <label
              class="col-4 control-label"
              style="
                display: flex;
                padding-right: 10px;
                align-items: center;
                font-size: 13px;
                justify-content: flex-end;
                justify-content: flex-end;
              "
              >Current Password</label
            >
            <div class="col-8">
              <input
                type="password"
                name="currentPassword"
                class="form-control"
                v-model="currentPassword"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="form-group mb-2" style="display: flex">
            <label
              class="col-4 control-label"
              style="
                display: flex;
                padding-right: 10px;
                align-items: center;
                font-size: 13px;
                justify-content: flex-end;
              "
              >Password</label
            >
            <div class="col-8">
              <input
                type="password"
                name="password"
                class="form-control"
                v-model="password"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="form-group mb-2" style="display: flex">
            <label
              class="col-4 control-label"
              style="
                display: flex;
                padding-right: 10px;
                align-items: center;
                font-size: 13px;
                justify-content: flex-end;
              "
              >Confirm Password</label
            >
            <div class="col-8">
              <input
                type="password"
                name="password"
                class="form-control"
                v-model="confirmPassword"
                autocomplete="off"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="col-md-offset-4 col-md-6">
              <button type="submit" class="btn btn-dark">Update</button>
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
import { getRandomString } from "@/services/functions.services";

export default {
  name: "ProfileSettings",
  data() {
    return {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    updateUserDataForm() {
      var _this = this;
      var currentPassword = _this.currentPassword;
      var confirmPassword = _this.confirmPassword;
      var password = _this.confirmPassword;
      const passwordRegex = /[^-\s]{8,}/g;
      if (
        currentPassword.trim() == "" ||
        confirmPassword.trim() == "" ||
        password.trim() == ""
      ) {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "Please fill the following fields",
              type: "error",
            },
          ],
        });
        return;
      }
      if ((password.match(passwordRegex) || []).length == 0) {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text:
                "Please enter at least 8 characters password without hyphen and spaces",
              type: "error",
            },
          ],
        });
        return;
      }
      if (confirmPassword != password) {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "Please confirm your password",
              type: "error",
            },
          ],
        });
        return;
      }
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "changeUserInfo",
          {
            newPassword: password,
            currentPassword: currentPassword,
          },
          "POST",
          true,
          true
        );
        if (rsp.isSuccess == true) {
          _this.$store.dispatch("changeData", {
            option: "userData",
            value: new UserDataClass(rsp.userData || {}),
          });

          _this.$store
            .dispatch("changeData", {
              option: "userData",
              value: _this.$store.state.userData,
            })
            .then(() => {
              _this.$store.dispatch("changeData", {
                option: "notifications",
                value: [
                  ..._this.$store.state.notifications,
                  {
                    notificationId: getRandomString(),
                    text: "User data updated successfully",
                    type: "success",
                  },
                ],
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
      })();
    },
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  .panel-heading {
    background-color: #35363a !important;
    color: white !important;
  }
  .panel-body {
    background-color: #2b2c2f !important;
    color: white !important;
  }
  input,
  select {
    background: #2b2c2f !important;
    color: white;
  }
  .loader {
    background: #2b2c2f !important;
  }
}

.panel {
  margin-bottom: 22px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px #0000000d;
}
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.panel-default {
  border-color: #d3e0e9;
}
.panel-default > .panel-heading {
  color: #333;
  background-color: #f5f5f5;
  border-color: #d3e0e9;
}
.panel-heading {
  font-size: 15px;
  font-weight: 400;
}
.panel-body {
  font-weight: 300;
}
.panel-body {
  padding: 15px;
}
</style>
