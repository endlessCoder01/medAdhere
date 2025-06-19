import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const MedicationScheduleScreen = () => {
  const schedule = [
    { id: 1, name: 'Aspirin 100mg', time: '08:00 AM' },
    { id: 2, name: 'Metformin 500mg', time: '08:00 AM, 08:00 PM' },
    { id: 3, name: 'Lisinopril 10mg', time: '09:00 PM' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medication Schedule</Text>

      {schedule.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => Toast.show({
            type: 'success',
            text1: 'Marked as Taken',
            text2: `${item.name} dose recorded.`,
          })}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSub}>Time: {item.time}</Text>
        </TouchableOpacity>
      ))}

      <Toast position="top" />
    </ScrollView>
  );
};

export default MedicationScheduleScreen;

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
});
