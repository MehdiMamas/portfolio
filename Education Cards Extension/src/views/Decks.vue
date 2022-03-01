<template>
  <div class="main">
    <div class="row">
      <div class="col-md-5">
        <h1 style="margin-bottom: 20px" class="myDecksHeader">My decks</h1>
      </div>
      <div class="col-md-7 text-right">
        <div
          style="
            margin: 0.5em 0px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          "
        >
          <input
            type="text"
            placeholder="Search..."
            class="searchingInput"
            v-model="searchDeckName"
          />
          <faicon
            icon="search"
            style="position: absolute; right: calc(3.5rem * 0.5)"
          ></faicon>
        </div>
      </div>
      <Deck
        :isAdd="false"
        :deckId="item.deckId"
        v-for="item in $store.state.userData?.decks.filter(
          (e) => e.deckName.toLowerCase().indexOf(searchDeckName.toLowerCase()) == 0
        ) || []"
        :key="item.deckId"
      />
      <Deck
        :isAdd="true"
        deckId=""
        v-if="
          !(
            ($store.state.userData?.isSubscribed == false) &
            ($store.state.userData?.decks?.length >=
              $store.state.userData?.decks_available)
          )
        "
      />
      <Deck
        :isFull="true"
        deckId=""
        v-if="
          ($store.state.userData?.isSubscribed == false) &
          ($store.state.userData?.decks?.length >= $store.state.userData?.decks_available)
        "
      />
    </div>
  </div>
</template>

<script>
import Deck from "@/components/Deck.vue";
import { openImport } from "@/services/functions.services.js";
export default {
  name: "Body",
  components: {
    Deck,
  },
  methods: {
    openImport,
  },
  data() {
    return {
      searchDeckName: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.darkmode {
  .myDecksHeader {
    color: rgb(199, 199, 199) !important;
  }
  .searchingInput {
    background: #1b1c21;
    color: white !important;
    outline: none !important;
  }
}
</style>
<style scoped>
.main {
  margin: 0 20px;
}
.searchingInput {
  background: #ffffff;
  border: 1px solid black;
  border-radius: 5px;
  padding: 11px;
}

.main > div > div:nth-child(1) > h1 {
  font-size: calc(20px + 1.3vw);
  font-family: Rubik, sans-serif;
  font-weight: 500;
  line-height: 1.2;
  text-rendering: optimizeLegibility;
  color: #636b6f;
}
.main > div > div:nth-child(2) > button {
  margin: 0.5em 0px;
  float: right;
  opacity: 0.7;
}
.main > div > div:nth-child(2) > button:nth-child(1) {
  margin-left: 5px !important;
}
</style>
