// import SettingsService from "@/services/SettingsService";

export default {
  namespaced: true,
  state: () => ({
    settings: {},
  }),
  mutations: {
    setSettings: (state, data) => {
      state.settings = data;
    },
  },
  actions: {
    getSettings: ({ commit }) => {
      // return new Promise((resolve, reject) => {
      //   SettingsService.settings()
      //     .then((res) => {
      //       if (res.status === 200) {
              let settings = {
                workingHours: [8, 9, 10, 11, 13, 14, 15, 16, 17],
                workingDays: [1, 2, 3, 4, 5],
                defaultAppointmentTime: 60,
              }; // res.data
              
              commit("setSettings", settings);
      //         resolve(res);
      //       }
      //     })
      //     .catch((err) => reject(err));
      // });
    },
  },
};
