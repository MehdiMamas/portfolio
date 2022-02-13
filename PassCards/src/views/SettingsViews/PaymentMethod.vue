<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">Update Payment Method</div>
      <div class="panel-body table-responsive">
        <CardInfoForm
          btnText="Update"
          :onTokenSubmitted="onTokenSubmitted"
          :subscribeSubmit="subscribeSubmit"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { UserDataClass } from "@/services/userData.services";
import CardInfoForm from "@/components/CardInfoForm.vue";
import { fetchF } from "@/services/functions.services.js";
import { getRandomString } from "@/services/functions.services";

export default {
  name: "ProfileSettings",
  components: { CardInfoForm },
  data() {
    return {
      tokenStripe: {},
    };
  },
  methods: {
    onTokenSubmitted(tokenObj) {
      console.log(tokenObj);
      this.tokenStripe = tokenObj;
    },
    subscribeSubmit(subscribeSubmitCallback) {
      var _this = this;
      (async (tokenObj) => {
        var rsp = { isSuccess: false };
        if ((tokenObj?.token?.id || "") != "") {
          rsp = await fetchF(
            "updatePaymentMethod",
            {
              token: tokenObj?.token?.id || "",
            },
            "POST",
            true,
            true
          );
          subscribeSubmitCallback();
        }
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
      })(this.tokenStripe);
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
  font-size: 15px;
  font-weight: 400;
}
.panel-default {
  border-color: #d3e0e9;
  > .panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #d3e0e9;
  }
}
.panel-body {
  font-weight: 300;
  padding: 15px;
}
.btn-default {
  color: #636b6f;
  background-color: #fff;
  border-color: #ccc;
  &:hover {
    color: #636b6f;
    text-decoration: none;
  }
}
.btn-primary-outline {
  color: #418bdb;
  background-color: transparent;
  border-color: #418bdb;
  &:hover {
    color: #fff;
    background-color: #418bdb;
    box-shadow: none;
  }
}
</style>
