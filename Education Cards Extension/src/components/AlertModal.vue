<template>
  <div :class="`modal fade ${$store.state.alertEl.trim() != '' ? 'show' : ''}`">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content" @blur.prevent="closeAdvancedAlert(this)">
        <div class="modal-body">{{ $store.state.alertEl }}</div>
        <div class="modal-footer">
          <button
            type="button"
            @click="closeAdvancedAlert(this)"
            class="btn btn-secondary"
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
import { closeCancel, submitCancel } from "@/services/functions.services";
import { closeAdvancedAlert } from "@/services/functions.services";

export default {
  methods: {
    closeAdvancedAlert,
    closeCancel,
    submitCancel,
  },
};
</script>
<style lang="scss" scoped>
label {
  padding-left: 10px;
}
</style>
