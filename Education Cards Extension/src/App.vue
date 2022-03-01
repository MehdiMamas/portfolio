<template>
  <div
    style="height: 100vh"
    :class="`${
      $store.state.isDarkModeEnabled == true && $store.state.userData.isSubscribed == true
        ? 'darkmode'
        : ''
    }`"
  >
    <div v-if="$store.state.isLoaded == true">
      <Header />
      <router-view />
      <spans
        v-if="$store.state.userData.isSubscribed == true"
        @click.prevent="toggleDarkMode"
        class="darkModeBtn"
        :style="`
          background: ${$store.state.isDarkModeEnabled ? 'white' : '#343438'};
          color: ${$store.state.isDarkModeEnabled ? '#343438' : 'white'};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        `"
      >
        <faicon
          :icon="$store.state.isDarkModeEnabled == false ? 'moon' : 'sun'"
          style="font-size: 20px"
        />
      </spans>
    </div>
    <AlertModal />
    <CancelModal />
    <ImportModal />
    <ExportModal />
    <div
      id="notifications"
      style="position: fixed; z-index: 1000; bottom: 10px; right: 10px; width: 300px"
    >
      <Notification
        v-for="(item, index) in $store.state.notifications"
        :key="index"
        :notificationId="item.notificationId"
      />
    </div>
    <div
      v-if="$store.state.isLoaded == false"
      style="
        display: flex;
        place-content: center;
        width: 100vw;
        align-items: center;
        height: 100vh;
        justify-content: center;
        align-content: center;
      "
    >
      <img src="./assets/loader.gif" style="width: 200px" alt="" />
    </div>
  </div>
</template>

<script>
document.addEventListener("keypress", function (e) {
  if (e.keyCode == 32) {
    if (document.querySelector("#showBtn") == null) {
      if (document.querySelector("#defaultRate") != null) {
        e.preventDefault();
        document.querySelector("#defaultRate").click();
      }
    } else {
      e.preventDefault();
      document.querySelector("#showBtn").click();
    }
  }
});

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
import {
  selectFileToImport,
  getLocalStorage,
  setLocalStorage,
  closeImport,
  importSubmit,
} from "@/services/functions.services";
import Header from "@/Header.vue";
import Notification from "@/components/Notification.vue";
import ImportModal from "@/components/ImportModal.vue";
import ExportModal from "@/components/ExportModal.vue";
import CancelModal from "@/components/CancelModal.vue";
import AlertModal from "@/components/AlertModal.vue";

export default {
  name: "App",
  methods: {
    closeImport,
    importSubmit,
    selectFileToImport,
    toggleDarkMode() {
      var _this = this;
      setLocalStorage("isDarkModeEnabled", !_this.$store.state.isDarkModeEnabled);
      _this.$store.dispatch("changeData", {
        option: "isDarkModeEnabled",
        value: !_this.$store.state.isDarkModeEnabled,
      });
    },
  },
  components: {
    Header,
    Notification,
    ImportModal,
    CancelModal,
    AlertModal,
    ExportModal,
  },
};
</script>

<style lang="scss">
.darkModeBtn {
  position: fixed;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
.darkmode {
  &,
  & > div:not(.modal) {
    background-color: #35363a !important;
  }
  .modal-content {
    background-color: #1b1c21;
    color: white;
  }
}
</style>
<style>
.modal .close {
  border: none;
  background: none;
}
.modal {
  background: rgba(0, 0, 0, 0.379);
}
.modal.show {
  display: block;
}
@import "./assets/bootstrap.min.css";
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-Light.ttf");
  font-weight: 300;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-Regular.ttf");
  font-weight: 400;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-Medium.ttf");
  font-weight: 500;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-SemiBold.ttf");
  font-weight: 600;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-Bold.ttf");
  font-weight: 700;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-ExtraBold.ttf");
  font-weight: 800;
}
@font-face {
  font-family: "Rubik";
  src: url("./assets/RubikFont/Rubik-Black.ttf");
  font-weight: 900;
}
@font-face {
  font-family: "Aileron";
  src: url("./assets/AileronFont/Aileron-Light.otf");
  font-weight: 300;
}
@font-face {
  font-family: "Aileron";
  src: url("./assets/AileronFont/Aileron-Regular.otf");
  font-weight: 400;
}
@font-face {
  font-family: "Aileron";
  src: url("./assets/AileronFont/Aileron-SemiBold.otf");
  font-weight: 600;
}
@font-face {
  font-family: "Aileron";
  src: url("./assets/AileronFont/Aileron-Bold.otf");
  font-weight: 700;
}
@font-face {
  font-family: "Aileron";
  src: url("./assets/AileronFont/Aileron-Black.otf");
  font-weight: 900;
}

html {
  overflow-x: hidden;
}
body {
  background-color: #f5f5f5;
}
</style>
