import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

const PharmacistHomeScreen = () => {
  const prescriptions = [
    { id: 1, patient: 'Grace Mutasa', medication: 'Amoxicillin 500mg' },
    { id: 2, patient: 'Peter Banda', medication: 'Ibuprofen 400mg' },
  ];

  useEffect(() => {
    sendNotification("Med Adhere Pharmacy", "New prescription received.");
  }, []);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Pharmacist</Text>
      <Text style={styles.subtitle}>Recent Prescriptions</Text>

      {prescriptions.map((rx) => (
        <TouchableOpacity
          key={rx.id}
          style={styles.card}
          onPress={() => {
            Toast.show({
              type: 'info',
              text1: 'Prescription Selected',
              text2: `Viewing ${rx.patient}'s prescription.`,
            });
          }}
        >
          <Text style={styles.cardTitle}>{rx.patient}</Text>
          <Text style={styles.cardSub}>{rx.medication}</Text>
        </TouchableOpacity>
      ))}

      <Toast position="top" />
    </ScrollView>
  );
};

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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
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

export default PharmacistHomeScreen;
