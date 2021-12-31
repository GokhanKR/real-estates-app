import Provider from "@/api-provider";

const _BASE = "Contacts",
  services = {
    contactsList: (params = { start: null, limit: null }) => {
      const { start, limit } = params;

      return Provider.get({ path: _BASE }).then((res) => {
        if (res.data.records.length > 0) {
          let list = Provider.fields(res.data.records);

          let limitedList;
          if (start != null && limit != null) {
            limitedList = list.slice(start, start + limit);
          } else {
            limitedList = list;
          }

          return Provider.res(res.status, limitedList);
        }
      });
    },
    addContact: (params) => {
      let data = {
        path: _BASE,
        records: [{ fields: params }],
      };
      return Provider.post(data).then((res) =>
        Provider.res(
          res.status,
          res.status === 200 ? Provider.fields(res.data.records)[0] : []
        )
      );
    },
    getContact: (id) => {
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
