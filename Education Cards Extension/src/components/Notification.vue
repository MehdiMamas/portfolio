<template>
  <div
    :class="`
    toast show mb-1 
    ${clicked == true || this.clicked == true ? 'fading' : ''}
    ${notification.type == 'error' ? 'bg-danger' : ''} 
    ${notification.type == 'success' ? 'bg-success' : ''}
    `"
    v-if="notification.notificationId != null && notification.isVisible != false"
    :notification-id="notification.notificationId"
    style="color: #ffffffc7"
  >
    <div style="flex: 1; display: flex; justify-content: flex-end">
      <div class="toast-body" style="flex: 1">{{ notification.text }}</div>
      <button
        type="button"
        class="ml-2 close"
        style="margin: 0; border: 0; background: #ffffff50"
        @click.prevent="closePopup"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      clicked: false,
      notification: this.$store.state.notifications.filter(
        (e) => e.notificationId == this.notificationId
      )[0],
      closingTimeOut: setTimeout(() => {
        this.clicked = true;
        var _this = this;
        setTimeout(() => {
          _this.notification.isVisible = false;
        }, 500);
      }, 3000),
    };
  },
  props: {
    notificationId: String,
  },
  methods: {
    closePopup() {
      this.clicked = true;
      var _this = this;
      clearTimeout(this.closingTimeOut);
      setTimeout(() => {
        _this.notification.isVisible = false;
        _this.clicked = false;
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.toast {
  opacity: 1;
  transition: all 500ms ease;
  z-index: 1000;
  &.fading {
    opacity: 0;
  }
}
</style>
