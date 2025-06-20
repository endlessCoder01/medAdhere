import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Vibration,
} from "react-native";
import Toast from "react-native-toast-message";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import { API_URL } from "../../services/api";

const { width } = Dimensions.get("window");

const MedicationScheduleScreen = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState(null);

  useEffect(() => {
    fetchMedications();
        const interval = setInterval(fetchMedications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMedications = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) throw new Error("No user info");
      const user = JSON.parse(userData);

      const res = await fetch(`${API_URL}/medication/patient/${user.user_id}`);
      const data = await res.json();

      const now = new Date();
      const activeMeds = data.filter((med) => {
        const start = new Date(med.start_date);
        const end = new Date(med.end_date);
        return now >= start && now <= end;
      });

      setMedications(activeMeds);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to load medication schedule",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsTaken = async (med) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/adherence/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication_id: med.medication_id,
          taken_at: new Date().toISOString(),
          status: "taken",
          notes: "Marked from app",
        }),
      });

      if (!res.ok) throw new Error("Server error");

      Toast.show({
        type: "success",
        text1: "Dose recorded",
        text2: `${med.name} marked as taken.`,
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to mark as taken",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllAsTaken = async () => {
    Vibration.vibrate(100);
    setLoading(true);
    try {
      for (const med of medications) {
        await markAsTaken(med);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRightActions = (med) => (
    <TouchableOpacity
      style={styles.swipeButton}
      onPress={() => markAsTaken(med)}
    >
      <Text style={styles.swipeText}>Mark as Taken</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4e8cff" />
        </View>
      )}

      <BackgroundBlobs />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Medication Schedule</Text>

        {medications.length > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsTaken}
          >
            <Text style={styles.markAllText}>Mark All As Taken</Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4e8cff"
            style={{ marginTop: 20 }}
          />
        ) : medications.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No active medications right now.
          </Text>
        ) : (
          medications.map((item, idx) => {
            const overdue = new Date() > new Date(item.end_date);
            return (
              <Swipeable
                key={item.medication_id}
                renderRightActions={() => renderRightActions(item)}
              >
                <BlurView
                  intensity={18}
                  tint="light"
                  style={[styles.cardWrap, shadowForIdx(idx)]}
                >
                  <LinearGradient
                    colors={
                      overdue ? ["#ffe5e5", "#ffcccc"] : ["#fff0", "#e3f0ff99"]
                    }
                    start={[0.5, 0]}
                    end={[1, 1]}
                    style={styles.card}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedMed(item)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSub}>Dosage: {item.dosage}</Text>
                      <Text style={styles.cardSub}>
                        Frequency: {item.frequency}
                      </Text>
                      <Text style={styles.cardSub}>Notes: {item.notes}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </BlurView>
              </Swipeable>
            );
          })
        )}

        <Toast position="top" />
      </ScrollView>

      {/* Modal for detailed view */}
      <Modal
        visible={!!selectedMed}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMed(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedMed?.name}</Text>
            <Text style={styles.modalText}>Dosage: {selectedMed?.dosage}</Text>
            <Text style={styles.modalText}>
              Frequency: {selectedMed?.frequency}
            </Text>
            <Text style={styles.modalText}>
              Side Effects: {selectedMed?.side_effects}
            </Text>
            <Text style={styles.modalText}>Notes: {selectedMed?.notes}</Text>
            <Text style={styles.modalText}>
              Start: {new Date(selectedMed?.start_date).toLocaleDateString()}
            </Text>
            <Text style={styles.modalText}>
              End: {new Date(selectedMed?.end_date).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSelectedMed(null)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicationScheduleScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: '#00000033',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 99,
},

  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
    color: "#4e8cff",
    marginBottom: 20,
  },
  cardWrap: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    minHeight: 72,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#243358",
  },
  cardSub: {
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.85,
    color: "#4e8cff99",
  },
  swipeButton: {
    backgroundColor: "#4e8cff",
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    marginVertical: 4,
  },
  swipeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  markAllButton: {
    backgroundColor: "#1dc48b",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  markAllText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4e8cff",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4e8cff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
});

const BackgroundBlobs = () => (
  <View style={StyleSheet.absoluteFill}>
    <LinearGradient
      colors={["#f7f8fa", "#cbe7ff", "#a3f2ca"]}
      start={[0.7, 0.5]}
      end={[1, 1]}
      style={StyleSheet.absoluteFill}
    />
    <View
      style={[
        blobStyles.blob,
        blobStyles.blob1,
        { backgroundColor: "#4e8cff77" },
      ]}
    />
    <View
      style={[
        blobStyles.blob,
        blobStyles.blob2,
        { backgroundColor: "#1dc48b66" },
      ]}
    />
    <View
      style={[
        blobStyles.blob,
        blobStyles.blob3,
        { backgroundColor: "#e03d3d55" },
      ]}
    />
  </View>
);

const blobStyles = StyleSheet.create({
  blob: {
    position: "absolute",
    opacity: 0.44,
    borderRadius: 100,
    zIndex: 0,
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

function shadowForIdx(idx) {
  const offsets = [
    { x: 0, y: 4 },
    { x: 0, y: 5 },
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 6 },
  ];
  return {
    shadowOffset: offsets[idx % offsets.length],
  };
}
