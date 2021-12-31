import axios from "axios";
import qs from "qs";

/**
 * Get requests
 * @param {*} params
 * @param {*} path
 */
const Provider = {
  get: function (params) {
    try {
      let url = "";
      if (params.path) {
        url += params.path;
        delete params.path;
      }
      if (Object.keys(params).length) {
        url += "?" + qs.stringify(params, { format: "RFC3986" });
      }
      return axios({
        url: process.env.API_URL + url,
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Authorization: process.env.API_KEY,
        },
      });
    } catch (err) {
      console.error("error", err);
    }
  },
  post: function (params) {
    try {
      let url = "";
      if (params.path) {
        url += params.path + "/";
        delete params.path;
      }
      return axios({
        url: process.env.API_URL + url,
        method: "POST",
        data: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.API_KEY,
        },
      });
    } catch (err) {
      console.error("error", err);
    }
  },
  delete: function (params) {
    try {
      let url = "";
      if (params.path) {
        url += params.path;
        delete params.path;
      }
      if (Object.keys(params).length) {
        url += "?" + qs.stringify(params, { format: "RFC3986" });
      }
      return axios({
        url: process.env.API_URL + url,
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Authorization: process.env.API_KEY,
        },
      });
    } catch (err) {
      console.error("error", err);
    }
  },
  patch: function (params) {
    try {
      let url = "";
      if (params.path) {
        url += params.path + "/";
        delete params.path;
      }
      return axios({
        url: process.env.API_URL + url,
        method: "PATCH",
        data: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.API_KEY,
        },
      });
    } catch (err) {
      console.error("error", err);
    }
  },
  /**
   * Generates a response
   *
   * @param {Number} status
   * @param {*} data
   * @returns Object
   */
  res: (status, data) => {
    return {
      status: status,
      data: data,
    };
  },
  /**
   * Returns just .fields
   *
   * @param {Array} records
   * @returns Array
   */
  fields: (records) => {
    return records.map((record) => {
      return {
        ...record.fields,
        id: record.id,
        createdTime: record.createdTime,
      };
    });
  },
};

export default Provider;
