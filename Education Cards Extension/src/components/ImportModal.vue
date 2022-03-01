<template>
  <div :class="`modal fade ${$store.state.isImport === true ? 'show' : ''}`">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Import Cards</h3>
        </div>
        <div class="modal-body">
          <h6 style="margin-bottom: 10px; font-size: 13px">
            Import your data.
            <span style="font-weight: 400">
              Copy and Paste your data here (from Quizlet, Word, Excel, Google Docs, etc.)
            </span>
          </h6>
          <textarea
            style="min-height: 120px; max-height: 120px; min-width: 100%"
            v-model="textareaText"
            :placeholder="
              [
                ['Word 1', 'Definition 1'].join(
                  selectedBetweenWordAndDefinitionOption == 'custom'
                    ? selectedBetweenWordAndDefinition
                    : '@@'
                ),
                ['Word 2', 'Definition 2'].join(
                  selectedBetweenWordAndDefinitionOption == 'custom'
                    ? selectedBetweenWordAndDefinition
                    : '@@'
                ),
                ['Word 3', 'Definition 3'].join(
                  selectedBetweenWordAndDefinitionOption == 'custom'
                    ? selectedBetweenWordAndDefinition
                    : '@@'
                ),
              ].join(selectedBetweenCardsOption == 'custom' ? selectedBetweenCards : '&&')
            "
          ></textarea>
          <div style="display: flex; flex-direction: row">
            <div style="display: flex; flex-direction: column; flex: 1">
              <div>
                <b>Between term and definition</b>
              </div>
              <div>
                <input
                  type="radio"
                  id="atAtOption"
                  v-model="selectedBetweenWordAndDefinitionOption"
                  v-bind:value="'atAtOption'"
                />
                <label for="atAtOption">@@</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="custom1"
                  v-model="selectedBetweenWordAndDefinitionOption"
                  v-bind:value="'custom'"
                />
                <label for="custom1">
                  <input
                    type="text"
                    placeholder="\t"
                    style="border-top: 0; border-left: 0; border-right: 0"
                    v-model="selectedBetweenWordAndDefinitionCustom"
                  />
                </label>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; flex: 1">
              <div>
                <b>Between rows </b>
              </div>

              <div>
                <input
                  type="radio"
                  id="andAndOption"
                  v-model="selectedBetweenCardsOption"
                  v-bind:value="'andAndOption'"
                />
                <label for="andAndOption">&&</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="custom2"
                  v-model="selectedBetweenCardsOption"
                  v-bind:value="'custom'"
                />
                <label for="custom2">
                  <input
                    type="text"
                    style="border-top: 0; border-left: 0; border-right: 0"
                    placeholder="\n"
                    v-model="selectedBetweenCardsCustom"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="closeImport(this)"
            class="btn btn-dark"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            id="importBtn"
            :disabled="cardsExported.cards.length == 0"
            @click="importSubmit(this)"
            class="btn btn-dark"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { closeImport, importSubmit } from "@/services/functions.services";

export default {
  data() {
    return {
      cardsExported: { deckName: "", cards: [] },
      textareaText: "",
      selectedBetweenWordAndDefinitionOption: "atAtOption",
      selectedBetweenWordAndDefinition: "@@",
      selectedBetweenWordAndDefinitionCustom: "",
      selectedBetweenCardsOption: "andAndOption",
      selectedBetweenCards: "&&",
      selectedBetweenCardsCustom: "",
    };
  },
  watch: {
    textareaText() {
      this.textAreaFunctionWatch();
    },
    selectedBetweenWordAndDefinitionOption() {
      this.selectedBetweenWordAndDefinitionOptionFunction();
      this.textAreaFunctionWatch();
    },
    selectedBetweenWordAndDefinitionCustom() {
      this.selectedBetweenWordAndDefinitionOption = "custom";
      this.selectedBetweenWordAndDefinitionOptionFunction();
      this.textAreaFunctionWatch();
    },

    selectedBetweenCardsOption() {
      this.selectedBetweenCardsOptionFunction();
      this.textAreaFunctionWatch();
    },
    selectedBetweenCardsCustom() {
      this.selectedBetweenCardsOption = "custom";
      this.selectedBetweenCardsOptionFunction();
      this.textAreaFunctionWatch();
    },
  },
  methods: {
    closeImport,
    importSubmit,
    textAreaFunctionWatch() {
      var _this = this;
      this.cardsExported.cards = this.textareaText
        .split(this.selectedBetweenCards)
        .filter(
          (e) =>
            e.split(_this.selectedBetweenWordAndDefinition)?.[0]?.trim() != "" &&
            e.split(_this.selectedBetweenWordAndDefinition)?.[1]?.trim() != ""
        )
        .map((e) => {
          return {
            frontText: e.split(_this.selectedBetweenWordAndDefinition)[0],
            backText: e.split(_this.selectedBetweenWordAndDefinition)[1],
            frontType: "text",
            backType: "text",
          };
        });
    },
    selectedBetweenWordAndDefinitionOptionFunction() {
      this.selectedBetweenWordAndDefinition =
        this.selectedBetweenWordAndDefinitionOption == "custom"
          ? this.selectedBetweenWordAndDefinitionCustom
              .replace(/\\n/g, "\n")
              .replace(/\\t/g, "\t") || "@@"
          : "@@";
    },
    selectedBetweenCardsOptionFunction() {
      this.selectedBetweenCards =
        this.selectedBetweenCardsOption == "custom"
          ? this.selectedBetweenCardsCustom.replace(/\\n/g, "\n").replace(/\\t/g, "\t") ||
            "&&"
          : "&&";
    },
  },
};
</script>
<style lang="scss" scoped>
label {
  padding-left: 10px;
}
</style>
