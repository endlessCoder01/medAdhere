import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/api';

const AddReminderScreen = ({ navigation }) => {
  const [medications, setMedications] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userInfo');
      if (!userData) throw new Error('No user info');
      const user = JSON.parse(userData);

      const res = await fetch(`${API_URL}/medication/patient/${user.user_id}`);
      if (!res.ok) throw new Error('Failed to fetch medications');
      const meds = await res.json();
      setMedications(meds);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Failed to load medications'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (dosage) => {
    const parts = parseInt(dosage);
    if (isNaN(parts) || parts < 1) return [];

    const interval = Math.floor(24 / parts);
    const slots = [];
    for (let i = 0; i < parts; i++) {
      const hour = (i * interval) % 24;
      const formatted = `${hour.toString().padStart(2, '0')}:00:00`;
      slots.push(formatted);
    }
    return slots;
  };

  const handleMedSelect = (med) => {
    setSelectedMed(med);
    const doses = med.dosage.match(/\d+/);
    const slots = generateTimeSlots(doses ? doses[0] : '1');
    setTimeSlots(slots);
    setSelectedTime('');
  };

  const handleAdd = async () => {
    if (!selectedMed || !selectedTime) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Select medication and time.'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reminders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: selectedMed.medication_id,
          reminder_time: selectedTime,
          recurrence: 1,
          channel: 'app'
        })
      });

      if (!res.ok) throw new Error('Failed to add reminder');

      Toast.show({
        type: 'success',
        text1: 'Reminder Added',
        text2: `${selectedMed.name} at ${selectedTime}`
      });

      setTimeout(() => navigation.goBack(), 1000);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Failed to add reminder'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Reminder</Text>

      {loading && <ActivityIndicator size="large" color="#4e8cff" style={{ marginBottom: 20 }} />}

      <Text style={styles.label}>Select Medication:</Text>
      {medications.map(med => (
        <TouchableOpacity
          key={med.medication_id}
          style={[
            styles.item,
            selectedMed?.medication_id === med.medication_id && styles.selectedItem
          ]}
          onPress={() => handleMedSelect(med)}
        >
          <Text>{med.name} ({med.dosage})</Text>
        </TouchableOpacity>
      ))}

      {selectedMed && (
        <>
          <Text style={styles.label}>Select Time:</Text>
          {timeSlots.map((t, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.item,
                selectedTime === t && styles.selectedItem
              ]}
              onPress={() => setSelectedTime(t)}
            >
              <Text>{t}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#888' }]}
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Reminder</Text>
        )}
      </TouchableOpacity>

      <Toast position="top" />
    </ScrollView>
  );
};

export default AddReminderScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f8fa',
    flexGrow: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10
  },
  selectedItem: {
    borderColor: '#4e8cff',
    backgroundColor: '#e6f0ff'
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
