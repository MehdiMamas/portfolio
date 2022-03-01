export class DeckClass {
    userId = ""
    deckName = ""
    deckId = null
    type = ""
    isActive = ""
    date = ""
    cards = []
    constructor(userData = {}) {
        for (let i = 0; i < Object.keys(userData).length; i++) {
            var userDataKey = Object.keys(userData)[i];
            this[userDataKey] = userData[userDataKey];
        }
    }
    getCardWithId(cardId) {
        return this.cards.filter((e) => e.cardId == cardId)[0] || { cardId: null };
    }
    deleteCardWithId(cardId) {
        this.cards = this.cards.filter((e) => e.cardId != cardId);
    }
    addCard(card) {
        this.cards.push(card);
    }
}
export class UserDataClass {
    userId = null;
    decks = [];
    userPic = "";
    email = "";
    cardsNum = 0;
    subscribed = false;
    constructor(userData = {}) {
        for (let i = 0; i < Object.keys(userData).length; i++) {
            var userDataKey = Object.keys(userData)[i];
            if (userDataKey == "decks") {
                this[userDataKey] = userData[userDataKey].map((e, index) => {
                    return new DeckClass(e);
                });
            } else {
                this[userDataKey] = userData[userDataKey];
            }
        }
    }
    getCardWithId(deckId, cardId) {
        return this.getDeckWithId(deckId).getCardWithId(cardId)
    }
    deleteCardWithId(deckId, cardId) {
        this.getDeckWithId(deckId).deleteCardWithId(cardId)
    }
    addCard(deckId, card) {
        this.getDeckWithId(deckId).addCard(card)
    }

    getDeckWithId(deckId) {
        var decks = this.decks || [];
        return (
            decks.filter((e) => e.deckId == deckId)[0] || new DeckClass({})
        );
    }
    deleteDeckWithId(deckId) {
        this.decks = this.decks.filter((e) => e.deckId != deckId);
    }
    addDeck(deck) {
        if (this.getDeckWithId(deck.deckId).deckId == null) {
            this.decks.push(new DeckClass(deck));
        }
    }
}
export default new UserDataClass({});
