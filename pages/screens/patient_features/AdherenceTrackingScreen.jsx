import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Modal, StatusBar, Dimensions, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../services/api';

const { width } = Dimensions.get('window');

export default function AdherenceTrackingScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      if (!userData) throw new Error('No user info');
      const user = JSON.parse(userData);

      const medRes = await fetch(`${API_URL}/medication/patient/${user.user_id}`);
      const meds = await medRes.json();

      let allRecords = [];

      for (const med of meds) {
        const adhRes = await fetch(`${API_URL}/adherence/medication/${med.medication_id}`);
        const adhs = await adhRes.json();

        adhs.forEach(a => {
          allRecords.push({
            record_id: a.record_id,
            medication_name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            taken_at: a.taken_at,
            status: a.status,
            notes: a.notes,
            med: med
          });
        });
      }

      setRecords(allRecords);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f8fa' }}>
      <StatusBar barStyle="dark-content" />
      <BackgroundBlobs />

      <View style={styles.header}>
        <Text style={styles.title}>Adherence Tracking</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {records.map((rec, idx) => (
            <TouchableOpacity key={rec.record_id} onPress={() => setSelectedRecord(rec)}>
              <BlurView intensity={15} tint="light" style={[styles.cardWrap]}>
                <LinearGradient
                  colors={['#fff0', '#e3f0ff99']}
                  start={[0.5, 0]}
                  end={[1, 1]}
                  style={styles.card}
                >
                  <Text style={styles.cardTitle}>{rec.medication_name}</Text>
                  <Text style={styles.cardSub}>{new Date(rec.taken_at).toLocaleDateString()}</Text>
                  <StatusChip status={rec.status} />
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal for details */}
      <Modal
        visible={!!selectedRecord}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRecord(null)}
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            {selectedRecord && (
              <>
                <Text style={modalStyles.modalTitle}>{selectedRecord.medication_name}</Text>
                <Text style={modalStyles.modalText}>Dosage: {selectedRecord.dosage}</Text>
                <Text style={modalStyles.modalText}>Frequency: {selectedRecord.frequency}</Text>
                <Text style={modalStyles.modalText}>Status: {selectedRecord.status}</Text>
                <Text style={modalStyles.modalText}>Taken At: {new Date(selectedRecord.taken_at).toLocaleString()}</Text>
                <Text style={modalStyles.modalText}>Notes: {selectedRecord.notes}</Text>
                <Text style={modalStyles.modalText}>Side Effects: {selectedRecord.med.side_effects}</Text>
                <Text style={modalStyles.modalText}>Prescribed Notes: {selectedRecord.med.notes}</Text>
                <TouchableOpacity style={modalStyles.closeButton} onPress={() => setSelectedRecord(null)}>
                  <Text style={modalStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Toast position="top" />
    </View>
  );
}

// Status chip
function StatusChip({ status }) {
  const isTaken = status.toLowerCase() === "taken";
  return (
    <View style={[
      chipStyles.chip,
      {
        backgroundColor: isTaken ? "#a3f2ca" : "#f2a3a3",
        borderColor: isTaken ? "#1dc48b" : "#e03d3d",
      }
    ]}>
      <Text style={[
        chipStyles.chipText,
        { color: isTaken ? "#228c5b" : "#e03d3d" }
      ]}>
        {isTaken ? "✔ Taken" : "✖ Missed"}
      </Text>
    </View>
  );
}

// Background blobs
function BackgroundBlobs() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#f7f8fa', '#cbe7ff', '#a3f2ca']}
        start={[0.7, 0.5]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[blobStyles.blob, blobStyles.blob1, { backgroundColor: "#4e8cff77" }]} />
      <View style={[blobStyles.blob, blobStyles.blob2, { backgroundColor: "#1dc48b66" }]} />
      <View style={[blobStyles.blob, blobStyles.blob3, { backgroundColor: "#e03d3d55" }]} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#4e8cff',
  },
  cardWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#243358',
  },
  cardSub: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.85,
    marginBottom: 4,
    color: '#4e8cff99',
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  }
});

const blobStyles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.44,
    borderRadius: 100,
  },
  blob1: {
    width: width * 0.7,
    height: width * 0.7,
    left: -width * 0.18,
    top: -width * 0.2,
  },
  blob2: {
    width: width * 0.4,
    height: width * 0.33,
    right: -width * 0.09,
    top: width * 0.33,
  },
  blob3: {
    width: width * 0.5,
    height: width * 0.38,
    left: -width * 0.12,
    bottom: -width * 0.15,
  },
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4e8cff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
