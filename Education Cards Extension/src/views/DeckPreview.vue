<template>
  <div class="main">
    <div class="row header">
      <div class="col-md-4">
        <form style="position: relative" id="deckNameSide">
          <input
            @keypress.enter="updateDeckName"
            type="text"
            v-model="deckName"
            class="deckNameInput"
            placeholder="Deck name..."
          />
          <faicon
            icon="check-square"
            @click.prevent="updateDeckName"
            :class="`checkBox ${deckName.trim() != '' ? 'noOpacity' : ''}`"
          ></faicon>
        </form>
      </div>
      <div class="col-md-8" id="buttonsSection">
        <div class="invertButton">
          <label style="margin-right: 10px" for="invert">Invert </label>
          <input
            type="checkbox"
            name="invert"
            id="invert"
            @input="toggleInvert"
            v-model="$store.state.userData.getDeckWithId($route.params.deckId).invert"
          />
        </div>
        <button class="btn btn-dark" style="margin: 0.5em 0px" @click="clickAddBtn">
          Add a card
          <faicon icon="plus"></faicon>
        </button>
        <button class="btn btn-dark" style="margin: 0.5em 0px" @click="openExport(this)">
          Export <faicon icon="download"></faicon>
        </button>

        <button class="btn btn-dark" @click="openImport(this)" style="margin: 0.5em 0px">
          Import <faicon icon="upload"></faicon>
        </button>
        <span id="cardsNumSection">
          {{ $store.state.userData.getDeckWithId($route.params.deckId).cards.length }}
          <faicon icon="folder-open" />
        </span>

        <span
          id="toggleActiveBtn"
          @click.prevent="toggleActive($event, this)"
          :class="$store.state.userData.getDeckWithId($route.params.deckId).isActive"
        >
          {{ $store.state.userData.getDeckWithId($route.params.deckId).isActive }}
        </span>
      </div>
    </div>
    <div class="row body">
      <div
        style="width: 33.33%; padding: 0px; position: relative"
        class="firstSideOfPage"
      >
        <div class="input-group searchSection">
          <input
            v-model="searchText"
            @keypress="keyPressDeckName"
            type="text"
            placeholder="Search Cards"
            class="form-control searchCard"
            style="z-index: 1"
          />
          <div
            @click.prevent="clearSearchInput"
            class="input-group-addon"
            style="padding: 0px; background: #efefef"
          >
            <button style="line-height: 1.4; padding-top: 7px">
              <faicon icon="times"></faicon>
            </button>
          </div>
        </div>
        <div style="overflow: auto">
          <Card
            :clickAddBtn="clickAddBtn"
            :deleteCard="deleteCard"
            v-for="(item, index) in $store.state.userData
              .getDeckWithId($route.params.deckId)
              .cards.filter((e) => e.frontText.indexOf(searchText) != -1)"
            :cardId="item.cardId"
            :key="index"
          />
        </div>
      </div>
      <router-view :clickAddBtn="clickAddBtn" :deleteCard="deleteCard"></router-view>
    </div>
  </div>
</template>

<script>
import { UserDataClass } from "@/services/userData.services";
import { defineAsyncComponent } from "vue";
import Loading from "@/components/Loading.vue";
const Card = defineAsyncComponent({
  loader: () => import("@/components/Card.vue" /* webpackChunkName: "Card" */),
  loadingComponent: Loading,
  delay: 200,
  suspensible: false,
});
import { fetchF } from "@/services/functions.services.js";
import {
  getRandomString,
  openImport,
  openExport,
  toggleActive,
} from "@/services/functions.services";
export default {
  name: "DeckPreview",
  data() {
    return {
      isShow: false,
      isToggled: false,
      searchText: "",
      deckName: this.$store.state.userData.getDeckWithId(this.$route.params.deckId)
        .deckName,
    };
  },
  methods: {
    openImport,
    toggleActive,
    openExport,
    toggleInvert: async function (e) {
      e.preventDefault();
      var _this = this;
      var deckId = _this.$route.params.deckId;
      var rsp = { isSuccess: false };
      rsp = await fetchF(
        "toggleDeckIsInvert",
        {
          deckId,
          invert: e.target.checked,
        },
        "POST",
        true,
        true
      );
      if (rsp.isSuccess == true) {
        _this.$store
          .dispatch("changeData", {
            option: "userData",
            value: new UserDataClass(rsp.userData || {}),
          })
          .then(() => {
            _this.$store.dispatch("changeData", {
              option: "notifications",
              value: [
                ..._this.$store.state.notifications,
                {
                  notificationId: getRandomString(),
                  text: "Deck updated successfully",
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
      _this.$store.dispatch("changeData", {
        option: "isActiveAble",
        value: true,
      });
    },
    updateDeckName: async function (e) {
      e.preventDefault();
      var deckNewName = this.deckName;
      if (deckNewName != "") {
        var rsp = { isSuccess: false };
        rsp = await fetchF(
          "updateDeckName",
          {
            deckId: this.$store.state.userData.getDeckWithId(this.$route.params.deckId)
              .deckId,
            deckNewName,
          },
          "POST",
          true,
          true
        );
        if (rsp.isSuccess == true) {
          this.$store
            .dispatch("changeData", {
              option: "userData",
              value: new UserDataClass(rsp.userData || {}),
            })
            .then(() => {
              this.$store.dispatch("changeData", {
                option: "notifications",
                value: [
                  ...this.$store.state.notifications,
                  {
                    notificationId: getRandomString(),
                    text: "Deck updated successfully",
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
      }
    },
    keyPressDeckName(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.addNewDeck();
      }
    },
    clearSearchInput: function () {
      this.searchText = "";
    },
    deleteCard: async function (cardData) {
      this.$store.dispatch("changeData", {
        option: "isLoaded",
        value: false,
      });
      var cardId = cardData.cardId || this.$route.params.cardId;
      var deckId = cardData.deckId || this.$route.params.deckId;
      var isNewCard = cardId == "cardToAdd";

      this.$store.state.userData.getDeckWithId(deckId).deleteCardWithId(cardId);
      this.$store.dispatch("changeData", {
        option: "userData",
        value: this.$store.state.userData,
      });

      this.$router.push({
        name: "NoCardPreview",
        params: { deckId: deckId },
      });
      if (isNewCard == true) {
        return;
      }
      var rsp = { isSuccess: false };
      rsp = await fetchF(
        "deleteCard",
        {
          deckId,
          cardId,
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
      this.$store.dispatch("changeData", {
        option: "isLoaded",
        value: true,
      });
    },
    clickAddBtn: function () {
      var _this = this;
      if (
        this.$store.state.userData
          .getDeckWithId(this.$route.params.deckId)
          .cards.filter((e) => e.cardId == "cardToAdd").length == 0
      ) {
        this.$store.state.userData.getDeckWithId(this.$route.params.deckId).addCard({
          deckId: this.$route.params.deckId,
          userId: this.$store.state.userData.userId,
          cardId: "cardToAdd",
          frontText: "",
          frontImg: "",
          frontType: "text",
          backText: "",
          backImg: "",
          backType: "text",
        });
        this.$store.dispatch("changeData", {
          option: "userData",
          value: this.$store.state.userData,
        });
      }

      this.$router.push({
        name: "CardPreview",
        params: { deckId: this.$route.params.deckId, cardId: "cardToAdd" },
      });
      var si = setInterval(() => {
        if (
          _this.$route.params.cardId == "cardToAdd" &&
          document.querySelector("#frontText") != null
        ) {
          clearInterval(si);
          document.querySelector("#frontText").focus();
        } else if (
          _this.$store.state.userData
            .getDeckWithId(_this.$route.params.deckId)
            .cards.filter((e) => e.cardId == "cardToAdd").length != 0
        ) {
          _this.$router.push({
            name: "CardPreview",
            params: { deckId: _this.$route.params.deckId, cardId: "cardToAdd" },
          });
        }
      }, 100);
    },
  },
  components: {
    Card,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btn {
  opacity: 0.7;
  transition: all 500ms ease !important;
}
.btn:hover {
  opacity: 1;
}
</style>
<style lang="scss" scoped>
.darkmode {
  #cardsNumSection,
  .deckNameInput,
  .invertButton {
    color: white !important;
    border-color: white !important;
  }
  #toggleActiveBtn {
    &.active {
      color: #fff;
      background: #015324;
    }
    &.inactive {
      color: rgba(255, 255, 255, 0.453);
      background: #00000080;
    }
  }
  .firstSideOfPage {
    background-color: #222225 !important;
    .searchCard {
      background: #1b1c21;
      color: white !important;
      outline: none !important;
    }
  }
}
.searchSection {
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.searchSection button {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
  line-height: 1.4;
  padding-top: 7px;
  height: 100%;
  border: 1px solid #ccd0d2;
}

.searchSection > input {
  box-shadow: none;
  outline: none;
  border: 1px solid #ccd0d2;
}
.row.body {
  flex-wrap: nowrap;
  padding: 0 12px;
  padding-top: 20px;
  height: calc(100vh - 160px);
}

.row.body > div:nth-child(1) {
  background-color: #e5e5e5;
  width: 40px;
  display: flex;
  flex-direction: column;
}
.row.body > div:nth-child(2) {
  background-color: #fff;
  padding: 60px;
}
#buttonsSection {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
#buttonsSection > button {
  margin-left: 10px !important;
}
#cardsNumSection,
#deleteSection,
#editSection {
  font-size: 14px;
  margin-left: 10px;
  transition: all 250ms ease;
  opacity: 0.5;
}
#cardsNumSection:hover,
#deleteSection:hover,
#editSection:hover {
  opacity: 1;
}

#toggleActiveBtn {
  font-family: "Rubik";
  font-size: 17px;
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  padding: 6px 8px;
  margin-left: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  cursor: pointer;
  transition: all 250ms ease;
}

#toggleActiveBtn.active {
  color: #fff;
  background: #2ecc71;
}

form#deckNameSide {
  overflow: hidden;
}
form#deckNameSide input {
  border: none;
  width: 100%;
  background-color: transparent;
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
  outline: none;
  text-align: left;
  color: rgb(99, 107, 111);
  font-family: "Rubik";
  font-weight: 500;
  font-size: calc(16px + 0.6vw);
}
.checkBox {
  color: rgb(46, 204, 113);
  font-size: 30px;
  position: absolute;
  top: 50px;
  transition: all 500ms ease;
  right: 0;
  opacity: 0.5;
}
.checkBox.noOpacity {
  opacity: 1 !important;
}
form#deckNameSide input:hover + .checkBox,
.checkBox:hover {
  top: 10px;
}

.main {
  margin: 0 20px;
}
.main > div > div:nth-child(1) > h1 {
  font-size: calc(20px + 1.3vw);
  font-family: Rubik, sans-serif;
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  color: #636b6f;
}
</style>
