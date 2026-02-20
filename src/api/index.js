// Base URL — ajusta según tu entorno
const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    let detail = `Error ${res.status}`
    try { const j = await res.json(); detail = j.detail ?? detail } catch {}
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Clientes ─────────────────────────────────────
export const clientesApi = {
  getAll: () => request('/clientes'),
  getById: (id) => request(`/clientes/${id}`),
  create: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
}

// ── Vehículos ─────────────────────────────────────
export const vehiculosApi = {
  getAll: () => request('/vehiculos'),
  getById: (id) => request(`/vehiculos/${id}`),
  create: (data) => request('/vehiculos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/vehiculos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/vehiculos/${id}`, { method: 'DELETE' }),
  getModelos: () => request('/modelos'),
  getCategorias: () => request('/categorias'),
}

// ── Reservas ─────────────────────────────────────
export const reservasApi = {
  getAll: () => request('/reservas'),
  getById: (id) => request(`/reservas/${id}`),
  create: (data) => request('/reservas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/reservas/${id}`, { method: 'DELETE' }),
}

// ── Empleados ─────────────────────────────────────
export const empleadosApi = {
  getAll: () => request('/empleados'),
}