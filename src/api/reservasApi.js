// src/api/reservasApi.js
import request from "./request";

export default {
  getAll: () => request("/reservas"),
  getById: (id) => request(`/reservas/${id}`),
  create: (data) => request("/reservas", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/reservas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/reservas/${id}`, { method: "DELETE" }),
};