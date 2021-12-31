import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import notify from "./plugins/notify";
import Provider from "@/api-provider.js";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GMAP_API_KEY,
    libraries: "places,drawing,geometry,visualization,localContext", // This is required if you use the Autocomplete plugin
    region: "GB",
    language: "en-GB",
  },
});

Vue.config.productionTip = false;

Vue.prototype.$get = Provider.get;
Vue.prototype.$post = Provider.post;

Vue.use(notify);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
