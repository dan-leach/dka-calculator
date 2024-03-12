import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import {
  faQuestionCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
/* add icons to the library */
library.add(faQuestionCircle, faInfoCircle);

const app = createApp(App);

app.use(router);

app.mount("#app");
