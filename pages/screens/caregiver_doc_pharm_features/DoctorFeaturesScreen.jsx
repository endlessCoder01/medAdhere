import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, TextInput
} from 'react-native';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../services/api';

const DoctorFeaturesScreen = () => {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientRes, userRes, medRes] = await Promise.all([
        fetch(`${API_URL}/patient/`),
        fetch(`${API_URL}/user/`),
        fetch(`${API_URL}/medication`)
      ]);
      const patientsData = await patientRes.json();
      const usersData = await userRes.json();
      const medData = await medRes.json();

      setPatients(patientsData);
      setUsers(usersData);
      setMedications(medData);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.name : 'Unknown';
  };

  const getPatientMeds = (patientId) => {
    return medications.filter(m => m.patient_id === patientId);
  };

  const handleAddMedication = async () => {
    if (!form.name || !form.dosage || !form.frequency) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Fill all fields' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/medication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          patient_id: selectedPatient.patient_id,
          start_date: new Date(),
          end_date: new Date(),  // Ideally from a date picker
          side_effects: 'N/A',
          notes: form.notes || 'N/A'
        })
      });
      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Medication Added' });
        fetchData();
        setModalVisible(false);
        setForm({ name: '', dosage: '', frequency: '', notes: '' });
      } else {
        throw new Error('Add failed');
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doctor's Patients</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" />
      ) : (
        patients.map(p => (
          <TouchableOpacity
            key={p.patient_id}
            style={styles.card}
            onPress={() => setSelectedPatient(p)}
          >
            <Text style={styles.cardTitle}>{getUserName(p.user_id)}</Text>
            <Text style={styles.cardSub}>History: {p.medical_history}</Text>
          </TouchableOpacity>
        ))
      )}

      {selectedPatient && (
        <View style={styles.details}>
          <Text style={styles.detailTitle}>Details for {getUserName(selectedPatient.user_id)}</Text>
          <Text>Medical History: {selectedPatient.medical_history}</Text>
          <Text>Caregiver ID: {selectedPatient.caregiver_id}</Text>
          <Text>Doctor ID: {selectedPatient.doctor_id}</Text>
          <Text>Pharmacist ID: {selectedPatient.pharmacist_id}</Text>

          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Medications:</Text>
          {getPatientMeds(selectedPatient.patient_id).map(m => (
            <View key={m.medication_id} style={styles.medCard}>
              <Text>Name: {m.name}</Text>
              <Text>Dosage: {m.dosage}</Text>
              <Text>Frequency: {m.frequency}</Text>
              <Text>Notes: {m.notes}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>

          {/* Placeholder for add reminder / edit med */}
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add Medication</Text>
            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={t => setForm({ ...form, name: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Dosage"
              value={form.dosage}
              onChangeText={t => setForm({ ...form, dosage: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Frequency"
              value={form.frequency}
              onChangeText={t => setForm({ ...form, frequency: t })}
              style={styles.input}
            />
            <TextInput
              placeholder="Notes"
              value={form.notes}
              onChangeText={t => setForm({ ...form, notes: t })}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddMedication}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast position="top" />
    </ScrollView>
  );
};

export default DoctorFeaturesScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f8fa', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4e8cff', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 16, color: '#666', marginTop: 5 },
  details: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 10, elevation: 3 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  medCard: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 5 },
  button: { backgroundColor: '#4e8cff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});
