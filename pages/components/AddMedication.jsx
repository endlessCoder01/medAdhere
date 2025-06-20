import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const AddMedicationScreen = ({ navigation }) => {
  const [medication, setMedication] = useState({
    patient_id: '', name: '', dosage: '', frequency: '',
    side_effects: '', notes: '', start_date: '', end_date: ''
  });

  const handleAdd = async () => {
    if (!medication.patient_id || !medication.name || !medication.dosage) {
      Toast.show({ type: 'error', text1: 'Validation', text2: 'Patient ID, name, dosage required' });
      return;
    }

    try {
      await fetch(`http://localhost:3001/medication/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication),
      });
      Toast.show({ type: 'success', text1: 'Added', text2: 'Medication created' });
      navigation.goBack();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Create failed' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Medication</Text>

      <TextInput
        style={styles.input}
        placeholder="Patient ID"
        keyboardType="numeric"
        value={medication.patient_id}
        onChangeText={text => setMedication({ ...medication, patient_id: text })}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={medication.start_date}
        onChangeText={text => setMedication({ ...medication, start_date: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={medication.end_date}
        onChangeText={text => setMedication({ ...medication, end_date: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default AddMedicationScreen;

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
