import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Node {
  id: string;
  name: string;
  region: string;
  protocol: string;
  address: string;
  port: number;
  path?: string;
  serverName?: string;
  delay: number;
  status: 'online' | 'offline';
  isFree: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NodeCreateData {
  name: string;
  region: string;
  protocol: string;
  address: string;
  port: number;
  path?: string;
  serverName?: string;
  delay?: number;
  status?: 'online' | 'offline';
  isFree?: boolean;
}

export interface NodeUpdateData extends Partial<NodeCreateData> {}

export const nodeApi = {
  getAll: async (): Promise<Node[]> => {
    const response = await api.get<Node[]>('/nodes');
    return response.data;
  },

  getById: async (id: string): Promise<Node> => {
    const response = await api.get<Node>(`/nodes/${id}`);
    return response.data;
  },

  create: async (data: NodeCreateData): Promise<Node> => {
    const response = await api.post<Node>('/nodes', data);
    return response.data;
  },

  update: async (id: string, data: NodeUpdateData): Promise<Node> => {
    const response = await api.put<Node>(`/nodes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/nodes/${id}`);
  },
};

export default api;