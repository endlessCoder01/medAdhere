import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
  Modal, TextInput
} from 'react-native';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../services/api';

const PharmacistFeaturesScreen = ({ navigation }) => {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', notes: '' });

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
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch data.' });
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

  const openAddMedModal = () => {
    setForm({ name: '', dosage: '', frequency: '', notes: '' });
    setEditMed(null);
    setModalVisible(true);
  };

  const openEditMedModal = (med) => {
    setForm({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      notes: med.notes
    });
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
          patient_id: editMed ? editMed.patient_id : patients[0]?.patient_id,
          start_date: new Date(),
          end_date: new Date(),
          side_effects: 'N/A'
        })
      });

      if (res.ok) {
        Toast.show({ type: 'success', text1: editMed ? 'Medication Updated' : 'Medication Added' });
        fetchData();
        setModalVisible(false);
      } else {
        throw new Error('Save failed');
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  const handleViewAdherence = (medication_id) => {
    // Simulate navigation or replace with: navigation.navigate('AdherenceScreen', { medication_id })
    Toast.show({ type: 'info', text1: 'Adherence', text2: `View adherence for ID ${medication_id}` });
  };

  const handleAddReminder = async (med) => {
    try {
      const res = await fetch(`${API_URL}/reminders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: med.medication_id,
          reminder_time: '08:00:00',
          recurrence: 1,
          channel: 'app'
        })
      });
      if (res.ok) {
        Toast.show({ type: 'success', text1: 'Reminder Added', text2: `For ${med.name}` });
      } else {
        throw new Error('Add reminder failed');
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pharmacist - Medications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" />
      ) : (
        <>
          {medications.map(m => (
            <View key={m.medication_id} style={styles.card}>
              <Text style={styles.cardTitle}>{m.name}</Text>
              <Text style={styles.cardSub}>Patient: {getPatientName(m.patient_id)}</Text>
              <Text style={styles.cardSub}>Dosage: {m.dosage}</Text>
              <Text style={styles.cardSub}>Frequency: {m.frequency}</Text>
              <Text style={styles.cardSub}>Notes: {m.notes}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => openEditMedModal(m)}>
                  <Text style={styles.smallBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn} onPress={() => handleViewAdherence(m.medication_id)}>
                  <Text style={styles.smallBtnText}>Adherence</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn} onPress={() => handleAddReminder(m)}>
                  <Text style={styles.smallBtnText}>Add Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={openAddMedModal}>
            <Text style={styles.buttonText}>Add Medication</Text>
          </TouchableOpacity>
        </>
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

export default PharmacistFeaturesScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f8fa', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4e8cff', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 16, color: '#666', marginTop: 5 },
  button: { backgroundColor: '#4e8cff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  smallBtn: { backgroundColor: '#4e8cff', padding: 6, borderRadius: 6, marginRight: 8, marginTop: 5 },
  smallBtnText: { color: '#fff', fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});
