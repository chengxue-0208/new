import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API 服务函数
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string, email: string) =>
    api.post('/auth/register', { username, password, email }),
};

export const nodesAPI = {
  getAll: () => api.get('/nodes'),
  getById: (id: string) => api.get(`/nodes/${id}`),
  getByRegion: (region: string) => api.get(`/nodes/by-region/${region}`),
  create: (data: any) => api.post('/nodes', data),
  update: (id: string, data: any) => api.put(`/nodes/${id}`, data),
  delete: (id: string) => api.delete(`/nodes/${id}`),
};

export const subscriptionAPI = {
  getPlans: () => api.get('/subscription/plans'),
  getMySubscription: () => api.get('/subscription/my'),
  purchase: (planId: string, paymentMethod: string) =>
    api.post('/subscription/purchase', { planId, paymentMethod }),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

export const paymentAPI = {
  create: (data: any) => api.post('/payment/create', data),
  verify: (transactionId: string) => api.get('/payment/verify', { params: { transactionId } }),
  alipayCallback: (data: any) => api.post('/payment/callback/alipay', data),
  wechatCallback: (data: any) => api.post('/payment/callback/wechat', data),
};

export const vpnAPI = {
  connect: (nodeId: string) => api.post('/vpn/connect', { nodeId }),
  disconnect: () => api.post('/vpn/disconnect'),
  getStatus: () => api.get('/vpn/status'),
  getConfig: () => api.get('/vpn/config'),
};

export default api;