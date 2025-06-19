import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

const RemindersScreen = () => {
  const reminders = [
    { id: 1, title: 'Morning Medication', time: '08:00 AM' },
    { id: 2, title: 'Evening Medication', time: '08:00 PM' },
    { id: 3, title: 'Blood Pressure Check', time: '07:00 AM' },
  ];

  useEffect(() => {
    // Simulate a notification when user opens this screen
    sendNotification("Med Adhere Reminder", "You have a medication due soon.");
  }, []);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const handleReminderPress = (reminder) => {
    Toast.show({
      type: 'success',
      text1: 'Reminder Acknowledged',
      text2: `${reminder.title} at ${reminder.time}`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reminders</Text>

      {reminders.map((reminder) => (
        <TouchableOpacity
          key={reminder.id}
          style={styles.card}
          onPress={() => handleReminderPress(reminder)}
        >
          <Text style={styles.cardTitle}>{reminder.title}</Text>
          <Text style={styles.cardSub}>Time: {reminder.time}</Text>
        </TouchableOpacity>
      ))}

      <Toast position="top" />
    </ScrollView>
  );
};

export default RemindersScreen;

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
