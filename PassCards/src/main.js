import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faBell,
  faFolderOpen,
  faPaperPlane,
  faCog,
  faSignOutAlt,
  faSearch,
  faUpload,
  faPen,
  faTrashAlt,
  faPlus,
  faCheckSquare,
  faDownload,
  faTimes,
  faSignInAlt,
  faLock,
  faShoppingBag,
  faCreditCard,
  faHistory,
  faStar,
  faMapMarker,
  faMoon,
  faSun
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import store from "@/store";
import router from "@/router";
import App from "@/App.vue";
library.add(faFolderOpen);
library.add(faStar);
library.add(faBell);
library.add(faPaperPlane);
library.add(faCog);
library.add(faSignOutAlt);
library.add(faSearch);
library.add(faDownload);
library.add(faUpload);
library.add(faPen);
library.add(faPlus);
library.add(faTrashAlt);
library.add(faCheckSquare);
library.add(faTimes);
library.add(faSignInAlt);
library.add(faEdit);
library.add(faLock);
library.add(faShoppingBag);
library.add(faCreditCard);
library.add(faHistory);
library.add(faMapMarker);
library.add(faMoon);
library.add(faSun);

var app = createApp(App);
app.use(router);
app.use(store);
app.component("faicon", FontAwesomeIcon);
app.mount("#app");
