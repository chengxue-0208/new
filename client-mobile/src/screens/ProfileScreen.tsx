import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { vpnApi, userApi, paymentApi } from '../services/api';
import { useRouter } from '@react-navigation/native';

const ProfileScreen = () => {
  const [trafficStats, setTrafficStats] = useState<any>(null);
  const [connectionHistory, setConnectionHistory] = useState<any[]>([]);
  const [email, setEmail] = useState('user@example.com');
  const [balance, setBalance] = useState('¥0.00');
  const router = useRouter();

  useEffect(() => {
    loadTrafficStats();
    loadConnectionHistory();
    loadUserProfile();
  }, []);

  const loadTrafficStats = async () => {
    try {
      const response = await userApi.trafficStats();
      setTrafficStats(response.data);
    } catch (error) {
      console.error('Failed to load traffic stats:', error);
    }
  };

  const loadConnectionHistory = async () => {
    try {
      const response = await userApi.profile();
      setConnectionHistory(response.data);
    } catch (error) {
      console.error('Failed to load connection history:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await userApi.profile();
      setEmail(response.data.email || 'user@example.com');
      setBalance(`¥${response.data.balance || 0}.00`);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('提示', '退出登录功能待实现');
  };

  const handlePurchase = () => {
    router.navigate('Subscription');
  };

  const formatTraffic = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.userInfo}>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.balance}>余额: {balance}</Text>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.purchaseCard} onPress={handlePurchase}>
            <Text style={styles.purchaseTitle}>购买套餐</Text>
            <Text style={styles.purchaseButton}>查看套餐</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>流量统计</Text>
          {trafficStats && (
            <View style={styles.trafficStat}>
              <View style={styles.trafficRow}>
                <Text style={styles.trafficUsed}>已用: {formatTraffic(trafficStats.used || 0)} GB</Text>
                <Text style={styles.trafficLimit}>剩余: {formatTraffic(trafficStats.remaining || 0)} GB</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { width: `${Math.min(trafficStats.percentage || 0, 100)}%` }
                ]} />
              </View>
              <Text style={styles.trafficInfo}>
                总计使用: {formatTraffic(trafficStats.totalUsed || 0)} GB
              </Text>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>连接历史</Text>
          <View style={styles.historyList}>
            {connectionHistory && connectionHistory.length > 0 ? (
              connectionHistory.map((log) => (
                <View key={log.id} style={styles.historyItem}>
                  <Text style={styles.historyNode}>{log.node?.name}</Text>
                  <Text style={styles.historyTime}>
                    {new Date(log.connectAt).toLocaleString()}
                  </Text>
                  <Text style={styles.historyDuration}>
                    {log.duration} 秒
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.historyText}>暂无记录</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: '#212121',
  },
  balance: {
    fontSize: 14,
    color: '#2196F3',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  purchaseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseTitle: {
    fontSize: 16,
    color: '#212121',
  },
  purchaseButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212121',
  },
  trafficStat: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trafficUsed: {
    fontSize: 14,
    color: '#212121',
  },
  trafficLimit: {
    fontSize: 14,
    color: '#757575',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  trafficInfo: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  historyList: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  historyNode: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  historyTime: {
    flex: 1,
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  historyDuration: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
  historyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default ProfileScreen;