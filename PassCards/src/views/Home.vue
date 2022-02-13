<template>
  <div
    id="mainHomeTab"
    :class="`main ${isShow == true ? 'isShow' : ''}`"
    v-if="cards?.length > 0"
  >
    <div class="topPart">
      <div class="mainTxt">
        <img
          :src="`${
            cards?.[0]?.[
              this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.invert ==
              'true'
                ? 'backImg'
                : 'frontImg'
            ].indexOf('data:') == -1
              ? $store.state.serverLink
              : ''
          }${
            cards?.[0]?.[
              this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.invert ==
              'true'
                ? 'backImg'
                : 'frontImg'
            ]
          }`"
          v-if="
            cards?.[0]?.[
              this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.invert ==
              'true'
                ? 'backType'
                : 'frontType'
            ] == 'image'
          "
        />
        <p
          v-if="
            cards?.[0]?.[
              this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.invert ==
              'true'
                ? 'backType'
                : 'frontType'
            ] == 'text'
          "
        >
          {{
            cards?.[0]?.[
              this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.invert ==
              "true"
                ? "backText"
                : "frontText"
            ] || ""
          }}
        </p>
        <button class="showBtn" id="showBtn" v-if="isShow == false" @click="showBtn">
          show
        </button>
      </div>
    </div>
    <div :class="`bottomPart ${isShow == true ? 'uncollapse' : 'collapse'}`">
      <div v-if="isShow == true">
        <div class="mainTxt">
          <img
            :src="`${
              cards?.[0]?.[
                this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)
                  ?.invert == 'true'
                  ? 'frontImg'
                  : 'backImg'
              ].indexOf('data:') == -1
                ? $store.state.serverLink
                : ''
            }${
              cards?.[0]?.[
                this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)
                  ?.invert == 'true'
                  ? 'frontImg'
                  : 'backImg'
              ]
            }`"
            v-if="
              cards?.[0]?.[
                this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)
                  ?.invert == 'true'
                  ? 'frontType'
                  : 'backType'
              ] == 'image'
            "
          />
          <p
            v-if="
              cards?.[0]?.[
                this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)
                  ?.invert == 'true'
                  ? 'frontType'
                  : 'backType'
              ] == 'text'
            "
          >
            {{
              cards?.[0]?.[
                this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)
                  ?.invert == "true"
                  ? "frontText"
                  : "backText"
              ] || ""
            }}
          </p>
        </div>
        <div class="o_block o_block--top" style="padding-top: 20px">
          <div style="opacity: 0.5" class="secondaryText">
            Select how well you were able to recall the answer.
          </div>
          <button
            class="text-muted"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('0')"
          >
            0
          </button>
          <button
            class="text-muted"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('1')"
          >
            1
          </button>
          <button
            class="text-muted"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('2')"
          >
            2
          </button>
          <button
            class="text-muted"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('3')"
          >
            3
          </button>
          <button
            class="text-muted"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('4')"
          >
            4
          </button>
          <button
            class="text-muted"
            id="defaultRate"
            style="padding: 5px 10px; margin: 5px; font-size: 2rem"
            @click="rateBtn('5')"
          >
            5
          </button>
          <div style="opacity: 0.5" class="secondaryText">
            0 = not being able to recall an answer
            <br />
            5 = recalling the correct answer without hesitation
          </div>
        </div>
      </div>
    </div>
    <a class="deckBtn">{{
      this.$store.state.userData.getDeckWithId(this.cards?.[0]?.deckId)?.deckName
    }}</a>
  </div>
  <div class="noCard" v-if="cards?.length == 0">
    <div style="position: absolute">
      <p class="mainTxt">You’ve reviewed all active cards</p>
      <p class="mainTxt">keep going!</p>
    </div>
    <div class="mainPart"></div>
  </div>
</template>

<script>
import { shuffle } from "@/services/functions.services.js";
export default {
  name: "Body",
  data() {
    return {
      cards: shuffle(this.$store.state.userData.cards),
      isShow: false,
    };
  },
  methods: {
    showBtn: async function () {
      this.isShow = true;
    },
    rateBtn: async function (number) {
      this.isShow = false;
      var currentCardSave = JSON.parse(JSON.stringify(this.cards?.[0]));
      var percentage =
        number == 5 || number == 4 ? 1 : number == 3 ? 0.75 : number == 2 ? 0.5 : 0.1;
      var calculatedIndex = Number(Math.abs(this.cards.length * percentage).toFixed(0));
      this.cards.insert(calculatedIndex, currentCardSave);
      this.cards = this.cards.filter((e, index) => index != 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.darkmode {
  .topPart,
  .bottomPart {
    background: #242427;
    border-color: white !important;
    .mainTxt {
      color: white !important;
      opacity: 0.7;
    }
    &.bottomPart {
      .text-muted {
        background: #48484c;
        border: 1px solid white;
        color: white !important;
      }
      .secondaryText {
        color: white;
      }
    }
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  z-index: 0;
}
@media (max-width: 800px) {
  .main {
    z-index: 2 !important;
  }
}
.mainTxt > img {
  max-width: 80vw;
  max-height: 70vh;
}
.isShow .topPart .mainTxt > img {
  max-width: 80vw;
  max-height: 25vh;
}
.isShow .bottomPart .mainTxt > img {
  max-width: 80vw;
  max-height: 40vh;
}

.uncollapse {
  height: 100% !important;
  width: 100% !important;
  border-bottom: 5px solid rgba(0, 0, 0, 0.1) !important;
  min-height: 0px !important;
  flex: 0 1 auto !important;
  margin-top: 20px !important;
}
.collapse {
  max-height: 0px !important;
  border: none !important;
  margin: 0 !important;
}
.noCard {
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  align-items: center;
  align-content: center;
  justify-content: center;
}
.noCard .mainPart {
  width: 20vw;
  height: 20vw;
  border-radius: 300px;
}
.mainTxt {
  color: #636b6f;
  font-family: "Rubik";
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  font-size: 32px;
  font-size: calc(20px + 1.3vw);
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
  height: 100%;
  flex: 0;
  justify-content: center;
}
.isShow .topPart .mainTxt {
  font-size: calc(16px + 0.6vw);
}
.isShow .topPart .showBtn {
  display: none;
}
.bottomPart > div {
  align-self: center;
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.bottomPart,
.topPart {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  transition: all 500ms ease !important;
}
.bottomPart .mainTxt {
  color: #636b6f;
  font-family: "Rubik";
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  font-size: 32px;
  font-size: calc(20px + 1.3vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 0;
}
.topPart .showBtn:hover {
  opacity: 1;
}
.topPart .showBtn {
  font-family: "Rubik";
  font-weight: 500;
  line-height: 1.2;
  border: none;
  cursor: pointer;
  background: transparent;
  text-rendering: optimizeLegibility;
  font-size: 24px;
  padding-top: 40px;
  opacity: 0.5;
  color: #636b6f;
  justify-content: center;
}
.main {
  position: relative;
  flex: 1 0 auto;
  text-align: center;
  transition: all 250ms ease !important;
  display: flex;
  height: 100%;
  height: calc(100vh - 80px - 20px);
  flex-direction: column;
  margin: 0 20px;
}
.deckBtn {
  cursor: pointer;
  font-size: calc(12px + 0.3vw);
  bottom: 0;
  left: 0;
  padding: 20px;
  font-family: "Rubik";
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  opacity: 0.5;
  position: absolute;
  color: inherit;
  text-decoration: none;
  transition: all 250ms ease;
}
.deckBtn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.deckBtn:active,
.deckBtn:focus,
.deckBtn:hover {
  opacity: 1;
}
.deckBtn,
.deckBtn:active,
.deckBtn:focus,
.deckBtn:hover {
  color: inherit;
  text-decoration: none;
}
a:focus,
a:hover {
  color: #1e1e1e;
  text-decoration: underline;
}
a:active,
a:hover {
  outline: 0;
}
.mainPart,
.topPart {
  text-align: center;
  flex: 1 1 auto;
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
}
.text-muted {
  color: #777;
  background: #efefef;
  border: 1px solid black;
}
.bottomPart {
  text-align: center;
  align-self: center;
  background-color: #e5e5e5;
  transition: all 500ms ease;
  height: 0%;
}
button {
  appearance: auto;
  -webkit-writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: -internal-light-dark(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: center;
  align-items: flex-start;
  cursor: default;
  box-sizing: border-box;
  background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));
  margin: 0em;
  padding: 1px 6px;
  border-width: 2px;
  border-style: outset;
  border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
  border-image: initial;
}
</style>
