import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mavora_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mavora_token');
      localStorage.removeItem('mavora_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (data: RegisterPayload) => api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// ─── Services ────────────────────────────────────────────
export const servicesAPI = {
  getPublic: () => api.get('/services/public'),
  getAll:    () => api.get('/services'),
  create:    (data: Partial<ServicePayload>) => api.post('/services', data),
  update:    (id: string, data: Partial<ServicePayload>) => api.put(`/services/${id}`, data),
  remove:    (id: string) => api.delete(`/services/${id}`),
};

// ─── Requests ────────────────────────────────────────────
export const requestsAPI = {
  create:  (data: { subject: string; message: string; service?: string }) =>
    api.post('/requests', data),
  getMy:   () => api.get('/requests/my'),
  getAll:  () => api.get('/requests'),
  update:  (id: string, data: { status: string; adminNote?: string }) =>
    api.put(`/requests/${id}`, data),
};

// ─── Admin ───────────────────────────────────────────────
export const adminAPI = {
  getStats:         () => api.get('/admin/stats'),
  getUsers:         () => api.get('/admin/users'),
  updateUser:       (id: string, data: { status?: string; subscription?: string }) =>
    api.put(`/admin/users/${id}`, data),
  getInviteCodes:   () => api.get('/admin/invite-codes'),
  createInviteCode: (subscription: string) =>
    api.post('/admin/invite-codes', { subscription }),
};

// ─── Types ───────────────────────────────────────────────
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  registrationMethod: 'invitation' | 'recommendation' | 'request';
  inviteCode?: string;
  recommendedBy?: string;
  requestMessage?: string;
}

export interface ServicePayload {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  minTier: 'basic' | 'premium' | 'vip';
  whatsappMessage?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subscription: 'basic' | 'premium' | 'vip';
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  memberId: string;
  isAdmin: boolean;
}
