<template>
  <div :class="`modal fade ${$store.state.confirmationText?.trim() != '' ? 'show' : ''}`">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $store.state.confirmationTitle || "Confirmation" }}</h3>
        </div>
        <div class="modal-body">
          <h6 style="margin-bottom: 10px; font-size: 13px">
            {{ $store.state.confirmationText }}
          </h6>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="closeCancel(this)"
            class="btn btn-dark"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" @click="submitCancel(this)" class="btn btn-dark">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { closeCancel, submitCancel } from "@/services/functions.services";

export default {
  methods: {
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
