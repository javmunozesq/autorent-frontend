// src/api/clientesApi.js
import request from "./request";

export default {
  getAll: () => request("/clientes"),
  getById: (id) => request(`/clientes/${id}`),
  create: (data) => request("/clientes", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/clientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/clientes/${id}`, { method: "DELETE" }),
};