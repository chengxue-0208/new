import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VpnService } from '../services/vpnService';

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('未连接');
  const [delay, setDelay] = useState(0);

  const vpnService = new VpnService();

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await vpnService.getStatus();
      setConnected(response.connected);
      setStatus(response.connected ? '已连接' : '未连接');

      if (response.node) {
        setDelay(response.node.delay);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      if (connected) {
        await vpnService.disconnect();
      } else {
        // 连接VPN
        const response = await vpnService.getStatus();
        if (response.connected) {
          return;
        }

        const nodesResponse = await fetch('http://localhost:3000/api/nodes');
        const data = await nodesResponse.json();
        if (data && data.length > 0) {
          await vpnService.connect(data[0].id);
        }
      }
      loadStatus();
    } catch (error) {
      console.error('VPN操作失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VPN服务</Text>
      <TouchableOpacity
        style={[
          styles.button,
          connected && styles.buttonConnected,
        ]}
        onPress={handleConnect}
      >
        <Text style={styles.buttonText}>
          {connected ? '断开连接' : '连接VPN'}
        </Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>状态: {status}</Text>
        <Text style={styles.infoText}>延迟: {delay}ms</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonConnected: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#212121',
  },
});

export default HomeScreen;