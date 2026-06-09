import { vpnApi, authApi } from '../services/api';

export class VpnService {
  private connected = false;
  private selectedNodeId: string | null = null;

  async register(email: string, password: string) {
    try {
      const response = await authApi.register({ email, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await authApi.login({ email, password });
      this.connected = false;
      this.selectedNodeId = null;
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async connect(nodeId: string) {
    try {
      const response = await vpnApi.connect(nodeId);
      this.connected = true;
      this.selectedNodeId = nodeId;
      return response.data;
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await vpnApi.disconnect();
      this.connected = false;
      this.selectedNodeId = null;
      return { message: 'Disconnected' };
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const response = await vpnApi.status();
      this.connected = response.data.connected;
      return response.data;
    } catch (error) {
      console.error('Failed to load status:', error);
      return { connected: false };
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getSelectedNodeId(): string | null {
    return this.selectedNodeId;
  }
}

export default new VpnService();