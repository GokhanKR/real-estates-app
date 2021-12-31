import Provider from "@/api-provider";
/* eslint-disable */

// Appointments Filters
const filters = {
  byDate: function (list, start, end) {
    let listByDate = [];
    list.forEach((item) => {
      if (
        new Date(item.appointment_date) > new Date(start) &&
        new Date(end) > new Date(item.appointment_date)
      ) {
        listByDate.push(item);
      }
    });
    return listByDate;
  },
  byStatus: function (list, status) {
    let listByStatus = [],
      conditions = {
        [true]: (date) => new Date(date) > new Date(),
        [false]: (date) => new Date(date) < new Date(),
      };
    list.forEach((item) => {
      if (conditions[status](item.appointment_date)) {
        listByStatus.push(item);
      }
    });
    return listByStatus;
  },
  byAgentId: function (list, agentId) {
    return list.filter((item) => item.agent_id.toString() === agentId);
  },
};

var appointmentsList = [];

// Services
const _BASE = "Appointments",
  services = {
    appointmentsList: (
      params = {
        start: null,
        limit: null,
        date: null,
        status: null,
        agentId: null,
      }
    ) => {
      const { start, limit, date, status, agentId } = params;
      return Provider.get({ path: _BASE }).then((res) => {
        let list = Provider.fields(res.data.records)
          // Skip the ones with free space
          .filter((o) => Object.keys(o).length == 13);

        // Global list
        appointmentsList = list;

        // Filter by date
        if (date != null) {
          list = filters.byDate(list, date.start, date.end);
        }

        // Filter by status
        if (status != null) {
          list = filters.byStatus(list, status);
        }

        // Filter by agentId
        if (agentId != null) {
          list = filters.byAgentId(list, agentId);
        }

        let limitedList;
        if (start != null && limit != null) {
          limitedList = list.slice(start, start + limit);
        } else {
          limitedList = list;
        }

        // Return the data
        return Provider.res(res.status, {
          list: limitedList,
          count: list.length,
        });
      });
    },
    appointmentsCount: () => {
      return Provider.get({ path: _BASE });
    },
    appointmentsListOnDate: (date) => {
      let appointments;
      if (appointmentsList.length > 0) {
        appointments = Promise.resolve(appointmentsList);
      } else {
        appointments = services.appointmentsList().then((res) => res.data.list);
      }

      return appointments.then((list) => {
        let dateList = list
          .map((o) => {
            return {
              formatted: new Date(o.appointment_date)
                .toISOString()
                .substr(0, 10),
              item: o,
            };
          })
          .filter((o) => o.formatted == date);
        return Provider.res(200, { list: dateList });
      });
    },
    appointmentsListByDate: (dateList) => {
      let appointments;
      if (appointmentsList.length > 0) {
        appointments = Promise.resolve(appointmentsList);
      } else {
        appointments = services.appointmentsList().then((res) => res.data.list);
      }

      // Extract appointments by date
      return appointments.then((list) => {
        let dateItemList = {};
        list.forEach((item) => {
          dateList.forEach((date, key) => {
            if (!Object.hasOwnProperty.call(dateItemList, key)) {
              dateItemList[key] = [];
            }

            if (
              new Date(item.appointment_date) > new Date(date.start) &&
              new Date(date.end) > new Date(item.appointment_date)
            ) {
              dateItemList[key].push(item);
            }
          });
        });
        return Provider.res(200, { list: dateItemList });
      });
    },
    addAppointment: (params) => {
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
    editAppointment: (params) => {
      let id = params.id;
      delete params.id;
      let data = {
        path: _BASE,
        records: [{ id, fields: params }],
      };
      return Provider.patch(data).then((res) =>
        Provider.res(
          res.status,
          res.status === 200 ? Provider.fields(res.data.records)[0] : []
        )
      );
    },
    getAppointment: (id) => {
      return Provider.get({
        path: _BASE + "/" + id,
      }).then((res) => {
        return Provider.res(
          res.status,
          res.status === 200 ? Provider.fields([res.data])[0] : []
        );
      });
    },
    deleteAppointment: (id) => {
      let data = {
        path: _BASE,
        records: [id],
      };
      return Provider.delete(data).then((res) =>
        Provider.res(res.status, res.status === 200 ? res.data.records[0] : [])
      );
    },
  };
export default services;
