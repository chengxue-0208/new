import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      // Refresh token logic would go here
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const vpnApi = {
  connect: (nodeId: string) =>
    api.post('/vpn/connect', { nodeId }),
  disconnect: () => api.post('/vpn/disconnect'),
  status: () => api.get('/vpn/status'),
  config: () => api.get('/vpn/config'),
};

export const nodeApi = {
  list: () => api.get('/nodes'),
  updateDelay: (nodeId: string) =>
    api.get(`/node/delay/${nodeId}`),
};

export const subscriptionApi = {
  plans: () => api.get('/subscription/plans'),
  mySubscription: () => api.get('/subscription/my'),
  purchase: (data: any) => api.post('/subscription/purchase', data),
};

export const paymentApi = {
  create: (data: { planId: string; paymentMethod: string }) =>
    api.post('/payment/create', data),
  alipayCallback: (data: any) => api.post('/payment/callback/alipay', data, { params: data }),
  wechatCallback: (data: any) => api.post('/payment/callback/wechat', data),
};

export const orderApi = {
  list: () => api.get('/orders'),
  cancel: (id: string) => api.delete(`/orders/${id}`),
};

export const userApi = {
  profile: () => api.get('/user/profile'),
  trafficStats: () => api.get('/user/traffic'),
};