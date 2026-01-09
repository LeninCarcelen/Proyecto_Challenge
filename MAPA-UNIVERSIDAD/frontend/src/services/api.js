import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (nombre, email, password, rol) =>
    api.post('/auth/register', { nombre, email, password, rol }),
  getUsuarios: () => api.get('/auth/usuarios'),
  updateUsuario: (id, data) => api.put(`/auth/usuarios/${id}`, data),
  deleteUsuario: (id) => api.delete(`/auth/usuarios/${id}`),
};

// Alertas
export const alertaService = {
  crearAlerta: (userId, ubicacion, descripcion) =>
    api.post('/alertas', { userId, ubicacion, descripcion }),
  getAlertas: () => api.get('/alertas'),
  getAlertaById: (id) => api.get(`/alertas/${id}`),
  updateAlerta: (id, estado, descripcion) =>
    api.put(`/alertas/${id}`, { estado, descripcion }),
  deleteAlerta: (id) => api.delete(`/alertas/${id}`),
  getAlertasPorUsuario: (userId) => api.get(`/alertas/usuario/${userId}`),
};

// Contenedores
export const contenedorService = {
  crearContenedor: (tipo, ubicacion, createdBy, descripcion) =>
    api.post('/contenedores', { tipo, ubicacion, createdBy, descripcion }),
  getContenedores: () => api.get('/contenedores'),
  getContenedorById: (id) => api.get(`/contenedores/${id}`),
  updateContenedor: (id, tipo, descripcion, activo) =>
    api.put(`/contenedores/${id}`, { tipo, descripcion, activo }),
  deleteContenedor: (id) => api.delete(`/contenedores/${id}`),
};

export default api;
