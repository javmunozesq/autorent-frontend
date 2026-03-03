// src/api/empleadosApi.js
import request from "./request"; // si usas request.js; si no, adapta al helper que tengas

export default {
  getAll: () => request("/empleados"),
  getById: (id) => request(`/empleados/${id}`),
  // añade otros métodos si los necesitas
};