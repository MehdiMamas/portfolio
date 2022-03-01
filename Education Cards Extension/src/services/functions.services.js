import { UserDataClass } from "@/services/userData.services";
import store from "@/store"
import router from "@/router"

export function logOut(_this) {
  setLocalStorage("access_token", "");
  setLocalStorage("refresh_token", "");
  _this.$store.dispatch("changeData", {
    option: "isAuth",
    value: false,
  });
  _this.$store.dispatch("changeData", {
    option: "userData",
    value: new UserDataClass({}),
  });
  var isLogin =
    _this.$route.name == "Login" ||
    _this.$route.name == "Register" ||
    _this.$route.name == "Forgot Password";
  if (isLogin == false) {
    _this.$router.push({ name: "Login" });
  }
}
export async function toggleActive(e, _this) {
  e.preventDefault();
  var deckId = _this.deckId || _this.$route.params.deckId;
  var value =
    _this.$store.state.userData.getDeckWithId(deckId).isActive == "active"
      ? "inactive"
      : "active";
  if (_this.$store.state.isActiveAble == true) {
    var alreadyActive =
      _this.$store.state.userData.decks.filter((e) => e.isActive == "active").length > 0;
    _this.$store.dispatch("changeData", {
      option: "cancelPayload",
      value: { deckId, value },
    });
    if (alreadyActive == true && value == "active") {
      openCancel(
        _this,
        "This deck will be combined with other active deck for review. Do you want to do this?"
      );
    } else {
      toggleActivateSuccess(_this);
    }
  } else {
    _this.$store.dispatch("changeData", {
      option: "notifications",
      value: [
        ..._this.$store.state.notifications,
        {
          notificationId: getRandomString(),
          text: "Another activation toggle is processing, please wait...",
          type: "error",
        },
      ],
    });
  }
}
export function shuffle(array = []) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
export async function deleteDeck(_this) {
  var rsp = { isSuccess: false };
  rsp = await fetch(
    _this,
    "deleteDeck",
    {
      deckId: _this.$store.state.tempData.deckId,
    },
    "POST",
    true,
    true
  );
  if (rsp.isSuccess == true) {
    _this.$store
      .dispatch("changeData", {
        option: "userData",
        value: new UserDataClass(rsp.userData || {}),
      })
      .then(() => {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "Deck deleted successfully",
              type: "success",
            },
          ],
        });
      });
  } else {
    _this.$store.dispatch("changeData", {
      option: "notifications",
      value: [
        ..._this.$store.state.notifications,
        {
          notificationId: getRandomString(),
          text: rsp.err,
          type: "error",
        },
      ],
    });
  }

}
export function fetchF(link, body, method, isTokenNeeded = true, isJSON = true) {
  return new Promise(async (resolve, reject) => {
    var access_token = getLocalStorage("access_token");
    var refresh_token = getLocalStorage("refresh_token");
    var serverLink = store.getters.getData("serverLink")
    if (!(access_token == null && refresh_token == null) || isTokenNeeded == false) {
      fetch(`${serverLink}/${link}`, {
        method,
        headers: {
          authorization: `Bearer ${access_token} ${refresh_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: method == "GET" ? null : JSON.stringify(body),
      }).then((response) => response[isJSON == true ? "json" : "text"]()).then(rsp => {
        setLocalStorage("access_token", rsp.access_token);
        setLocalStorage("refresh_token", rsp.refresh_token);
        resolve(rsp);
      }).catch(error => {
        setLocalStorage("access_token", "");
        setLocalStorage("refresh_token", "");
        store.dispatch("changeData", {
          option: "alertEl",
          value: "Please log in, and try again",
        });
        return resolve({ isSuccess: false, err: "Please log in, and try again" });
      })
    } else {
      if (!(access_token == null && refresh_token == null) && isTokenNeeded == true) {
        store.dispatch("changeData", {
          option: "alertEl",
          value: "Please log in, and try again",
        });
      }
      return resolve({ isSuccess: false, err: "Please log in, and try again" });
    }
  });
}

export function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export function getRandomString() {
  return `${makeid(5)}-${new Date().getTime()}-${makeid(5)}`;
}
export function closeAdvancedAlert(_this) {
  if (_this.$store.state.alertEl == "You logged in successfully") {
    if (
      (_this.$store.state.userData?.cards?.length || 0) > 0 &&
      _this.$route.name != undefined
    ) {
      _this.$router.push({ name: "Home" });
    } else {
      _this.$router.push({ name: "Decks" });
    }
  }
  if (_this.$store.state.alertEl == "Coudn't create your access token please try again") {
    _this.$router.push({ name: "Login" });
  }
  if (_this.$store.state.alertEl == "Account created successfully") {
    _this.$router.push({ name: "Decks" });
  }
  if (
    _this.$store.state.alertEl == "Please log in, and try again" ||
    _this.$store.state.alertEl == "Your login token is expired, please login again" ||
    _this.$store.state.alertEl ==
    "Your account has been deleted successfully, It is very sad to see you leave :("
  ) {
    logOut(_this);
  }
  _this.$store.dispatch("changeData", {
    option: "alertEl",
    value: "",
  });
}
export function selectFileToImport(e, _this) {
  var isSelected = false;
  if (e.target.files.length > 0) {
    isSelected = true;
  }
  if (isSelected == false) {
    document.querySelector("#importBtn").setAttribute("disabled", "true");
  } else {
    document.querySelector("#importBtn").removeAttribute("disabled");
  }
  _this.$store.dispatch("changeData", {
    option: "isFileSelected",
    value: isSelected,
  });
}
export async function importSubmit(_this) {
  var results = _this.cardsExported;
  results.cards = results.cards.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
  var rsp = await fetch(
    _this,
    "importCards",
    {
      data: results,
      deckId: _this.$route.params.deckId,
    },
    "POST",
    true,
    true
  );
  closeImport(_this);
  if (rsp) {
    _this.$store.dispatch("changeData", {
      option: "userData",
      value: new UserDataClass(rsp.userData || {}),
    });
    _this.$store.dispatch("changeData", {
      option: "notifications",
      value: [
        ..._this.$store.state.notifications,
        {
          notificationId: getRandomString(),
          text: rsp.err ? rsp.err : "Cards imported successfully",
          type: rsp.err ? "error" : "success",
        },
      ],
    });
  }
}
export function closeExport(_this) {
  _this.$store.dispatch("changeData", {
    option: "isExport",
    value: false,
  });
}
export function openExport(_this) {
  _this.$store.dispatch("changeData", {
    option: "isExport",
    value: true,
  });
}
export function closeImport(_this) {
  _this.$store.dispatch("changeData", {
    option: "isImport",
    value: false,
  });
  _this.$store.dispatch("changeData", {
    option: "isFileSelected",
    value: false,
  });
}
export function openImport(_this) {
  _this.$store.dispatch("changeData", {
    option: "isImport",
    value: true,
  });
  _this.$store.dispatch("changeData", {
    option: "isFileSelected",
    value: false,
  });
}
export function openCancel(_this, text) {
  _this.$store.dispatch("changeData", {
    option: "confirmationText",
    value: text,
  });
}

export function closeCancel(_this) {
  _this.$store.dispatch("changeData", {
    option: "confirmationText",
    value: "",
  });
}
async function toggleActivateSuccess(_this) {
  _this.$store.dispatch("changeData", {
    option: "userData",
    value: _this.$store.state.userData,
  });
  _this.$store.dispatch("changeData", {
    option: "isActiveAble",
    value: false,
  });
  var rsp = { isSuccess: false };
  rsp = await fetchF(
    "toggleDeck",
    {
      deckId: _this.$store.state.cancelPayload.deckId,
      isActive: _this.$store.state.cancelPayload.value,
    },
    "POST",
    true,
    true
  );
  if (rsp.isSuccess == true) {
    _this.$store
      .dispatch("changeData", {
        option: "userData",
        value: new UserDataClass(rsp.userData || {}),
      })
      .then(() => {
        _this.$store.dispatch("changeData", {
          option: "notifications",
          value: [
            ..._this.$store.state.notifications,
            {
              notificationId: getRandomString(),
              text: "Deck updated successfully",
              type: "success",
            },
          ],
        });
      });
  } else {
    _this.$store.dispatch("changeData", {
      option: "notifications",
      value: [
        ..._this.$store.state.notifications,
        {
          notificationId: getRandomString(),
          text: rsp.err,
          type: "error",
        },
      ],
    });
  }
  _this.$store.dispatch("changeData", {
    option: "isActiveAble",
    value: true,
  });
}
async function toggleDeleteAccount(_this) {
  var rsp = { isSuccess: false };
  rsp = await fetchF("deleteUser", {}, "POST", true, true);
  if (rsp.isSuccess == true) {
    _this.$store.dispatch("changeData", {
      option: "alertEl",
      value:
        "Your account has been deleted successfully, It is very sad to see you leave :(",
    });
    setLocalStorage("access_token", "");
    setLocalStorage("refresh_token", "");
  } else {
    _this.$store.dispatch("changeData", {
      option: "notifications",
      value: [
        ..._this.$store.state.notifications,
        {
          notificationId: getRandomString(),
          text: rsp.err,
          type: "error",
        },
      ],
    });
  }
}
export async function submitCancel(_this) {
  var text = _this.$store.state.confirmationText;
  _this.$store.dispatch("changeData", {
    option: "confirmationText",
    value: "",
  });
  if (
    text ==
    "This deck will be combined with other active deck for review. Do you want to do this?"
  ) {
    toggleActivateSuccess(_this);
  } else if (
    text ==
    "Are you sure you want to delete your account? there is no going back after clicking 'Confirm'"
  ) {
    toggleDeleteAccount(_this);
  } else if (text == "Are you sure you want to buy one deck?") {
    var rsp = { isSuccess: false };
    rsp = await fetchF("buyDeck", {}, "POST", true, true);
    if (rsp.isSuccess == true) {
      _this.$store.dispatch("changeData", {
        option: "userData",
        value: new UserDataClass(rsp.userData || {}),
      });
      _this.$store.dispatch("changeData", {
        option: "notifications",
        value: [
          ..._this.$store.state.notifications,
          {
            notificationId: getRandomString(),
            text: "Bought successfully",
            type: "success",
          },
        ],
      });
    } else {
      _this.$store.dispatch("changeData", {
        option: "notifications",
        value: [
          ..._this.$store.state.notifications,
          {
            notificationId: getRandomString(),
            text: rsp.err,
            type: "error",
          },
        ],
      });
    }
  } else if (text == "Deleting a deck on the free version won’t let you to make another one") {
    deleteDeck(_this)
  }
}
export function getLocalStorage(name) {
  var res = localStorage.getItem(name);
  if (IsJsonString(res)) {
    res = JSON.parse(res);
  }
  return res;
}
export function setLocalStorage(name, value) {
  var res = value;
  if (typeof res == "object") {
    res = JSON.stringify(res);
  }
  if (value == "") {
    localStorage.removeItem(name, res);
  } else {
    localStorage.setItem(name, res);
  }
}
export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
