// Import styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";

// Import the core Vue library
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import FontAwesome core and Vue component
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// Import specific FontAwesome icons
import {
  faQuestionCircle,
  faInfoCircle,
  faCheck,
  faXmark,
  faIndustry,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
// Add icons to the FontAwesome library
library.add(
  faQuestionCircle,
  faInfoCircle,
  faCheck,
  faXmark,
  faIndustry,
  faTriangleExclamation
);

// Create Vue application
const app = createApp(App);

// Import config and inject
import { config } from "./assets/fetchConfig";
app.provide("config", config);

// Register FontAwesomeIcon component globally
app.component("font-awesome-icon", FontAwesomeIcon);

// Use Vue Router
app.use(router);

// Mount Vue application to the DOM
app.mount("#app");
