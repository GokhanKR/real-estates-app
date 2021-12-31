import ContactService from "@/services/ContactService";

export default {
  namespaced: true,
  state: () => ({
    contactsList: [],
    contactDetail: null,
    start: 0,
    limit: 10,
  }),
  mutations: {
    setContacts: (state, data) => {
      state.contactsList = data;
    },
    setContact: (state, data) => {
      state.contactDetail = data;
    },
  },
  actions: {
    getContacts: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        ContactService.contactsList(data)
          .then((res) => {
            if (res.status === 200) {
              let list = res.data.filter((o) => Object.keys(o).length == 8);
              commit("setContacts", list);
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
    addContact: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        ContactService.contactsList(data)
          .then((res) => {
            if (res.status === 200) {
              dispatch("getContacts", {
                start: state.start,
                limit: state.limit,
              });
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
    getContact: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        ContactService.getContact(id)
          .then((res) => {
            if (res.status === 200) {
              commit("setContact", res.data);
              resolve(res);
            }
          })
          .catch((err) => reject(err));
      });
    },
  },
};
