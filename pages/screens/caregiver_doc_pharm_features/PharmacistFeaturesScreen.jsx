import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

const PharmacistFeaturesScreen = () => {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medRes, patRes, userRes] = await Promise.all([
        fetch(`${API_URL}/medication/`),
        fetch(`${API_URL}/patient/`),
        fetch(`${API_URL}/user/`)
      ]);
      setMedications(await medRes.json());
      setPatients(await patRes.json());
      setUsers(await userRes.json());
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patient_id === patientId);
    if (!patient) return 'Unknown';
    const user = users.find(u => u.user_id === patient.user_id);
    return user ? user.name : 'Unknown';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pharmacist - Medications</Text>
      {loading ? <ActivityIndicator size="large" color="#4e8cff" /> : (
        medications.map((m) => (
          <TouchableOpacity
            key={m.medication_id}
            style={styles.card}
            onPress={() => Toast.show({
              type: 'info',
              text1: 'Medication',
              text2: `${m.name} for ${getPatientName(m.patient_id)}`,
            })}
          >
            <Text style={styles.cardTitle}>{m.name}</Text>
            <Text style={styles.cardSub}>Patient: {getPatientName(m.patient_id)}</Text>
            <Text style={styles.cardSub}>Dosage: {m.dosage}</Text>
          </TouchableOpacity>
        ))
      )}
      <Toast position="top" />
    </ScrollView>
  );
};

export default PharmacistFeaturesScreen;

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
