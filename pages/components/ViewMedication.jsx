import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const ViewMedicationScreen = ({ route, navigation }) => {
  const { medicationId, patientId } = route.params || {};
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedication();
  }, []);

  const fetchMedication = async () => {
    try {
      const res = await fetch(`http://localhost:3001/medication/`);
      const data = await res.json();

      let med = null;
      if (medicationId) {
        med = data.find(m => m.medication_id === medicationId);
      } else if (patientId) {
        med = data.find(m => m.patient_id === patientId);
      }

      if (med) {
        setMedication(med);
      } else {
        Toast.show({ type: 'error', text1: 'Not found', text2: 'Medication not found' });
        navigation.goBack();
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load medication' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4e8cff" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Details</Text>

      <Text style={styles.item}><Text style={styles.label}>Name:</Text> {medication.name}</Text>
      <Text style={styles.item}><Text style={styles.label}>Dosage:</Text> {medication.dosage}</Text>
      <Text style={styles.item}><Text style={styles.label}>Frequency:</Text> {medication.frequency}</Text>
      <Text style={styles.item}><Text style={styles.label}>Side Effects:</Text> {medication.side_effects}</Text>
      <Text style={styles.item}><Text style={styles.label}>Notes:</Text> {medication.notes}</Text>
      <Text style={styles.item}><Text style={styles.label}>Start:</Text> {medication.start_date}</Text>
      <Text style={styles.item}><Text style={styles.label}>End:</Text> {medication.end_date}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditMedication', { medicationId: medication.medication_id })}
      >
        <Text style={styles.buttonText}>Edit Medication</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default ViewMedicationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
