// src/api/vehiculosApi.js
import request from "./request";

export default {
  getAll: () => request("/vehiculos"),
  getById: (id) => request(`/vehiculos/${id}`),
  create: (data) => request("/vehiculos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/vehiculos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/vehiculos/${id}`, { method: "DELETE" }),
  getModelos: () => request("/modelos"),
  getCategorias: () => request("/categorias"),
};