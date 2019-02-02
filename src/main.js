import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueGoodTablePlugin from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(VueGoodTablePlugin);
Vue.config.productionTip = false;

axios.defaults.headers.common["Cache-control"] =
  "no-store, no-cache, must-revalidate";
axios.defaults.headers.common["Pragma"] = "no-cache";
axios.defaults.headers.common["Expires"] = "0";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
