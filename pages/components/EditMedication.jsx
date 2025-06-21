import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { API_URL } from '../services/api';

const EditMedicationScreen = ({ route, navigation }) => {
  const { medicationId } = route.params;
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedication();
  }, []);

  const fetchMedication = async () => {
    try {
      const res = await fetch(`${API_URL}/medication/`);
      const data = await res.json();
      const med = data.find(m => m.medication_id === medicationId);
      if (med) {
        setMedication(med);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Medication not found' });
        navigation.goBack();
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load medication' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!medication.name || !medication.dosage || !medication.frequency) {
      Toast.show({ type: 'error', text1: 'Validation', text2: 'Name, dosage, frequency required' });
      return;
    }
    try {
      await fetch(`${API_URL}/medication/${medicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication),
      });
      Toast.show({ type: 'success', text1: 'Saved', text2: 'Medication updated' });
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Update failed' });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4e8cff" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Medication</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={medication.name}
        onChangeText={text => setMedication({ ...medication, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={medication.dosage}
        onChangeText={text => setMedication({ ...medication, dosage: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Frequency"
        value={medication.frequency}
        onChangeText={text => setMedication({ ...medication, frequency: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Side Effects"
        value={medication.side_effects}
        onChangeText={text => setMedication({ ...medication, side_effects: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={medication.notes}
        onChangeText={text => setMedication({ ...medication, notes: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default EditMedicationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
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
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
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
