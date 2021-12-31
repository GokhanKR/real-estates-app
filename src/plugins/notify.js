import Store from "@/store";

export default {
  install: (Vue) => {
    Vue.prototype.$notify = (status, message, timeout = 2000) => {
      Store.commit("setNotify", { status, message, timeout, value: true });
    };
  },
};
