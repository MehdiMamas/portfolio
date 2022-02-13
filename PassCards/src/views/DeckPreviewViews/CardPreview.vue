<template>
  <div style="width: 66.66%; overflow: auto; padding: 1%" class="container">
    <div class="frontSide">
      <div class="frontHeader">
        <h1>Front:</h1>
        <div>
          <input
            type="file"
            accept="image/*"
            id="frontImg"
            style="display: none"
            @change="encodeImageFileAsURL($event, 'front')"
            data-type="frontImg"
          />
          <label
            class="btn btn-light"
            data-type="frontType"
            for="frontImg"
            @click="removeImage($event, 'front')"
          >
            {{
              $store.state.userData
                .getDeckWithId($route.params.deckId)
                .getCardWithId($route.params.cardId).frontType != "image"
                ? "Add Image"
                : "Remove Image"
            }}
          </label>
        </div>
      </div>
      <div class="frontBody">
        <img
          :src="`${
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)
              ?.frontImg?.indexOf('data:') == -1
              ? $store.state.serverLink
              : ''
          }${
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.frontImg
          }`"
          v-if="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.frontType == 'image'
          "
          alt=""
        />
        <textarea
          cols="30"
          id="frontText"
          rows="10"
          :value="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.frontText
          "
          @input="changeText($event, 'front')"
          v-if="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.frontType != 'image'
          "
        ></textarea>
      </div>
    </div>
    <div class="backSide">
      <div class="backHeader">
        <h1>Back:</h1>
        <div>
          <input
            type="file"
            accept="image/*"
            id="backImg"
            style="display: none"
            @change="encodeImageFileAsURL($event, 'back')"
            data-type="backImg"
          />
          <label
            class="btn btn-light"
            data-type="backType"
            for="backImg"
            @click="removeImage($event, 'back')"
          >
            {{
              $store.state.userData
                .getDeckWithId($route.params.deckId)
                .getCardWithId($route.params.cardId)?.backType != "image"
                ? "Add Image"
                : "Remove Image"
            }}
          </label>
        </div>
      </div>
      <div class="backBody">
        <img
          :src="`${
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)
              .backImg?.indexOf('data:') == -1
              ? $store.state.serverLink
              : ''
          }${
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.backImg
          }`"
          v-if="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.backType == 'image'
          "
          alt=""
        />
        <textarea
          cols="30"
          id="backText"
          rows="10"
          :value="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.backText
          "
          @input="changeText($event, 'back')"
          @keydown.tab="addCardAndCreateNewOne"
          v-if="
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)?.backType != 'image'
          "
        ></textarea>
      </div>
    </div>
    <div class="buttonsSide">
      <button
        class="btn btn-dark"
        :data-type="
          $store.state.userData
            .getDeckWithId($route.params.deckId)
            .getCardWithId($route.params.cardId)?.cardId == 'cardToAdd'
            ? 'add'
            : 'save'
        "
        style="color: #ffffff"
        @click="addCard"
      >
        {{
          $store.state.userData
            .getDeckWithId($route.params.deckId)
            .getCardWithId($route.params.cardId)?.cardId == "cardToAdd"
            ? "Add Card"
            : "Save Card"
        }}
      </button>

      <button
        class="btn btn-outline-dark noColorImportant"
        style="margin-left: 10px !important"
        :data-type="
          $store.state.userData
            .getDeckWithId($route.params.deckId)
            .getCardWithId($route.params.cardId)?.cardId == 'cardToAdd'
            ? 'discard'
            : 'remove'
        "
        @click="
          deleteCard(
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId($route.params.cardId)
          )
        "
      >
        {{
          $store.state.userData
            .getDeckWithId($route.params.deckId)
            .getCardWithId($route.params.cardId)?.cardId == "cardToAdd"
            ? "Discard Card"
            : "Remove Card"
        }}
      </button>
    </div>
  </div>
</template>

<script>
import { UserDataClass } from "@/services/userData.services";
import { getRandomString } from "@/services/functions.services";
import { fetchF } from "@/services/functions.services.js";
export default {
  name: "CardPreview",
  data() {
    return {
      currentCard: this.$store.state.userData
        .getDeckWithId(this.$route.params.deckId)
        .getCardWithId(this.$route.params.cardId),
    };
  },
  watch: {
    currentCard(to, from) {
      if (from.invert != to.invert) {
        this.$store.dispatch("changeData", {
          option: "userData",
          value: this.$store.state.userData,
        });
      }
    },
  },
  methods: {
    changeText: function (e, type) {
      if (
        this.$store.state.userData
          .getDeckWithId(this.$route.params.deckId)
          .getCardWithId(this.$route.params.cardId).cardId != null
      ) {
        this.$store.state.userData
          .getDeckWithId(this.$route.params.deckId)
          .getCardWithId(this.$route.params.cardId)[type + "Text"] = e.target.value;

        this.$store.state.userData
          .getDeckWithId(this.$route.params.deckId)
          .getCardWithId(this.$route.params.cardId)[type + "Type"] = "text";
      }
      this.$store.dispatch("changeData", {
        option: "userData",
        value: this.$store.state.userData,
      });
    },
    encodeImageFileAsURL: function (e, type) {
      var _this = this;
      var element = e.target;
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        element.value = "";
        _this.$store.state.userData
          .getDeckWithId(_this.$route.params.deckId)
          .getCardWithId(_this.$route.params.cardId)[type + "Img"] = reader.result;
        _this.$store.state.userData
          .getDeckWithId(_this.$route.params.deckId)
          .getCardWithId(_this.$route.params.cardId)[type + "Type"] = "image";
        _this.$store.dispatch("changeData", {
          option: "userData",
          value: _this.$store.state.userData,
        });
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e, type) {
      if (
        this.$store.state.userData
          .getDeckWithId(this.$route.params.deckId)
          .getCardWithId(this.$route.params.cardId).cardId != null
      ) {
        if (
          this.$store.state.userData
            .getDeckWithId(this.$route.params.deckId)
            .getCardWithId(this.$route.params.cardId)[type + "Type"] == "image"
        ) {
          e.preventDefault();
          this.$store.state.userData
            .getDeckWithId(this.$route.params.deckId)
            .getCardWithId(this.$route.params.cardId)[type + "Img"] = "";
          this.$store.state.userData
            .getDeckWithId(this.$route.params.deckId)
            .getCardWithId(this.$route.params.cardId)[type + "Type"] = "text";
        }
      }
      this.$store.dispatch("changeData", {
        option: "userData",
        value: this.$store.state.userData,
      });
    },
    addCard: function () {
      return new Promise(async (resolve, reject) => {
        var _this = this;
        var isNewCard =
          this.$store.state.userData
            .getDeckWithId(this.$route.params.deckId)
            .getCardWithId(this.$route.params.cardId)?.cardId == "cardToAdd";
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          isNewCard == true ? "createCard" : "updateCard",
          {
            cardState: this.$store.state.userData
              .getDeckWithId(this.$route.params.deckId)
              .getCardWithId(this.$route.params.cardId),
          },
          "POST",
          true,
          true
        );
        if (rsp.isSuccess == true) {
          this.$store.dispatch("changeData", {
            option: "userData",
            value: new UserDataClass(rsp.userData || {}),
          });

          if (isNewCard == false) {
            this.$store.dispatch("changeData", {
              option: "notifications",
              value: [
                ...this.$store.state.notifications,
                {
                  notificationId: getRandomString(),
                  text: "Card updated successfully",
                  type: "success",
                },
              ],
            });
            resolve();
            return;
          }

          this.$store.state.userData
            .getDeckWithId(this.$route.params.deckId)
            .getCardWithId("cardToAdd").cardId = rsp.cardId;
          this.$store
            .dispatch("changeData", {
              option: "userData",
              value: this.$store.state.userData,
            })
            .then(() => {
              _this.$store.dispatch("changeData", {
                option: "notifications",
                value: [
                  ..._this.$store.state.notifications,
                  {
                    notificationId: getRandomString(),
                    text: "Card created successfully",
                    type: "success",
                  },
                ],
              });
              _this.$router.push({
                name: "CardPreview",
                params: {
                  deckId: _this.$route.params.deckId,
                  cardId: rsp.cardId,
                },
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
        resolve();
      });
    },
    addCardAndCreateNewOne: async function () {
      var _this = this;
      this.addCard().then(() => {
        _this.clickAddBtn();
      });
    },
  },
  props: {
    deleteCard: Function,
    clickAddBtn: Function,
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  .container {
    background-color: #1b1c21 !important;
    h1,
    textarea,
    button {
      color: rgb(197, 197, 197) !important;
      border-color: rgb(197, 197, 197) !important;
    }
    label {
      color: black;
    }
  }
}
.frontSide,
.backSide {
  height: 45%;
  display: flex;
  flex-direction: column;
  .backHeader,
  .frontHeader {
    flex: 0;
    display: flex;
    font-weight: 500;
    font-size: 41px;
    font-family: "Rubik";
    line-height: 49px;
    user-select: none;
    height: 48px;
    button {
      background-color: #efefef;
      color: #636b6f;
      opacity: 0.5;
      font-weight: 600;
      font-size: 13px;
      font-family: "Rubik";
      font-weight: bold;
      transition: all 0.2s ease;
      text-transform: none;
    }
    > div {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .backBody,
  .frontBody {
    height: calc(100% - 48px);
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      max-height: 100%;
    }
    > textarea {
      height: 100%;
      padding: 20px;
      border: none;
      outline: none;
      border-bottom: 3px solid rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.05);
      font-weight: 500;
      width: 100%;
      resize: none;
      font-size: calc(14px + 0.4vw);
      font-family: "Rubik";
    }
  }
}
*:not(.noColorImportant) {
  color: #636b6f;
}
.buttonsSide {
  height: 10%;
  display: flex;
  align-items: center;
  button {
    margin-left: 10px;
  }
}
</style>
