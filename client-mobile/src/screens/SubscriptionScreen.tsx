import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { subscriptionApi } from '../services/api';

const SubscriptionScreen = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await subscriptionApi.plans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (plan: any) => {
    Alert.alert('购买', `购买 ${plan.name} 套餐，价格: ¥${plan.price}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>订阅套餐</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchPlans}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handlePurchase(item)}
          >
            <View>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planPrice}>¥{item.price}</Text>
            </View>
            <View>
              <Text style={styles.planDuration}>{item.durationDays}天</Text>
              <Text style={styles.planTraffic}>{item.monthlyTraffic}GB/月</Text>
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
  planCard: {
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
  planName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  planDuration: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  planTraffic: {
    fontSize: 12,
    color: '#757575',
  },
});

export default SubscriptionScreen;