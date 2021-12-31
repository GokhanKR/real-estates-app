import Provider from "@/api-provider";

const _BASE = "Agents",
  services = {
    agentsList: () => {
      return Provider.get({ path: _BASE }).then((res) => {
        if (res.data.records.length > 0) {
          let list = Provider.fields(res.data.records);
          return Provider.res(res.status, list);
        }
      });
    },
    getAgent: (id) => {
      return Provider.get({
        path: _BASE + "/" + id,
      }).then((res) => {
        return Provider.res(
          res.status,
          res.status === 200 ? Provider.fields([res.data])[0] : []
        );
      });
    },
  };

export default services;
