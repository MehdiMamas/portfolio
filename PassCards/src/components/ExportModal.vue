<template>
  <div :class="`modal fade ${$store.state.isExport === true ? 'show' : ''}`">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Export Cards</h3>
        </div>
        <div class="modal-body">
          <h6 style="margin-bottom: 10px; font-size: 13px">
            Export your data.
            <span style="font-weight: 400">
              Copy and Paste your data in a Word, Excel, Google Docs, etc.
            </span>
          </h6>
          <div style="display: flex; flex-direction: row; margin-bottom: 10px">
            <div style="display: flex; flex-direction: column; flex: 1">
              <div>
                <b>Between term and definition</b>
              </div>
              <div>
                <input
                  type="radio"
                  id="atAtOptionExport"
                  v-model="selectedBetweenWordAndDefinitionOption"
                  v-bind:value="'atAtOptionExport'"
                />
                <label for="atAtOptionExport">@@</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="custom1Export"
                  v-model="selectedBetweenWordAndDefinitionOption"
                  v-bind:value="'custom'"
                />
                <label for="custom1Export">
                  <input
                    type="text"
                    placeholder="\t"
                    style="border-top: 0; border-left: 0; border-right: 0"
                    v-model="selectedBetweenWordAndDefinitionCustom"
                  />
                </label>
              </div>
              <div style="margin-top: 20px">
                <input
                  type="checkbox"
                  id="alphabetizeOption"
                  :checked="alphabetizeOption"
                  @input="alphabetizeOptionChange"
                />
                <label for="alphabetizeOption">Alphabetize</label>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; flex: 1">
              <div>
                <b>Between rows </b>
              </div>

              <div>
                <input
                  type="radio"
                  id="andAndOptionExport"
                  v-model="selectedBetweenCardsOption"
                  v-bind:value="'andAndOptionExport'"
                />
                <label for="andAndOptionExport">&&</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="custom2Export"
                  v-model="selectedBetweenCardsOption"
                  v-bind:value="'custom'"
                />
                <label for="custom2Export">
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

          <textarea
            @click="
              $event.target.focus();
              $event.target.select();
            "
            style="min-height: 120px; max-height: 120px; min-width: 100%"
            :readonly="true"
            :value="
              [...$store.state.userData.getDeckWithId($route.params.deckId).cards]
                .sort((a, b) =>
                  this.alphabetizeOption == true
                    ? a.frontText > b.frontText
                      ? 1
                      : -1
                    : 1
                )
                .map((e) => {
                  return e.frontText + selectedBetweenWordAndDefinition + e.backText;
                })
                .join(selectedBetweenCards)
            "
          ></textarea>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="closeExport(this)"
            class="btn btn-dark"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { closeExport } from "@/services/functions.services";

export default {
  watch: {
    selectedBetweenWordAndDefinitionOption() {
      this.selectedBetweenWordAndDefinitionOptionFunction();
    },
    selectedBetweenWordAndDefinitionCustom() {
      this.selectedBetweenWordAndDefinitionOption = "custom";
      this.selectedBetweenWordAndDefinitionOptionFunction();
    },

    selectedBetweenCardsOption() {
      this.selectedBetweenCardsOptionFunction();
    },
    selectedBetweenCardsCustom() {
      this.selectedBetweenCardsOption = "custom";
      this.selectedBetweenCardsOptionFunction();
    },
  },
  data() {
    return {
      alphabetizeOption: false,
      selectedBetweenWordAndDefinitionOption: "atAtOptionExport",
      selectedBetweenWordAndDefinition: "@@",
      selectedBetweenWordAndDefinitionCustom: "",
      selectedBetweenCardsOption: "andAndOptionExport",
      selectedBetweenCards: "&&",
      selectedBetweenCardsCustom: "",
      textareaValue: [
        ...this.$store.state.userData.getDeckWithId(this.$route.params.deckId).cards,
      ]
        .sort((a, b) =>
          this.alphabetizeOption == true ? (a.frontText > b.frontText ? 1 : -1) : 1
        )
        .map((e) => {
          return e.frontText + this.selectedBetweenWordAndDefinition + e.backText;
        })
        .join(this.selectedBetweenCards),
    };
  },
  methods: {
    closeExport,
    alphabetizeOptionChange(e) {
      this.alphabetizeOption = e.target.checked;
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
