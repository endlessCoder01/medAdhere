import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
  Modal, TextInput
} from 'react-native';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../services/api';

const CaregiverFeaturesScreen = () => {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patRes, userRes, medRes] = await Promise.all([
        fetch(`${API_URL}/patient/`),
        fetch(`${API_URL}/user/`),
        fetch(`${API_URL}/medication`)
      ]);
      setPatients(await patRes.json());
      setUsers(await userRes.json());
      setMedications(await medRes.json());
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch data.' });
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.name : 'Unknown';
  };

  const getPatientMeds = (patientId) => {
    return medications.filter(m => m.patient_id === patientId);
  };

  const openAddMedModal = () => {
    setForm({ name: '', dosage: '', frequency: '', notes: '' });
    setEditMed(null);
    setModalVisible(true);
  };

  const openEditMedModal = (med) => {
    setForm({ name: med.name, dosage: med.dosage, frequency: med.frequency, notes: med.notes });
    setEditMed(med);
    setModalVisible(true);
  };

  const handleSaveMedication = async () => {
    if (!form.name || !form.dosage || !form.frequency) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill all fields' });
      return;
    }
    try {
      const method = editMed ? 'PATCH' : 'POST';
      const url = editMed
        ? `${API_URL}/medication/${editMed.medication_id}`
        : `${API_URL}/medication`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          patient_id: selectedPatient.patient_id,
          start_date: new Date(),
          end_date: new Date(),
          side_effects: 'N/A'
        })
      });
      if (res.ok) {
        Toast.show({ type: 'success', text1: editMed ? 'Medication Updated' : 'Medication Added' });
        fetchData();
        setModalVisible(false);
        setForm({ name: '', dosage: '', frequency: '', notes: '' });
        setEditMed(null);
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  const handleViewAdherence = (medication_id) => {
    Toast.show({
      type: 'info',
      text1: 'Adherence',
      text2: `View adherence for medication ID ${medication_id}`
    });
    // Optionally navigate or fetch adherence records
  };

  const handleAddReminder = (patient) => {
    Toast.show({
      type: 'info',
      text1: 'Add Reminder',
      text2: `Add reminder for ${getPatientName(patient.user_id)}`
    });
    // Optionally open modal or navigate
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caregiver - Patients</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" />
      ) : (
        patients.map((p) => (
          <TouchableOpacity
            key={p.patient_id}
            style={styles.card}
            onPress={() => setSelectedPatient(p)}
          >
            <Text style={styles.cardTitle}>{getPatientName(p.user_id)}</Text>
            <Text style={styles.cardSub}>History: {p.medical_history}</Text>
          </TouchableOpacity>
        ))
      )}

      {selectedPatient && (
        <View style={styles.details}>
          <Text style={styles.detailTitle}>Details for {getPatientName(selectedPatient.user_id)}</Text>
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
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => openEditMedModal(m)}>
                  <Text style={styles.smallBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn} onPress={() => handleViewAdherence(m.medication_id)}>
                  <Text style={styles.smallBtnText}>Adherence</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={openAddMedModal}>
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#4e8c99' }]} onPress={() => handleAddReminder(selectedPatient)}>
            <Text style={styles.buttonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {editMed ? 'Edit Medication' : 'Add Medication'}
            </Text>
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
            <TouchableOpacity style={styles.button} onPress={handleSaveMedication}>
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

export default CaregiverFeaturesScreen;

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
  smallBtn: { backgroundColor: '#4e8cff', padding: 6, borderRadius: 6, marginRight: 8 },
  smallBtnText: { color: '#fff', fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});
