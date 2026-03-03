// src/api/request.js
const BASE = import.meta.env.VITE_API_URL ?? '/api';

export default async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try { const j = await res.json(); detail = j.detail ?? detail; } catch {}
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}