<template>
  <form style="position: relative">
    <div
      v-if="isLoaded == false"
      class="loader"
      style="
        background: white;
        display: flex;
        position: absolute;
        place-content: center;
        height: 100%;
        width: 100%;
        align-items: center;
        z-index: 100000;
      "
    >
      <img src="@/assets/loader.gif" style="width: 200px" alt="" />
    </div>
    <div class="group">
      <div>
        <h2
          class="titleBanner"
          style="
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            color: #636b6f;
            margin-top: 0;
            margin-bottom: 15px;
            padding: 12px;
          "
        >
          <faicon icon="map-marker" />
          Billing Address
        </h2>
        <label>
          <span class="col-4">Address Line 1</span>
          <div class="col-6 field StripeElement">
            <input
              v-model="additionalData.address_line1"
              placeholder=""
              type="text"
              style="
                height: 38px;
                border: 0;
                outline: 0;
                width: 100%;
                line-height: 40px;
                font-weight: 300;
                font-size: 15px;
              "
            />
          </div>
        </label>
        <label>
          <span class="col-4">Address Line 2</span>
          <div class="col-6 field StripeElement">
            <input
              type="text"
              v-model="additionalData.address_line2"
              placeholder=""
              style="
                height: 38px;
                border: 0;
                outline: 0;
                width: 100%;
                line-height: 40px;
                font-weight: 300;
                font-size: 15px;
              "
            />
          </div>
        </label>
        <label>
          <span class="col-4">City</span>
          <div class="col-6 field StripeElement">
            <input
              type="text"
              v-model="additionalData.address_city"
              placeholder=""
              style="
                height: 38px;
                border: 0;
                outline: 0;
                width: 100%;
                line-height: 40px;
                font-weight: 300;
                font-size: 15px;
              "
            />
          </div>
        </label>
        <label>
          <span class="col-4">State & ZIP / Postal Code</span>
          <div class="col-6 field" style="display: flex">
            <div style="flex: 1; padding-right: 5px">
              <div class="StripeElement">
                <input
                  type="text"
                  v-model="additionalData.address_state"
                  placeholder=""
                  style="
                    height: 38px;
                    border: 0;
                    outline: 0;
                    width: 100%;
                    line-height: 40px;
                    font-weight: 300;
                    font-size: 15px;
                  "
                />
              </div>
            </div>
            <div style="flex: 1; padding-left: 5px">
              <div class="StripeElement">
                <input
                  type="text"
                  v-model="additionalData.address_zip"
                  placeholder=""
                  style="
                    height: 38px;
                    border: 0;
                    outline: 0;
                    width: 100%;
                    line-height: 40px;
                    font-weight: 300;
                    font-size: 15px;
                  "
                />
              </div>
            </div>
          </div>
        </label>
        <label>
          <span class="col-4">Country</span>
          <div class="col-6 field StripeElement">
            <select
              v-model="additionalData.address_country"
              style="width: 100%; height: 100%; border: none; outline: none"
            >
              <option
                v-for="(item, index) in $store.state.countries"
                :key="index"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </label>
      </div>
      <div>
        <h2
          class="titleBanner"
          style="
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            color: #636b6f;
            margin-top: 0;
            margin-bottom: 15px;
            padding: 12px;
          "
        >
          <faicon icon="credit-card" />
          Credit Card
        </h2>
        <label>
          <span class="col-4">Cardholder's Name</span>
          <div id="card-holder-name-element" class="col-6 field StripeElement">
            <input
              v-model="additionalData.cardHolderName"
              placeholder=""
              type="text"
              style="
                height: 38px;
                border: 0;
                outline: 0;
                width: 100%;
                line-height: 40px;
                font-weight: 300;
                font-size: 15px;
              "
            />
          </div>
        </label>
        <label>
          <span class="col-4">Card number</span>
          <div id="card-number-element" class="col-6 field"></div>
        </label>
        <label>
          <span class="col-4">Expiry date</span>
          <div id="card-expiry-element" class="col-6 field"></div>
        </label>
        <label>
          <span class="col-4">Security Code</span>
          <div id="card-cvc-element" class="col-6 field"></div>
        </label>
        <label>
          <span class="col-4">Coupon</span>
          <div id="coupon" class="col-6 field StripeElement">
            <input
              type="text"
              v-model="coupon"
              placeholder=""
              style="
                height: 38px;
                border: 0;
                outline: 0;
                width: 100%;
                line-height: 40px;
                font-weight: 300;
                font-size: 15px;
              "
            />
          </div>
        </label>
      </div>
      <label>
        <span class="col-4" style="visibility: hidden">Coupon</span>
        <button
          :disabled="results?.token == undefined"
          type="submit"
          class="btn btn-dark"
          @click.prevent="subscribeSubmit(this.subscribeSubmitCallback)"
        >
          {{ btnText }}
        </button>
      </label>
    </div>
  </form>
</template>
<script>
import { getRandomString } from "@/services/functions.services.js";
export default {
  data() {
    return {
      additionalData: {
        address_line1: "",
        address_line2: "",
        address_city: "",
        address_state: "",
        address_zip: "",
        address_country: "",
        name: "",
      },
      isLoaded: false,
      coupon: "",
      results: {},
    };
  },
  methods: {
    subscribeSubmitCallback() {},
  },
  props: {
    btnText: Text,
    subscribeSubmit: Function,
    onTokenSubmitted: Function,
  },
  mounted() {
    var _this = this;
    var stripe = Stripe(
      "pk_test_51JaQ4XJVNF3Lls4ZnLDeIQtVUxGW1hHwPbSJ6koPwe7hdbhG6Ukjk2Xo9BVqRK0PEUswKNlXiToLa33R1YOpVD0500zgo6oToA"
    );
    var elements = stripe.elements();
    var style = {
      base: {
        iconColor: "#666EE8",
        color: "#5fa1f7",
        lineHeight: "40px",
        fontWeight: 300,
        fontFamily: "Helvetica Neue",
        fontSize: "15px",

        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    };
    var cardNumberElement = elements.create("cardNumber", {
      style,
      placeholder: "",
    });
    cardNumberElement.mount("#card-number-element");

    var cardExpiryElement = elements.create("cardExpiry", {
      style,
      placeholder: "",
    });
    cardExpiryElement.mount("#card-expiry-element");

    var cardCvcElement = elements.create("cardCvc", {
      style,
      placeholder: "",
    });
    cardCvcElement.mount("#card-cvc-element");

    function setOutcome(result) {
      _this.results = result;
      console.log(result);
      if (result.token) {
        _this.onTokenSubmitted(result);
      } else if (
        result.error &&
        result.error.message != "Your card number is incomplete." &&
        result.error.message != "Your card's expiration date is incomplete." &&
        result.error.message != "Your card's security code is incomplete."
      ) {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: result.error.message,
              type: "error",
            },
          ],
        });
      }
    }
    var arrayOfEls = [cardNumberElement, cardExpiryElement, cardCvcElement, []];
    for (let i = 0; i < 3; i++) {
      var element = arrayOfEls[i];
      element.on("change", function () {
        var obj = { ..._this.additionalData };
        Object.keys(obj)
          .filter((e) => obj[e].trim() == "")
          .map((e) => delete obj[e]);
        stripe.createToken(cardNumberElement, obj).then(setOutcome);
      });
      element.on("ready", function (event) {
        var u = arrayOfEls.indexOf(
          arrayOfEls.filter((e) => e._componentName == event.elementType)?.[0]
        );
        var si = setInterval(() => {
          if (arrayOfEls[3].indexOf(u) == -1 && _this.isLoaded != true) {
            document.querySelector('[href="#/decks"]').focus();
            arrayOfEls[u].focus();
            arrayOfEls[u].blur();
          } else {
            clearInterval(si);
          }
        }, 500);
      });
      element.on("focus", function (event) {
        var u = arrayOfEls.indexOf(
          arrayOfEls.filter((e) => e._componentName == event.elementType)?.[0]
        );
        if (arrayOfEls[3].length != 3) {
          arrayOfEls[3].push(u);
        }
        if (arrayOfEls[3].length == 3 && _this.isLoaded != true) {
          _this.isLoaded = true;
        }
      });
    }
    // cardNumberElement.on("change", function () {
    //   var obj = { ..._this.additionalData };
    //   Object.keys(obj)
    //     .filter((e) => obj[e].trim() == "")
    //     .map((e) => delete obj[e]);
    //   stripe.createToken(cardNumberElement, obj).then(setOutcome);
    // });

    // cardNumberElement.on("ready", function () {
    //   var si = setInterval(() => {
    //     if (ready.indexOf(1) == -1) {
    //       document.querySelector('[href="#/decks"]').focus();
    //       cardNumberElement.focus();
    //       cardNumberElement.blur();
    //     } else {
    //       clearInterval(si);
    //     }
    //   }, 500);
    // });
    // cardNumberElement.on("focus", function (event) {
    //   ready.push(1);
    //   console.log(event);
    //   if (ready.length == 3) {
    //     _this.isLoaded = true;
    //   }
    // });

    // cardExpiryElement.on("ready", function () {
    //   var si = setInterval(() => {
    //     if (ready.indexOf(2) == -1) {
    //       document.querySelector('[href="#/decks"]').focus();
    //       cardExpiryElement.focus();
    //       cardExpiryElement.blur();
    //     } else {
    //       clearInterval(si);
    //     }
    //   }, 500);
    // });
    // cardExpiryElement.on("focus", function (event) {
    //   ready.push(2);
    //   console.log(event);
    //   if (ready.length == 3) {
    //     _this.isLoaded = true;
    //   }
    // });

    // cardCvcElement.on("ready", function () {
    //   var si = setInterval(() => {
    //     if (ready.indexOf(3) == -1) {
    //       document.querySelector('[href="#/decks"]').focus();
    //       cardCvcElement.focus();
    //       cardCvcElement.blur();
    //     } else {
    //       clearInterval(si);
    //     }
    //   }, 500);
    // });
    // cardCvcElement.on("focus", function (event) {
    //   ready.push(3);
    //   console.log(event);
    //   if (ready.length == 3) {
    //     _this.isLoaded = true;
    //   }
    // });
    this.subscribeSubmitCallback = function () {
      var obj = { ..._this.additionalData };
      Object.keys(obj)
        .filter((e) => obj[e].trim() == "")
        .map((e) => delete obj[e]);
      stripe.createToken(cardNumberElement, obj).then(setOutcome);
    };
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  input,
  select {
    background: #2b2c2f !important;
    color: white;
  }
  .titleBanner {
    background-color: #35363a !important;
    color: white !important;
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
label {
  display: flex;
  flex-direction: row;
  padding: 5px 0;
  .StripeElement {
    border: 1px solid #c1b6b6 !important;
    padding: 0 5px;
    border-radius: 5px;
    height: 40px;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
  }
}
.group {
  display: flex;
  flex-direction: column;
}
</style>
