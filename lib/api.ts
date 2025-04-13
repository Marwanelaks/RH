import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export const dashboard = {
  getOverview: () => api.get('/dashboard/overview'),
};
 
export const employees = {
  getAll: () => api.get('/employees'),
  getOne: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

export const contracts = {
  getAll: () => api.get('/contracts'),
  getOne: (id: string) => api.get(`/contracts/${id}`),
  create: (data: any) => api.post('/contracts', data),
  update: (id: string, data: any) => api.put(`/contracts/${id}`, data),
  delete: (id: string) => api.delete(`/contracts/${id}`),
};

export const leaves = {
  getAll: () => api.get('/leaves'),
  getOne: (id: string) => api.get(`/leaves/${id}`),
  create: (data: any) => api.post('/leaves', data),
  update: (id: string, data: any) => api.put(`/leaves/${id}`, data),
  delete: (id: string) => api.delete(`/leaves/${id}`),
};

export const payroll = {
  getAll: () => api.get('/payroll'),
  getOne: (id: string) => api.get(`/payroll/${id}`),
  create: (data: any) => api.post('/payroll', data),
  update: (id: string, data: any) => api.put(`/payroll/${id}`, data),
  delete: (id: string) => api.delete(`/payroll/${id}`),
};

export const performance = {
  getAll: () => api.get('/performance'),
  getOne: (id: string) => api.get(`/performance/${id}`),
  create: (data: any) => api.post('/performance', data),
  update: (id: string, data: any) => api.put(`/performance/${id}`, data),
  delete: (id: string) => api.delete(`/performance/${id}`),
};

export const training = {
  getAll: () => api.get('/training'),
  getOne: (id: string) => api.get(`/training/${id}`),
  create: (data: any) => api.post('/training', data),
  update: (id: string, data: any) => api.put(`/training/${id}`, data),
  delete: (id: string) => api.delete(`/training/${id}`),
};