<template>
  <nav
    :class="`navbar navbar-default ${
      isHamburgerToggeled == true ? 'hamburgerToggled' : ''
    } ${isPhotoToggled == true ? 'profileToggled' : ''}`"
  >
    <div class="navFirstPart">
      <a @click.prevent="goToHomePage">
        <img src="./assets/logo.png" alt="Logo" />
      </a>
      <div class="hamburger">
        <button @click="toggleHamburger" type="button" class="navbar-toggle collapsed">
          <span class="sr-only">Toggle Navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
    </div>
    <div class="navSecondPart" v-if="$store.state.isAuth == false">
      <div class="rightSideNavBar">
        <router-link :to="{ name: 'Login' }">
          <li>Login</li>
        </router-link>
        <router-link :to="{ name: 'Register' }">
          <li>Register</li>
        </router-link>
      </div>
    </div>
    <div class="navSecondPart" v-if="$store.state.isAuth == true">
      <div class="leftSideNavBar">
        <a @click.prevent="goToHomePage">
          <li>Home</li>
        </a>
      </div>
      <div class="rightSideNavBar">
        <router-link :to="{ name: 'Decks' }">
          <li><faicon icon="folder-open" style="margin-right: 5px" /> Decks</li>
        </router-link>
        <li @click="toggleSettings" class="profilePic">
          <a
            @click.prevent=""
            data-toggle="dropdown"
            role="button"
            aria-expanded="true"
            class="dropdown-toggle"
          >
            <img
              :src="`${
                $store.state.userData.userPic?.indexOf('data:') == -1
                  ? $store.state.serverLink
                  : ''
              }${$store.state.userData.userPic}`"
              class="userPhoto" />
            <span class="caret"></span
          ></a>
        </li>
        <ul
          role="menu"
          id="settingsPopup"
          :class="`dropdown-menu noOpacityChange ${isPhotoToggled == true ? 'show' : ''}`"
        >
          <li class="dropdown-header noOpacityChange">Settings</li>
          <router-link :to="{ name: 'Settings' }">
            <li><faicon icon="cog" style="margin-right: 5px" />Your Settings</li>
          </router-link>
          <li class="divider"></li>
          <li @click="logOutBtn">
            <faicon icon="sign-out-alt" style="margin-right: 5px" />Logout
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { logOut } from "@/services/functions.services";
export default {
  name: "Header",
  data() {
    return {
      isHamburgerToggeled: false,
      isPhotoToggled: false,
    };
  },
  mounted() {
    var _this = this;
    document.addEventListener("mousedown", function (e) {
      var element = e.target;
      if (window.innerWidth != 768) {
        if (document.querySelector("#settingsPopup.show") != null) {
          while (
            element.parentElement != null &&
            !(
              element.parentElement.id == "settingsPopup" ||
              element.parentElement.className.indexOf("profilePic") != -1
            )
          ) {
            element = element.parentElement;
          }
          if (element.parentElement == null) {
            _this.toggleSettings();
          }
        }
        if (document.querySelector(".modal.fade.show") != null) {
          while (
            element.parentElement != null &&
            !(
              element.parentElement.className.indexOf(
                "modal-dialog modal-dialog-centered"
              ) != -1
            )
          ) {
            element = element.parentElement;
          }
          if (element.parentElement == null) {
            document.querySelector(".modal.fade.show [data-dismiss='modal']").click();
          }
        }
      }
    });
  },
  methods: {
    goToHomePage: function () {
      if (this.$store.state.isAuth == false) {
        return;
      }
      this.$router.push({ name: "Home" });
    },
    logOutBtn: function () {
      logOut(this);
      this.isPhotoToggled = false;
    },
    toggleHamburger: function () {
      this.isHamburgerToggeled = !this.isHamburgerToggeled;
    },
    toggleSettings: function () {
      this.isPhotoToggled = !this.isPhotoToggled;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.darkmode {
  .navbar {
    li {
      color: white !important;
    }
    [role="menu"] {
      background-color: #474747;
    }
    &.profileToggled {
      .profilePic {
        background: #474747;
      }
    }
    .userPhoto {
      border: 1px solid white !important;
    }
  }
}
</style>
<style scoped>
@import "./assets/bootstrap.min.css";
[role="menu"] {
  right: 0;
  opacity: 1;
  background: white;
  right: 0;
  top: 70px;
}
a {
  text-decoration: none;
}
[role="menu"] > li {
  padding: 0 !important;
}
.userPhoto {
  height: 50px;
  width: 50px;
  border-radius: 25px;
  border: 1px solid black;
  padding: 2px;
}
.navSecondPart > .leftSideNavBar {
  justify-content: flex-start;
}
.navSecondPart > .rightSideNavBar {
  justify-content: flex-end;
}
.navSecondPart > .rightSideNavBar {
  padding: 0px !important;
}
nav.profileToggled .profilePic {
  background: #e7e7e7;
  opacity: 0.5;
}
nav.profileToggled .profilePic:hover {
  opacity: 1;
}
.leftSideNavBar {
  padding-left: 20px !important;
}
@media (max-width: 768px) {
  .leftSideNavBar {
    width: 100%;
    padding: 0px !important;
  }
  .profilePic:hover {
    opacity: 1 !important;
  }
  .rightSideNavBar {
    width: 100%;
  }
  [role="menu"] {
    display: flex;
    flex-direction: column;
    position: unset;
    border: none;
    width: 100%;
    background: none;
    align-items: flex-start;
  }

  [role="menu"] > * {
    text-align: left;
    width: 100%;
  }
  .hamburger {
    display: flex !important;
  }
  .leftSideNavBar {
    padding-bottom: 0px !important;
  }
  .rightSideNavBar {
    padding-top: 0px !important;
  }
  .navSecondPart > div > *:not(.noOpacityChange):not(ul) {
    width: 100%;
    opacity: 0.5;
    transition: all 500ms ease;
  }
  .navSecondPart > div > *:not(.noOpacityChange):not(ul):hover {
    opacity: 1;
  }
  .dropdown-menu {
    background: none !important;
    z-index: 1;
  }
  .main {
    z-index: 2 !important;
    padding: 0 20px;
  }
  nav {
    height: 80px;
    overflow: hidden;
  }
  nav.hamburgerToggled {
    height: 259px;
  }
  nav.hamburgerToggled.profileToggled {
    height: 423px;
  }
  nav.hamburgerToggled .navSecondPart,
  nav.hamburgerToggled .navSecondPart > div {
    flex-direction: column;
    flex: 0;
  }
  nav .navFirstPart {
    border-bottom: 1px solid #acacac !important;
  }
  nav .navSecondPart,
  nav .navSecondPart > div {
    flex-direction: column;
    flex: 0;
  }
  .navbar {
    transition: all 500ms ease;
    justify-content: flex-start;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    flex-direction: column;
  }
  .navSecondPart {
    list-style-type: none !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  .navFirstPart {
    display: flex;
    width: 100%;
    flex: 0 !important;
    align-items: center;
    justify-content: space-between;
  }
}

.navSecondPart > div {
  align-items: center;
  padding: 14px;
  color: #777;
  position: relative;
  cursor: pointer;
  font-family: "Aileron";
}
.navFirstPart {
  display: flex;
  flex: 0;
}
[alt="Logo"] {
  flex: 0;
}

.dropdown-menu .divider {
  height: 1px;
  margin: 10px 0;
  background-color: #e4ecf2;
  padding: 0;
}
.navbar .dropdown-header {
  font-weight: 700;
  margin-bottom: 5px;
  padding: 0px 10px !important;
  margin: 0px;
  font-size: 12px;
}
.dropdown-menu > li:not([class]) {
  padding: 14px !important;
  opacity: 0.5;
  transition: all 500ms ease;
}
.dropdown-menu > li:not([class]):hover {
  opacity: 1;
}
.navSecondPart li {
  padding: 14px;
  color: #777;
  cursor: pointer;
  font-size: 14px;
  transition: all 500ms ease;
  font-weight: 400;
  font-family: "Aileron";
}
.navSecondPart li:not(.noOpacityChange):not(ul) {
  opacity: 0.5;
  transition: all 500ms ease;
  color: #777;
  text-decoration: none;
}
.innerFullWidth > * {
  width: 100%;
}
.navSecondPart li:not(.noOpacityChange):not(ul):hover {
  opacity: 1;
  transition: all 500ms ease;
}

.dropdown-header,
.dropdown-menu > li > a {
  display: block;
  padding: 3px 20px;
  white-space: nowrap;
}
.dropdown-header {
  font-size: 12px;
  line-height: 1.6;
  color: #4b5154;
}
.dropdown-header {
  display: block;
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  color: #6c757d;
  white-space: nowrap;
}
.navSecondPart > div {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
.navSecondPart {
  display: flex;
  align-items: center;
  flex: 1;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.hamburger,
.navbar-brand,
.navbar-nav > li > a {
  height: 80px;
}
.hamburger {
  display: none;
}

.hamburger,
.navbar-brand,
.navbar-nav > li > a {
  display: -ms-flexbox;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}
.navbar-brand,
.navbar-nav > li > a {
  display: flex;
}
.navbar-default .navbar-toggle {
  border-color: #ddd;
}
.navbar-toggle .icon-bar + .icon-bar {
  margin-top: 4px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.navbar-default .navbar-toggle .icon-bar {
  background-color: #888;
}
.navbar-toggle .icon-bar {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 1px;
}
.btn-upload,
.carousel-inner,
.collapsing,
.dropdown-menu .divider,
.embed-responsive,
.media,
.media-body,
.modal,
.modal-open,
.nav .nav-divider,
.panel,
.progress,
.sr-only {
  overflow: hidden;
}
.navbar-toggle {
  position: relative;
  float: right;
  padding: 9px 10px;
  margin-right: 0;
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
nav {
  background-color: transparent;
  border: none;
  padding: 0 20px;
  height: 80px;
  text-align: center;
}
[alt="Logo"] {
  transition: all 500ms ease;
  height: 40px;
  cursor: pointer;
}
</style>
