import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { API_URL } from '../../services/api';

const ReportsScreen = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientFilter, setPatientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [patientFilter, statusFilter, reportData]);

  const fetchReportData = async () => {
    try {
      const [userRes, medRes, adhRes] = await Promise.all([
        fetch(`${API_URL}/user/`),
        fetch(`${API_URL}/medication/`),
        fetch(`${API_URL}/adherence/`),
      ]);

      const users = await userRes.json();
      const meds = await medRes.json();
      const adherence = await adhRes.json();

      const report = adherence.map((a) => {
        const med = meds.find((m) => m.medication_id === a.medication_id);
        const user = users.find((u) => med && u.user_id === med.patient_id);
        return {
          record_id: a.record_id,
          status: a.status,
          taken_at: a.taken_at,
          notes: a.notes,
          medication_name: med ? med.name : 'Unknown',
          dosage: med ? med.dosage : 'Unknown',
          patient_name: user ? user.name : `Patient ID ${med ? med.patient_id : 'N/A'}`,
        };
      });

      setReportData(report);
      setFilteredData(report);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load reports.' });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...reportData];
    if (patientFilter) {
      data = data.filter(r => r.patient_name.toLowerCase().includes(patientFilter.toLowerCase()));
    }
    if (statusFilter) {
      data = data.filter(r => r.status.toLowerCase().includes(statusFilter.toLowerCase()));
    }
    setFilteredData(data);
  };

  const exportPDF = async () => {
    if (filteredData.length === 0) {
      Toast.show({ type: 'info', text1: 'No data', text2: 'No reports to export.' });
      return;
    }

    const html = `
      <html>
        <body>
          <h1>Medication Adherence Report</h1>
          <table border="1" style="width:100%;border-collapse:collapse;">
            <tr>
              <th>Patient</th><th>Medication</th><th>Dosage</th><th>Status</th><th>Taken At</th><th>Notes</th>
            </tr>
            ${filteredData.map(r => `
              <tr>
                <td>${r.patient_name}</td>
                <td>${r.medication_name}</td>
                <td>${r.dosage}</td>
                <td>${r.status}</td>
                <td>${new Date(r.taken_at).toLocaleString()}</td>
                <td>${r.notes}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      Toast.show({ type: 'success', text1: 'Exported', text2: 'PDF generated successfully.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to export PDF.' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medication Adherence Reports</Text>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter by patient"
          value={patientFilter}
          onChangeText={setPatientFilter}
        />
        <TextInput
          style={styles.input}
          placeholder="Filter by status (taken/missed)"
          value={statusFilter}
          onChangeText={setStatusFilter}
        />
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportPDF}>
        <Text style={styles.exportButtonText}>Export as PDF</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" />
      ) : filteredData.length > 0 ? (
        filteredData.map((r) => (
          <TouchableOpacity
            key={r.record_id}
            style={styles.card}
            onPress={() => Toast.show({
              type: 'info',
              text1: `Adherence Record`,
              text2: `Status: ${r.status}`,
            })}
          >
            <Text style={styles.cardTitle}>{r.patient_name}</Text>
            <Text style={styles.cardSub}>Medication: {r.medication_name}</Text>
            <Text style={styles.cardSub}>Dosage: {r.dosage}</Text>
            <Text style={styles.cardSub}>Status: {r.status}</Text>
            <Text style={styles.cardSub}>Taken At: {new Date(r.taken_at).toLocaleString()}</Text>
            <Text style={styles.cardSub}>Notes: {r.notes}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noData}>No records match your filters.</Text>
      )}

      <Toast position="top" />
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f7f8fa', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4e8cff', marginBottom: 20, textAlign: 'center' },
  filterContainer: { marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  exportButton: { backgroundColor: '#4e8cff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  exportButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 16, color: '#666', marginTop: 2 },
  noData: { textAlign: 'center', color: '#666', fontSize: 16 },
});
