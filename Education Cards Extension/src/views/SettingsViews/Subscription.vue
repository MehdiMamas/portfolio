<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">Subscribe</div>
      <div class="panel-body table-responsive">
        <div class="p-b-lg" v-if="$store.state.userData.isSubscribed == false">
          You are not subscribed to a plan. Choose from the plans below to get started.
        </div>
        <div class="p-b-lg" v-if="$store.state.userData.isSubscribed != false">
          You are subscribed to a plan.
        </div>

        <!---->
        <table class="table table-borderless m-b-none">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <span
                  style="
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-content: center;
                    height: 38px;
                  "
                  ><strong>Pro</strong></span
                >
              </td>
              <td>
                <button class="btn btn-default m-l-sm" @click="toggleShowFeatures">
                  <faicon icon="star" style="margin-right: 5px" />
                  Plan Features
                </button>
              </td>
              <td>
                <span
                  style="
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-content: center;
                    height: 38px;
                  "
                >
                  <span>$5.00</span> / Monthly
                </span>
              </td>
              <td><!----></td>
              <td class="text-right">
                <button
                  v-if="
                    $store.state.userData.selected_plan != 'pro' &&
                    $store.state.userData.isSubscribed == false &&
                    $store.state.userData.isCanceled == false
                  "
                  class="btn btn-primary-outline btn-plan"
                  style="width: 150px"
                  @click="togglePlan('pro')"
                >
                  Select
                </button>
                <button
                  v-if="
                    $store.state.userData.selected_plan == 'pro' &&
                    $store.state.userData.isSubscribed == false &&
                    $store.state.userData.isCanceled == false
                  "
                  class="btn btn-primary btn-plan"
                  style="width: 150px"
                  @click="togglePlan('none')"
                >
                  Unselect
                </button>
                <button
                  v-if="
                    ($store.state.userData.selected_plan != 'pro' &&
                      $store.state.userData.isSubscribed == true) ||
                    $store.state.userData.isCanceled == true
                  "
                  class="btn btn-primary btn-plan"
                  style="width: 150px"
                  @click="resubscribe('pro')"
                >
                  Resubscribe
                </button>

                <button
                  v-if="
                    $store.state.userData.selected_plan == 'pro' &&
                    $store.state.userData.isSubscribed == true &&
                    $store.state.userData.isCanceled == false
                  "
                  class="btn btn-danger btn-plan"
                  style="width: 150px"
                  @click="cancelSubscription"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <label
          v-if="
            $store.state.userData.selected_plan != 'none' &&
            $store.state.userData.paymentMethod != false &&
            $store.state.userData.isSubscribed == false
          "
        >
          <span class="col-4" style="visibility: hidden">Coupon</span>
          <button
            type="submit"
            class="btn btn-dark"
            @click.prevent="subscribeSubmitWithoutChange"
          >
            Subscribe
          </button>
        </label>
      </div>
    </div>
    <div
      class="panel panel-default"
      v-if="
        $store.state.userData.selected_plan != 'none' &&
        $store.state.userData.paymentMethod == false &&
        $store.state.userData.isSubscribed == false
      "
    >
      <div class="panel-heading">Billing Information</div>
      <div class="panel-body table-responsive">
        <CardInfoForm
          btnText="Subscribe"
          :onTokenSubmitted="onTokenSubmitted"
          :subscribeSubmit="subscribeSubmit"
        />
      </div>
    </div>
    <div :class="`modal fade ${featuresShown == true ? 'show' : ''}`">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Pro</h3>
          </div>
          <div class="modal-body">
            <ul>
              <li>Unlimited Decks</li>
              <li>Unlimited cards per deck</li>
              <li>Customized themes</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="toggleShowFeatures(this)"
              class="btn btn-dark"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
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
      isSelected: false,
      tokenStripe: {},
      featuresShown: false,
    };
  },
  methods: {
    toggleShowFeatures() {
      var _this = this;
      _this.featuresShown = !_this.featuresShown;
    },
    cancelSubscription() {
      var _this = this;
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF("cancelSubscription", {}, "POST", true, true);
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
                    text: "Subscription Cancelled",
                    type: "success",
                  },
                ],
              });
            });
        } else {
          _this.$store.dispatch("changeData", {
            option: "notifications",
            value: [
              ..._this.$store.state.notifications,
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
    resubscribe(selected_plan) {
      var _this = this;
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "resubscribe",
          {
            selected_plan,
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
                    text: "Subscription Cancelled",
                    type: "success",
                  },
                ],
              });
            });
        } else {
          _this.$store.dispatch("changeData", {
            option: "notifications",
            value: [
              ..._this.$store.state.notifications,
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
    togglePlan(plan) {
      var _this = this;
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "selectPlan",
          {
            selected_plan:
              _this.$store.state.userData.selected_plan == plan ? "none" : plan,
            isCancel:
              _this.$store.state.userData.isSubscribed == true &&
              _this.$store.state.userData.selected_plan != "none",
          },
          "POST",
          true,
          true
        );
        if (rsp.isSuccess == true) {
          _this.$store.state.userData.selected_plan =
            _this.$store.state.userData.selected_plan == plan ? "none" : plan;
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
                    text: "Plan Selected",
                    type: "success",
                  },
                ],
              });
            });
        } else {
          _this.$store.dispatch("changeData", {
            option: "notifications",
            value: [
              ..._this.$store.state.notifications,
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
    onTokenSubmitted(tokenObj) {
      console.log(tokenObj);
      this.tokenStripe = tokenObj;
    },
    subscribeSubmitWithoutChange() {
      var _this = this;
      (async () => {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "purchase",
          {
            type: "monthly",
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
              option: "notifications",
              value: [
                ..._this.$store.state.notifications,
                {
                  notificationId: getRandomString(),
                  text: "Subscribed successfully",
                  type: "success",
                },
              ],
            })
            .then(() => {
              _this.$store.dispatch("changeData", {
                option: "isLoaded",
                value: true,
              });
            });
        } else {
          _this.$store.dispatch("changeData", {
            option: "isLoaded",
            value: true,
          });

          _this.$store.dispatch("changeData", {
            option: "notifications",
            value: [
              ..._this.$store.state.notifications,
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
    subscribeSubmit(callback) {
      var _this = this;
      (async (tokenObj) => {
        var rsp = { isSuccess: false };
        if ((tokenObj?.token?.id || "") != "") {
          _this.$store.dispatch("changeData", {
            option: "isLoaded",
            value: false,
          });
          rsp = await fetchF(
            _this,
            "updatePaymentMethod",
            {
              token: tokenObj?.token?.id || "",
            },
            "POST",
            true,
            true
          );
          callback();
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
            .then(async () => {
              _this.subscribeSubmitWithoutChange();
            });
        } else {
          _this.$store.dispatch("changeData", {
            option: "isLoaded",
            value: true,
          });

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
  table {
    color: white;
  }
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
