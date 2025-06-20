import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const AddReminderScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = () => {
    if (!title || !time) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter both title and time.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Reminder Added',
      text2: `${title} at ${time}`,
    });

    // Simulate saving and go back
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Reminder</Text>

      <TextInput
        style={styles.input}
        placeholder="Reminder Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Time (e.g., 08:00 AM)"
        value={time}
        onChangeText={setTime}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default AddReminderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
