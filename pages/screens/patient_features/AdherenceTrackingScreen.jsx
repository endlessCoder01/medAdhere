import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AdherenceTrackingScreen = () => {
  const records = [
    { id: 1, med: 'Aspirin', date: '2025-06-18', status: 'Taken' },
    { id: 2, med: 'Metformin', date: '2025-06-18', status: 'Missed' },
    { id: 3, med: 'Lisinopril', date: '2025-06-17', status: 'Taken' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adherence Tracking</Text>

      {records.map((rec) => (
        <View key={rec.id} style={styles.card}>
          <Text style={styles.cardTitle}>{rec.med}</Text>
          <Text style={styles.cardSub}>Date: {rec.date}</Text>
          <Text style={[
            styles.status,
            { color: rec.status === 'Taken' ? 'green' : 'red' }
          ]}>
            Status: {rec.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdherenceTrackingScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f8fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSub: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  status: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '600',
  },
});
