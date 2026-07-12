/**
 * Thin client for the Manokamana backend API.
 *
 * Base URL comes from VITE_API_URL (e.g. https://your-api.onrender.com/api).
 * In dev it defaults to '/api', which Vite proxies to localhost:5000.
 */
export const API_BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'mhp_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body, auth = false, formData } = {}) {
  const headers = {}
  if (auth) headers.Authorization = `Bearer ${getToken()}`
  if (body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

/* ── Public ────────────────────────────────────────────────────── */

export const api = {
  login: (password) => request('/auth/login', { method: 'POST', body: { password } }),

  getReports: () => request('/reports'),
  getPosts: () => request('/posts'),
  getPost: (slug) => request(`/posts/${slug}`),
  getTeam: () => request('/team'),
  getOpenings: () => request('/careers'),

  /* ── Admin (multipart so files can ride along) ───────────────── */

  createReport: (fd) => request('/reports', { method: 'POST', auth: true, formData: fd }),
  updateReport: (id, fd) => request(`/reports/${id}`, { method: 'PUT', auth: true, formData: fd }),
  deleteReport: (id) => request(`/reports/${id}`, { method: 'DELETE', auth: true }),

  createPost: (fd) => request('/posts', { method: 'POST', auth: true, formData: fd }),
  updatePost: (slug, fd) => request(`/posts/${slug}`, { method: 'PUT', auth: true, formData: fd }),
  deletePost: (slug) => request(`/posts/${slug}`, { method: 'DELETE', auth: true }),

  updateTeamMember: (section, index, fd) =>
    request(`/team/${section}/${index}`, { method: 'PUT', auth: true, formData: fd }),
  addTeamMember: (section, fd) =>
    request(`/team/${section}`, { method: 'POST', auth: true, formData: fd }),
  deleteTeamMember: (section, index) =>
    request(`/team/${section}/${index}`, { method: 'DELETE', auth: true }),

  createOpening: (body) => request('/careers', { method: 'POST', auth: true, body }),
  updateOpening: (id, body) => request(`/careers/${id}`, { method: 'PUT', auth: true, body }),
  deleteOpening: (id) => request(`/careers/${id}`, { method: 'DELETE', auth: true }),
}
