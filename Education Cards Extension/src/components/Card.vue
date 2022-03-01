<template>
  <router-link
    :class="`deckCard ${
      $route.params.cardId ==
      $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
        .cardId
        ? 'active'
        : ''
    }`"
    :to="{
      name: 'CardPreview',
      params: {
        cardId: $store.state.userData
          .getDeckWithId($route.params.deckId)
          .getCardWithId(cardId).cardId,
      },
    }"
  >
    <img
      :src="`${
        this.$store.state.userData
          .getDeckWithId($route.params.deckId)
          .getCardWithId(cardId)
          ?.frontImg?.indexOf('data:') == -1
          ? $store.state.serverLink
          : ''
      }${
        $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
          ?.frontImg
      }`"
      v-if="
        $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
          ?.frontType == 'image'
      "
      alt=""
      style="max-height: 50px !important"
    />
    <span
      v-if="
        $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
          ?.frontType == 'text' &&
        $store.state.userData
          .getDeckWithId($route.params.deckId)
          .getCardWithId(cardId)
          ?.frontText?.trim() != ''
      "
      >{{
        $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
          .frontText
      }}</span
    >
    <span
      v-if="
        $store.state.userData.getDeckWithId($route.params.deckId).getCardWithId(cardId)
          ?.frontType == 'text' &&
        $store.state.userData
          .getDeckWithId($route.params.deckId)
          .getCardWithId(cardId)
          ?.frontText?.trim() == ''
      "
    >
      Your new card
    </span>
    <div class="actions">
      <faicon
        @click.prevent="
          deleteCard(
            $store.state.userData
              .getDeckWithId($route.params.deckId)
              .getCardWithId(cardId)
          )
        "
        icon="trash-alt"
      />
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Card",
  data() {
    return {
      currentCard: this.$store.state.userData
        .getDeckWithId(this.$route.params.deckId)
        .getCardWithId(this.cardId),
    };
  },
  methods: {},
  props: {
    clickAddBtn: Function,
    deleteCard: Function,
    cardId: String,
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  .deckCard:not(.active):hover {
    background-color: #35353a !important;
  }
  .active {
    background-color: #1b1c21 !important;
  }
}
</style>
<style scoped>
.addNewCardBtn {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
  line-height: 1.4;
  border: 1px solid #ccd0d2;
  text-align: left;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  color: #636b6f;
  text-decoration: none;
  font-family: "Rubik";
  font-weight: 500;
  background: #d9d9d9;
  font-size: 14px;
  position: absolute;
  bottom: 0;
}
.addNewCardBtn:hover {
  background: #cecece;
}
.deckCard {
  width: 100%;
  margin: 0;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: fit-content;
  padding: 10px;
  color: #636b6f;
  text-decoration: none;
  font-family: "Rubik";
  font-weight: 500;
  font-size: 14px;
}
.deckCard:not(.active):hover {
  background: #d9d9d9;
}
.deckCard.active {
  background: white;
}
a {
  display: flex;
}
a .actions {
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
}
</style>
