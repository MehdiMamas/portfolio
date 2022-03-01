import { createRouter, createWebHashHistory } from "vue-router";
import { UserDataClass } from "@/services/userData.services";
import { fetchF } from "@/services/functions.services.js";
import store from '../store'
import Home from "@/views/Home.vue";
import Decks from "@/views/Decks.vue";
import Settings from "@/views/Settings.vue";
import DeckPreview from "@/views/DeckPreview.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import NoCardPreview from "@/views/DeckPreviewViews/NoCardPreview.vue";
import CardPreview from "@/views/DeckPreviewViews/CardPreview.vue";
import PaymentMethodSettings from "@/views/SettingsViews/PaymentMethod.vue";
import ProfileSettings from "@/views/SettingsViews/Profile.vue";
import SecuritySettings from "@/views/SettingsViews/Security.vue";
import SubscriptionSettings from "@/views/SettingsViews/Subscription.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      auth: true,
    }
  },
  {
    path: "/decks",
    name: "Decks",
    component: Decks,
    meta: {
      auth: true,
    }

  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    redirect: { name: "ProfileSettings" },
    children: [
      {
        path: "profile",
        name: "ProfileSettings",
        component: ProfileSettings,
      },
      {
        path: "security",
        name: "SecuritySettings",
        component: SecuritySettings,
      },
      {
        path: "subscription",
        name: "SubscriptionSettings",
        component: SubscriptionSettings,
      },
      {
        path: "payment",
        name: "PaymentMethodSettings",
        component: PaymentMethodSettings,
      },
      {
        path: "invoices",
        name: "InvoicesSettings",
        component: ProfileSettings,
      },
    ],
    meta: {
      auth: true,
    }

  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      auth: false,
    }

  },
  {
    path: "/ForgotPassword",
    name: "Forgot Password",
    component: ForgotPassword,
    meta: {
      auth: false,
    }

  },

  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      auth: false,
    }

  },
  {
    path: "/deck/:deckId",
    component: DeckPreview,
    children: [
      {
        name: "NoCardPreview",
        path: "",
        component: NoCardPreview,
      },
      {
        name: "CardPreview",
        path: ":cardId",
        component: CardPreview,
      },
    ],
    meta: {
      auth: true,
      checkAvailablity: true,
    }

  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  var callback = function (to, from, next, data) {
    if (to.name == undefined) {
      if (data.isAuth == true) {
        next({ name: "Home" })
      } else {
        next({ name: "Login" })
      }
    } else if (to.meta.auth == true) {
      if (data.isAuth == true) {
        if (to.meta.checkAvailablity == true) {
          if (data.userData.getDeckWithId(to.params.deckId).deckId == null) {
            next({ name: "Decks" })
          } else if (data.userData.getDeckWithId(to.params.deckId).getCardWithId(to.params.cardId).cardId == null) {
            next({ name: "NoCardPreview", params: { deckId: to.params.deckId } })
          } else {
            next()
          }
        } else {
          next()
        }
      } else {
        next({ name: "Login" })
      }
    } else if (to.meta.auth == false) {
      if (data.isAuth == false) {
        next()
      } else {
        next({ name: "Home" })
      }
    }
    store.dispatch("changeData", {
      option: "isLoaded",
      value: true,
    });

  }
  store.dispatch("changeData", {
    option: "isLoaded",
    value: false,
  });
  var isAuth = store.getters.getData("isAuth") || false
  var isInitiated = store.getters.getData("isInitiated") || false
  if (isInitiated == false) {
    fetchF("checkUser", {}, "POST", true, true).then((rsp) => {
      store.dispatch("changeData", {
        option: "isInitiated",
        value: true
      }).then(() => {
        isInitiated = true
        store.dispatch("changeData", {
          option: "isAuth",
          value: rsp.isSuccess
        }).then(() => {
          isAuth = rsp.isSuccess;
          var userData = new UserDataClass(rsp.userData || {})
          store.dispatch("changeData", {
            option: "userData",
            value: userData
          }).then(() => {
            callback(to, from, next, { isAuth, userData })
          })
        })
      })
    });
  } else {
    callback(to, from, next, { isAuth, userData: store.getters.getData("userData") || {} })
  }
})

export default router;
