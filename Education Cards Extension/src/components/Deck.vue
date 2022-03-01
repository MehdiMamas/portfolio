<template>
  <div
    class="col-xs-12 col-sm-6 col-md-4 col-lg-3 deck mb-2"
    v-if="isAdd == false && isFull == false"
  >
    <router-link :to="{ name: 'NoCardPreview', params: { deckId: deckId } }">
      <span class="actionBar">
        <div class="firstSideOfActionBar">
          <span
            id="toggleActiveBtn"
            @click.prevent="toggleActive($event, this)"
            :class="$store.state.userData.getDeckWithId(deckId).isActive"
          >
            {{ $store.state.userData.getDeckWithId(deckId).isActive }}
          </span>
        </div>
        <div class="secondSideOfActionBar">
          <span id="editSection">
            <faicon icon="pen" />
          </span>
          <span id="deleteSection">
            <faicon @click.prevent="deleteDeck" icon="trash-alt" />
          </span>
        </div>
      </span>
      {{ $store.state.userData.getDeckWithId(deckId).deckName }}
      <span class="actionBar" style="bottom: 5px; top: unset">
        <div class="secondSideOfActionBar">
          <span id="cardsNumSection">
            {{ $store.state.userData.getDeckWithId(deckId).cards.length }}
            <faicon icon="folder-open" />
          </span>
        </div>
      </span>
    </router-link>
  </div>
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 deck mb-2 isMax" v-if="isFull == true">
    <router-link :to="{ name: 'SubscriptionSettings' }">
      <span> Deck limit reached</span>
      <span style="font-size: 16px">
        Buy another deck
        <a class="buyADeckBtn" @click="buyOneDeck"> Here</a>,
      </span>
      <span style="font-size: 16px">
        Or upgrade to Pro for unlimited decks
        <router-link class="buyADeckBtn" :to="{ name: 'SubscriptionSettings' }">
          Here
        </router-link>
      </span>
    </router-link>
  </div>
  <div
    class="col-xs-12 col-sm-6 col-md-4 col-lg-3 deck isToFill"
    v-if="isClicked == true"
  >
    <a>
      <span class="actionBar">
        <div class="secondSideOfActionBar">
          <span>
            <faicon @click.prevent="deleteDeck" icon="trash-alt" />
          </span>
        </div>
      </span>
      <form style="position: relative">
        <input
          type="text"
          @keypress="keyPressDeckName"
          v-model="newDeckName"
          placeholder="Enter deck name"
          id="enterDeckName"
        />
        <faicon
          icon="check-square"
          @click.prevent="addNewDeck"
          :class="`checkBox ${newDeckName.trim() != '' ? 'noOpacity' : ''}`"
        ></faicon>
      </form>
      <span class="actionBar" style="bottom: 5px; top: unset">
        <div class="secondSideOfActionBar">
          <span>
            0
            <faicon icon="folder-open" />
          </span>
        </div>
      </span>
    </a>
  </div>
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 deck isPlus" v-if="isAdd == true">
    <a @click.prevent="addDeck"> <faicon icon="plus"></faicon> </a>
  </div>
</template>
<script>
import { UserDataClass } from "@/services/userData.services";
import { fetchF } from "@/services/functions.services.js";
import {
  setLocalStorage,
  getLocalStorage,
  deleteDeck,
  getRandomString,
  toggleActive,
} from "@/services/functions.services";
export default {
  name: "Deck",
  data() {
    return {
      isClicked: false,
      newDeckName: "",
    };
  },
  props: {
    deckId: String,
    isAdd: Boolean,
    isFull: Boolean,
  },
  methods: {
    toggleActive,
    buyOneDeck(e) {
      e.preventDefault();
      var _this = this;
      if (_this.$store.state.userData.paymentMethod == false) {
        _this.$router.push({ name: "PaymentMethodSettings" });
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "Please set up a payment method and try again",
              type: "error",
            },
          ],
        });
      } else {
        _this.$store.dispatch("changeData", {
          option: "confirmationText",
          value: "Are you sure you want to buy one deck?",
        });
      }
    },
    keyPressDeckName(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.addNewDeck();
      }
    },
    addNewDeck: async function () {
      var rsp = { isSuccess: false };
      var _this = this;
      rsp = await fetchF(
        "createDeck",
        {
          data: {
            deckName: this.newDeckName,
          },
        },
        "POST",
        true,
        true
      );
      setLocalStorage("access_token", rsp.access_token);
      setLocalStorage("refresh_token", rsp.refresh_token);
      if (rsp.isSuccess == true) {
        this.isClicked = false;
        this.newDeckName = "";
        this.$store
          .dispatch("changeData", {
            option: "userData",
            value: new UserDataClass(rsp.userData || {}),
          })
          .then(() => {
            _this.$router.push({
              name: "NoCardPreview",
              params: {
                deckId:
                  _this.$store.state.userData.decks[
                    _this.$store.state.userData.decks.length - 1
                  ]?.deckId,
              },
            });
          });
      } else {
        this.$store.dispatch("changeData", {
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
    },
    addDeck: function () {
      this.isClicked = true;
      var si = setInterval(() => {
        if (document.querySelector("#enterDeckName") != null) {
          clearInterval(si);
          document.querySelector("#enterDeckName").focus();
        }
      }, 0);
    },
    deleteDeck: async function () {
      var _this = this;
      if (this.isAdd == true) {
        this.isClicked = false;
        this.newDeckName = "";
      } else {
        if (_this.$store.state.userData.isWarned1 == "true") {
          deleteDeck(_this);
        } else {
          _this.$store.dispatch("changeData", {
            option: "confirmationText",
            value:
              "Deleting a deck on the free version won’t let you to make another one",
          });
          _this.$store.state.tempData.deckId = _this.deckId;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  .deck,
  .isPlus,
  .isToFill {
    > a {
      background-color: #242427 !important;
      &:hover {
        transition: all 0.5s ease;
        opacity: 0.7;
      }
      opacity: 0.5;
    }
    #toggleActiveBtn {
      &.active {
        color: #fff;
        background: #015324;
      }
      &.inactive {
        background: #00000080;
      }
    }
    > * {
      color: white !important;
    }
    &.isToFill {
      input {
        color: white !important;
      }
    }
  }
}

.deck {
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  > a {
    padding: 25% 15px;
    transition: all 500ms ease;
    width: 100%;
    text-align: center;
    border: none;
    border-bottom: 5px solid rgba(0, 0, 0, 0.1);
    background-color: #fff;
    font-family: "Rubik";
    font-weight: 500;
    line-height: 1.2;
    text-rendering: optimizelegibility;
    position: relative;
    overflow: hidden;
    font-size: calc(16px + 0.6vw);
    margin-bottom: 0px;
    text-decoration: none;
    color: #636b6f;
    justify-content: center;
    align-items: center;
    height: 350px;
    display: flex;
    > .actionBar {
      display: flex;
      position: absolute;
      z-index: 10;
      padding: 0px 10px;
      top: 5px;
      width: 100%;
      display: flex;
      zoom: 1.25;
      left: 0;
      margin-top: 10px;
      > div.firstSideOfActionBar {
        display: flex;
        align-items: center;
        flex: 0;
      }
      > .secondSideOfActionBar {
        display: flex;
        font-size: 15px;
        align-items: center;
        font-size: 12px;
        flex: 1;
        justify-content: flex-end;
      }
    }
  }
  &.isToFill {
    > a {
      input {
        border: none;
        background-color: transparent;
        border-bottom: 3px solid rgba(0, 0, 0, 0.1);
        outline: none;
        text-align: center;
        color: rgb(99, 107, 111);
        font-family: "Rubik";
        font-weight: 500;
        font-size: calc(16px + 0.6vw);
      }
    }
    .checkbox {
      color: rgb(46, 204, 113);
      position: absolute;
      right: 0;
      opacity: 0.5;
      &.noOpacity {
        opacity: 1 !important;
      }
    }
  }
  &.isPlus {
    > a {
      opacity: 0.5;
      background: #e5e5e5;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
  &.isMax {
    user-select: none;
    > a {
      cursor: pointer;
      background: #e67e22;
      flex-direction: column;
      > span {
        color: white;
        > .buyADeckBtn {
          color: #000000ad;
          text-decoration: none;
          transition: all 500ms ease;
          &:hover {
            opacity: 0.5;
          }
        }
      }
    }
  }
  #cardsNumSection,
  #deleteSection,
  #editSection {
    font-size: 14px;
    transition: all 250ms ease;
    opacity: 0.5;
    margin-left: 5px;
  }
  #cardsNumSection:hover,
  #deleteSection:hover,
  #editSection:hover {
    opacity: 1;
  }

  #toggleActiveBtn {
    font-family: "Rubik";
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
    text-rendering: optimizeLegibility;
    padding: 3px 5px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 999px;
    cursor: pointer;
    transition: all 250ms ease;
  }

  #toggleActiveBtn.active {
    color: #fff;
    background: #2ecc71;
  }
}
</style>
