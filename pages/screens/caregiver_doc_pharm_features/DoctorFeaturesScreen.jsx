import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

const DoctorFeaturesScreen = () => {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientRes, userRes] = await Promise.all([
        fetch('http://localhost:3001/patient/'),
        fetch('http://localhost:3001/user/')
      ]);
      const patientsData = await patientRes.json();
      const usersData = await userRes.json();

      setPatients(patientsData);
      setUsers(usersData);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch patients/users.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doctor's Patients</Text>
      {loading ? <ActivityIndicator size="large" color="#4e8cff" /> : (
        patients.map((p) => (
          <TouchableOpacity
            key={p.patient_id}
            style={styles.card}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Patient Selected',
                text2: `Viewing ${getUserName(p.user_id)}`,
              });
            }}
          >
            <Text style={styles.cardTitle}>{getUserName(p.user_id)}</Text>
            <Text style={styles.cardSub}>History: {p.medical_history}</Text>
          </TouchableOpacity>
        ))
      )}
      <Toast position="top" />
    </ScrollView>
  );
};

export default DoctorFeaturesScreen;

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
