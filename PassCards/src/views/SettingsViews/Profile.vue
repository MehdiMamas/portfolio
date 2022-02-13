<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">Profile Photo</div>
      <div
        class="panel-body"
        style="display: flex; align-items: center; justify-content: center"
      >
        <!---->
        <form
          role="form"
          class="form-horizontal"
          style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          "
        >
          <img
            :src="`${
              $store.state.userData.userPic?.indexOf('data:') == -1
                ? $store.state.serverLink
                : ''
            }${$store.state.userData.userPic}`"
            alt=""
            class="mb-2"
            style="height: 150px; width: 150px; border-radius: 5px; border: 1px solid"
          />
          <div class="form-group" style="">
            <label type="button" name="photo" class="btn btn-dark btn-upload">
              <span>Select New Photo</span>
              <input
                type="file"
                name="photo"
                class="form-control"
                @input="encodeImageFileAsURL"
                style="display: none"
            /></label>
          </div>
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">Contact Information</div>
      <div class="panel-body">
        <!---->
        <form role="form" class="form-horizontal" @submit.prevent="updateUserDataForm">
          <div class="form-group mb-2">
            <label class="col-md-4 control-label">Full Name</label>
            <div class="col-md-6">
              <input
                type="text"
                name="name"
                class="form-control"
                v-model="$store.state.userData.fullName"
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

    <div class="panel panel-default">
      <div class="panel-heading">Danger Zone</div>
      <div class="panel-body">
        <div class="form-group">
          <div class="col-md-offset-4 col-md-6">
            <button class="btn btn-danger" @click="deleteAccount">Delete Account</button>
          </div>
        </div>
      </div>
      <!---->
    </div>
  </div>
</template>
<script>
import { UserDataClass } from "@/services/userData.services";
import { fetchF } from "@/services/functions.services.js";
import {
  getRandomString,
} from "@/services/functions.services";

export default {
  name: "ProfileSettings",
  data() {
    return {};
  },
  methods: {
    updateUserDataForm() {
      var _this = this;
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "changeUserInfo",
          {
            userData: _this.$store.state.userData,
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
    encodeImageFileAsURL(e) {
      var _this = this;
      var element = e.target;
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = async function () {
        element.value = "";
        _this.$store.state.userData.userPic = reader.result;
        _this.$store.dispatch("changeData", {
          option: "userData",
          value: _this.$store.state.userData,
        });
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "changeUserInfo",
          {
            userData: {
              ..._this.$store.state.userData,
              userPic: reader.result,
            },
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
      };
      reader.readAsDataURL(file);
    },
    deleteAccount() {
      this.$store.dispatch("changeData", {
        option: "confirmationText",
        value:
          "Are you sure you want to delete your account? there is no going back after clicking 'Confirm'",
      });
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
