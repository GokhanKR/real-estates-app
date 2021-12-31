import AgentService from "@/services/AgentService";

export default {
  namespaced: true,
  state: () => ({
    agentsList: [],
    agentDetail: null,
  }),
  mutations: {
    setAgents: (state, data) => {
      state.agentsList = data;
    },
    setAgent: (state, data) => {
      state.agentDetail = data;
    },
  },
  actions: {
    getAgents: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        AgentService.agentsList(data)
          .then((res) => {
            if (res.status === 200) {
              let list = res.data.filter((o) => Object.keys(o).length == 6);
              commit("setAgents", list);
            }
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    getAgent: ({ commit }, id) => {
      return new Promise((resolve, reject) => {
        AgentService.getAgent(id)
          .then((res) => {
            if (res.status === 200) {
              commit("setAgent", res.data);
            }
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
};
