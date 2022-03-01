import { createStore } from "vuex";
import userData from "@/services/userData.services";
import { getLocalStorage } from "@/services/functions.services";
var isDev = process.env.NODE_ENV == "development";
export default createStore({
  state: {
    tempData: {

    },
    isAuth: false,
    isInitiated: false,
    cardsNum: 0,
    countries: [
      {
        name: "Afghanistan",
        value: "AF",
      },
      {
        name: "Aland Islands",
        value: "AX",
      },
      {
        name: "Albania",
        value: "AL",
      },
      {
        name: "Algeria",
        value: "DZ",
      },
      {
        name: "Andorra",
        value: "AD",
      },
      {
        name: "Angola",
        value: "AO",
      },
      {
        name: "Anguilla",
        value: "AI",
      },
      {
        name: "Antigua And Barbuda",
        value: "AG",
      },
      {
        name: "Argentina",
        value: "AR",
      },
      {
        name: "Armenia",
        value: "AM",
      },
      {
        name: "Aruba",
        value: "AW",
      },
      {
        name: "Australia",
        value: "AU",
      },
      {
        name: "Austria",
        value: "AT",
      },
      {
        name: "Azerbaijan",
        value: "AZ",
      },
      {
        name: "Bahamas",
        value: "BS",
      },
      {
        name: "Bahrain",
        value: "BH",
      },
      {
        name: "Bangladesh",
        value: "BD",
      },
      {
        name: "Barbados",
        value: "BB",
      },
      {
        name: "Belarus",
        value: "BY",
      },
      {
        name: "Belgium",
        value: "BE",
      },
      {
        name: "Belize",
        value: "BZ",
      },
      {
        name: "Benin",
        value: "BJ",
      },
      {
        name: "Bermuda",
        value: "BM",
      },
      {
        name: "Bhutan",
        value: "BT",
      },
      {
        name: "Bolivia",
        value: "BO",
      },
      {
        name: "Bosnia And Herzegovina",
        value: "BA",
      },
      {
        name: "Botswana",
        value: "BW",
      },
      {
        name: "Bouvet Island",
        value: "BV",
      },
      {
        name: "Brazil",
        value: "BR",
      },
      {
        name: "British Indian Ocean Territory",
        value: "IO",
      },
      {
        name: "Brunei",
        value: "BN",
      },
      {
        name: "Bulgaria",
        value: "BG",
      },
      {
        name: "Burkina Faso",
        value: "BF",
      },
      {
        name: "Burundi",
        value: "BI",
      },
      {
        name: "Cambodia",
        value: "KH",
      },
      {
        name: "Canada",
        value: "CA",
      },
      {
        name: "Cape Verde",
        value: "CV",
      },
      {
        name: "Caribbean Netherlands",
        value: "BQ",
      },
      {
        name: "Cayman Islands",
        value: "KY",
      },
      {
        name: "Central African Republic",
        value: "CF",
      },
      {
        name: "Chad",
        value: "TD",
      },
      {
        name: "Chile",
        value: "CL",
      },
      {
        name: "China",
        value: "CN",
      },
      {
        name: "Christmas Island",
        value: "CX",
      },
      {
        name: "Cocos (Keeling) Islands",
        value: "CC",
      },
      {
        name: "Colombia",
        value: "CO",
      },
      {
        name: "Comoros",
        value: "KM",
      },
      {
        name: "Congo",
        value: "CG",
      },
      {
        name: "Congo, The Democratic Republic Of The",
        value: "CD",
      },
      {
        name: "Cook Islands",
        value: "CK",
      },
      {
        name: "Costa Rica",
        value: "CR",
      },
      {
        name: "Croatia",
        value: "HR",
      },
      {
        name: "Cuba",
        value: "CU",
      },
      {
        name: "Curaçao",
        value: "CW",
      },
      {
        name: "Cyprus",
        value: "CY",
      },
      {
        name: "Czech Republic",
        value: "CZ",
      },
      {
        name: "Côte d'Ivoire",
        value: "CI",
      },
      {
        name: "Denmark",
        value: "DK",
      },
      {
        name: "Djibouti",
        value: "DJ",
      },
      {
        name: "Dominica",
        value: "DM",
      },
      {
        name: "Dominican Republic",
        value: "DO",
      },
      {
        name: "Ecuador",
        value: "EC",
      },
      {
        name: "Egypt",
        value: "EG",
      },
      {
        name: "El Salvador",
        value: "SV",
      },
      {
        name: "Equatorial Guinea",
        value: "GQ",
      },
      {
        name: "Eritrea",
        value: "ER",
      },
      {
        name: "Estonia",
        value: "EE",
      },
      {
        name: "Eswatini",
        value: "SZ",
      },
      {
        name: "Ethiopia",
        value: "ET",
      },
      {
        name: "Falkland Islands (Malvinas)",
        value: "FK",
      },
      {
        name: "Faroe Islands",
        value: "FO",
      },
      {
        name: "Fiji",
        value: "FJ",
      },
      {
        name: "Finland",
        value: "FI",
      },
      {
        name: "France",
        value: "FR",
      },
      {
        name: "French Guiana",
        value: "GF",
      },
      {
        name: "French Polynesia",
        value: "PF",
      },
      {
        name: "French Southern Territories",
        value: "TF",
      },
      {
        name: "Gabon",
        value: "GA",
      },
      {
        name: "Gambia",
        value: "GM",
      },
      {
        name: "Georgia",
        value: "GE",
      },
      {
        name: "Germany",
        value: "DE",
      },
      {
        name: "Ghana",
        value: "GH",
      },
      {
        name: "Gibraltar",
        value: "GI",
      },
      {
        name: "Greece",
        value: "GR",
      },
      {
        name: "Greenland",
        value: "GL",
      },
      {
        name: "Grenada",
        value: "GD",
      },
      {
        name: "Guadeloupe",
        value: "GP",
      },
      {
        name: "Guatemala",
        value: "GT",
      },
      {
        name: "Guernsey",
        value: "GG",
      },
      {
        name: "Guinea",
        value: "GN",
      },
      {
        name: "Guinea Bissau",
        value: "GW",
      },
      {
        name: "Guyana",
        value: "GY",
      },
      {
        name: "Haiti",
        value: "HT",
      },
      {
        name: "Heard Island And Mcdonald Islands",
        value: "HM",
      },
      {
        name: "Holy See (Vatican City State)",
        value: "VA",
      },
      {
        name: "Honduras",
        value: "HN",
      },
      {
        name: "Hong Kong",
        value: "HK",
      },
      {
        name: "Hungary",
        value: "HU",
      },
      {
        name: "Iceland",
        value: "IS",
      },
      {
        name: "India",
        value: "IN",
      },
      {
        name: "Indonesia",
        value: "ID",
      },
      {
        name: "Iran, Islamic Republic Of",
        value: "IR",
      },
      {
        name: "Iraq",
        value: "IQ",
      },
      {
        name: "Ireland",
        value: "IE",
      },
      {
        name: "Isle Of Man",
        value: "IM",
      },
      {
        name: "Israel",
        value: "IL",
      },
      {
        name: "Italy",
        value: "IT",
      },
      {
        name: "Jamaica",
        value: "JM",
      },
      {
        name: "Japan",
        value: "JP",
      },
      {
        name: "Jersey",
        value: "JE",
      },
      {
        name: "Jordan",
        value: "JO",
      },
      {
        name: "Kazakhstan",
        value: "KZ",
      },
      {
        name: "Kenya",
        value: "KE",
      },
      {
        name: "Kiribati",
        value: "KI",
      },
      {
        name: "Korea, Democratic People's Republic Of",
        value: "KP",
      },
      {
        name: "Kosovo",
        value: "XK",
      },
      {
        name: "Kuwait",
        value: "KW",
      },
      {
        name: "Kyrgyzstan",
        value: "KG",
      },
      {
        name: "Lao People's Democratic Republic",
        value: "LA",
      },
      {
        name: "Latvia",
        value: "LV",
      },
      {
        name: "Lebanon",
        value: "LB",
      },
      {
        name: "Lesotho",
        value: "LS",
      },
      {
        name: "Liberia",
        value: "LR",
      },
      {
        name: "Libyan Arab Jamahiriya",
        value: "LY",
      },
      {
        name: "Liechtenstein",
        value: "LI",
      },
      {
        name: "Lithuania",
        value: "LT",
      },
      {
        name: "Luxembourg",
        value: "LU",
      },
      {
        name: "Macao",
        value: "MO",
      },
      {
        name: "Madagascar",
        value: "MG",
      },
      {
        name: "Malawi",
        value: "MW",
      },
      {
        name: "Malaysia",
        value: "MY",
      },
      {
        name: "Maldives",
        value: "MV",
      },
      {
        name: "Mali",
        value: "ML",
      },
      {
        name: "Malta",
        value: "MT",
      },
      {
        name: "Martinique",
        value: "MQ",
      },
      {
        name: "Mauritania",
        value: "MR",
      },
      {
        name: "Mauritius",
        value: "MU",
      },
      {
        name: "Mayotte",
        value: "YT",
      },
      {
        name: "Mexico",
        value: "MX",
      },
      {
        name: "Moldova, Republic of",
        value: "MD",
      },
      {
        name: "Monaco",
        value: "MC",
      },
      {
        name: "Mongolia",
        value: "MN",
      },
      {
        name: "Montenegro",
        value: "ME",
      },
      {
        name: "Montserrat",
        value: "MS",
      },
      {
        name: "Morocco",
        value: "MA",
      },
      {
        name: "Mozambique",
        value: "MZ",
      },
      {
        name: "Myanmar",
        value: "MM",
      },
      {
        name: "Namibia",
        value: "NA",
      },
      {
        name: "Nauru",
        value: "NR",
      },
      {
        name: "Nepal",
        value: "NP",
      },
      {
        name: "Netherlands",
        value: "NL",
      },
      {
        name: "Netherlands Antilles",
        value: "AN",
      },
      {
        name: "New Caledonia",
        value: "NC",
      },
      {
        name: "New Zealand",
        value: "NZ",
      },
      {
        name: "Nicaragua",
        value: "NI",
      },
      {
        name: "Niger",
        value: "NE",
      },
      {
        name: "Nigeria",
        value: "NG",
      },
      {
        name: "Niue",
        value: "NU",
      },
      {
        name: "Norfolk Island",
        value: "NF",
      },
      {
        name: "North Macedonia",
        value: "MK",
      },
      {
        name: "Norway",
        value: "NO",
      },
      {
        name: "Oman",
        value: "OM",
      },
      {
        name: "Pakistan",
        value: "PK",
      },
      {
        name: "Palestinian Territory, Occupied",
        value: "PS",
      },
      {
        name: "Panama",
        value: "PA",
      },
      {
        name: "Papua New Guinea",
        value: "PG",
      },
      {
        name: "Paraguay",
        value: "PY",
      },
      {
        name: "Peru",
        value: "PE",
      },
      {
        name: "Philippines",
        value: "PH",
      },
      {
        name: "Pitcairn",
        value: "PN",
      },
      {
        name: "Poland",
        value: "PL",
      },
      {
        name: "Portugal",
        value: "PT",
      },
      {
        name: "Qatar",
        value: "QA",
      },
      {
        name: "Republic of Cameroon",
        value: "CM",
      },
      {
        name: "Reunion",
        value: "RE",
      },
      {
        name: "Romania",
        value: "RO",
      },
      {
        name: "Russia",
        value: "RU",
      },
      {
        name: "Rwanda",
        value: "RW",
      },
      {
        name: "Saint Barthélemy",
        value: "BL",
      },
      {
        name: "Saint Helena",
        value: "SH",
      },
      {
        name: "Saint Kitts And Nevis",
        value: "KN",
      },
      {
        name: "Saint Lucia",
        value: "LC",
      },
      {
        name: "Saint Martin",
        value: "MF",
      },
      {
        name: "Saint Pierre And Miquelon",
        value: "PM",
      },
      {
        name: "Samoa",
        value: "WS",
      },
      {
        name: "San Marino",
        value: "SM",
      },
      {
        name: "Sao Tome And Principe",
        value: "ST",
      },
      {
        name: "Saudi Arabia",
        value: "SA",
      },
      {
        name: "Senegal",
        value: "SN",
      },
      {
        name: "Serbia",
        value: "RS",
      },
      {
        name: "Seychelles",
        value: "SC",
      },
      {
        name: "Sierra Leone",
        value: "SL",
      },
      {
        name: "Singapore",
        value: "SG",
      },
      {
        name: "Sint Maarten",
        value: "SX",
      },
      {
        name: "Slovakia",
        value: "SK",
      },
      {
        name: "Slovenia",
        value: "SI",
      },
      {
        name: "Solomon Islands",
        value: "SB",
      },
      {
        name: "Somalia",
        value: "SO",
      },
      {
        name: "South Africa",
        value: "ZA",
      },
      {
        name: "South Georgia And The South Sandwich Islands",
        value: "GS",
      },
      {
        name: "South Korea",
        value: "KR",
      },
      {
        name: "South Sudan",
        value: "SS",
      },
      {
        name: "Spain",
        value: "ES",
      },
      {
        name: "Sri Lanka",
        value: "LK",
      },
      {
        name: "St. Vincent",
        value: "VC",
      },
      {
        name: "Sudan",
        value: "SD",
      },
      {
        name: "Suriname",
        value: "SR",
      },
      {
        name: "Svalbard And Jan Mayen",
        value: "SJ",
      },
      {
        name: "Sweden",
        value: "SE",
      },
      {
        name: "Switzerland",
        value: "CH",
      },
      {
        name: "Syria",
        value: "SY",
      },
      {
        name: "Taiwan",
        value: "TW",
      },
      {
        name: "Tajikistan",
        value: "TJ",
      },
      {
        name: "Tanzania, United Republic Of",
        value: "TZ",
      },
      {
        name: "Thailand",
        value: "TH",
      },
      {
        name: "Timor Leste",
        value: "TL",
      },
      {
        name: "Togo",
        value: "TG",
      },
      {
        name: "Tokelau",
        value: "TK",
      },
      {
        name: "Tonga",
        value: "TO",
      },
      {
        name: "Trinidad and Tobago",
        value: "TT",
      },
      {
        name: "Tunisia",
        value: "TN",
      },
      {
        name: "Turkey",
        value: "TR",
      },
      {
        name: "Turkmenistan",
        value: "TM",
      },
      {
        name: "Turks and Caicos Islands",
        value: "TC",
      },
      {
        name: "Tuvalu",
        value: "TV",
      },
      {
        name: "Uganda",
        value: "UG",
      },
      {
        name: "Ukraine",
        value: "UA",
      },
      {
        name: "United Arab Emirates",
        value: "AE",
      },
      {
        name: "United Kingdom",
        value: "GB",
      },
      {
        name: "United States",
        value: "US",
      },
      {
        name: "United States Minor Outlying Islands",
        value: "UM",
      },
      {
        name: "Uruguay",
        value: "UY",
      },
      {
        name: "Uzbekistan",
        value: "UZ",
      },
      {
        name: "Vanuatu",
        value: "VU",
      },
      {
        name: "Venezuela",
        value: "VE",
      },
      {
        name: "Vietnam",
        value: "VN",
      },
      {
        name: "Virgin Islands, British",
        value: "VG",
      },
      {
        name: "Wallis And Futuna",
        value: "WF",
      },
      {
        name: "Western Sahara",
        value: "EH",
      },
      {
        name: "Yemen",
        value: "YE",
      },
      {
        name: "Zambia",
        value: "ZM",
      },
      {
        name: "Zimbabwe",
        value: "ZW",
      },
    ],
    alertEl: "",
    confirmationTitle: "",
    isLoaded: false,
    isImport: false,
    isExport: false,
    isDarkModeEnabled: getLocalStorage("isDarkModeEnabled") || false,
    isActiveAble: true,
    cancelPayload: "",
    confirmationText: "",
    serverLink: isDev == false ? "http://18.118.156.94:5000" : "http://localhost:5000",
    userData,
    notifications: [],
  },

  mutations: {
    changeData(state, payload) {
      state[payload.option] = payload.value;
    },
    toggleIsLoaded(state) {
      state.isLoaded = !state.isLoaded;
    },
  },
  getters: {
    getData: state => (name) => {
      return state[name]
    }

  },

  actions: {
    toggleIsLoaded({ commit }) {
      return new Promise((resolve, reject) => {
        commit("toggleIsLoaded");
        resolve();
      });
    },
    changeData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("changeData", payload);
        resolve();
      });
    },
  },
  modules: {},
});
