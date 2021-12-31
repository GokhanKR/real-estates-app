import Vue from "vue";
import Vuex from "vuex";

import Appointments from "./modules/Appointment";
import Agents from "./modules/Agent";
import Contacts from "./modules/Contact";
import Settings from "./modules/Setting";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state: {
    notify: {
      status: null,
      message: null,
      value: false,
      timeout: 2000,
    },
  },
  mutations: {
    setNotify: (state, notifyData) => {
      state.notify = Object.assign(state.notify, notifyData);
    },
  },
  actions: {},
  modules: {
    Appointments,
    Agents,
    Contacts,
    Settings,
  },
});
