import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { nodeApi, vpnApi } from '../services/api';

const NodesScreen = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await nodeApi.list();
      setNodes(response.data);
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (node: any) => {
    try {
      const response = await vpnApi.status();

      if (response.data.connected && response.data.node) {
        Alert.alert('提示', '请先断开当前连接');
        return;
      }

      await vpnApi.connect(node.id);
      setSelectedNodeId(node.id);
      Alert.alert('成功', `已连接到 ${node.name}`);
    } catch (error: any) {
      Alert.alert('错误', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>节点列表</Text>
      <FlatList
        data={nodes}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchNodes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.nodeItem,
              selectedNodeId === item.id && styles.nodeItemSelected,
            ]}
            onPress={() => handleNodeClick(item)}
          >
            <View>
              <Text style={styles.nodeName}>{item.name}</Text>
              <Text style={styles.nodeRegion}>{item.region}</Text>
              <Text style={styles.nodeProtocol}>{item.protocol}</Text>
            </View>
            <View>
              <Text style={styles.nodeDelay}>{item.delay}ms</Text>
              <Text style={styles.nodeStatus}>
                {item.status === 'online' ? '在线' : '离线'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  nodeItemSelected: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  nodeRegion: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  nodeProtocol: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  nodeDelay: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  nodeStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
});

export default NodesScreen;