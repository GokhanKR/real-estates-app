import AppointmentService from "@/services/AppointmentService";

export default {
  namespaced: true,
  state: () => ({
    appointmentsList: [],
    appointmentsCount: 0,
    list: [],
    start: 0,
    limit: 10,
    listByDate: [],
  }),
  mutations: {
    setAppointments: (state, data) => {
      state.appointmentsList = data;
    },
    setAppointmentsCount: (state, data) => {
      state.appointmentsCount = data;
    },
    setList: (state, data) => {
      state.list = data;
    },
    setStart: (state, data) => {
      state.start = data;
    },
    setLimit: (state, data) => {
      state.limit = data;
    },
    setListByDate: (state, data) => {
      state.listByDate = data;
    },
  },
  actions: {
    getAppointments: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        AppointmentService.appointmentsList(data)
          .then((res) => {
            if (res.status === 200) {
              commit("setAppointments", res.data.list);
              commit("setAppointmentsCount", res.data.count);
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
    deleteAppointment: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        AppointmentService.deleteAppointment(data)
          .then((res) => {
            if (res.status === 200) {
              dispatch("getAppointments", {
                start: state.start,
                limit: state.limit,
              });
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
    getAppointmentsByDate: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        AppointmentService.appointmentsListByDate(data)
          .then((res) => {
            if (res.status === 200) {
              commit("setListByDate", res.data.list);
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
  },
};
