import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../services/api";

const { width } = Dimensions.get("window");

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [fabAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchReminders();
    sendNotification("Med Adhere Reminder", "You have a medication due soon.");
    const interval = setInterval(fetchReminders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) throw new Error("No user info");
      const user = JSON.parse(userData);

      const medRes = await fetch(
        `${API_URL}/medication/patient/${user.user_id}`
      );
      if (!medRes.ok) throw new Error("Failed to fetch medications");
      const medications = await medRes.json();

      let combinedReminders = [];

      for (const med of medications) {
        const remRes = await fetch(
          `${API_URL}/reminders/medication/${med.medication_id}`
        );
        if (!remRes.ok) continue;
        const medReminders = await remRes.json();

        medReminders.forEach((r) => {
          combinedReminders.push({
            id: r.reminder_id,
            title: med.name,
            time: r.reminder_time,
            channel: r.channel,
          });
        });
      }

      setReminders(combinedReminders);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to load reminders",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 1 },
    });
  };

  const handleReminderPress = async (reminder) => {
    Toast.show({
      type: "success",
      text1: "Reminder Acknowledged",
      text2: `${reminder.title} at ${formatTime(reminder.time)}`,
    });

    // Example future server mark
    /*
    await fetch(`${API_URL}/reminder/done/${reminder.id}`, {
      method: 'POST'
    });
    */
  };

  const handleFabPressIn = () => {
    Animated.spring(fabAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();

    Notifications.scheduleNotificationAsync({
      content: { title: "New Reminder", body: "You are adding a reminder." },
      trigger: { seconds: 1 },
    });

    navigation.navigate("AddReminder");
  };

  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute, second] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute, second);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
      <StatusBar barStyle="dark-content" />
      <BackgroundBlobs />

      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4e8cff"
          style={{ marginTop: 30 }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {reminders.length > 0 ? (
            reminders.map((reminder, idx) => (
              <BlurView
                key={reminder.id}
                intensity={19}
                tint="light"
                style={[styles.cardWrap, shadowForIdx(idx)]}
              >
                <LinearGradient
                  colors={["#fff0", "#e3f0ff99"]}
                  start={[0.5, 0]}
                  end={[1, 1]}
                  style={styles.card}
                >
                  <TouchableOpacity
                    onPress={() => handleReminderPress(reminder)}
                    onLongPress={() =>
                      Toast.show({
                        type: "info",
                        text1: "Hold detected",
                        text2: "Future: Remove reminder logic here",
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cardTitle}>{reminder.title}</Text>
                    <Text style={styles.cardSub}>
                      Time: {formatTime(reminder.time)}
                    </Text>
                    <Text style={styles.cardSub}>
                      Channel: {reminder.channel}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </BlurView>
            ))
          ) : (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ fontSize: 60 }}>🔔</Text>
              <Text style={{ textAlign: "center", color: "#666" }}>
                No reminders found. Tap + to add one!
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.7}
          accessibilityLabel="Add new reminder"
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </Animated.View>

      <Toast position="top" />
    </View>
  );
}

function BackgroundBlobs() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#f7f8fa", "#cbe7ff", "#a3f2ca"]}
        start={[0.7, 0.5]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          blobStyles.blob,
          blobStyles.blob1,
          { backgroundColor: "#4e8cff77" },
        ]}
      />
      <Animated.View
        style={[
          blobStyles.blob,
          blobStyles.blob2,
          { backgroundColor: "#1dc48b66" },
        ]}
      />
      <Animated.View
        style={[
          blobStyles.blob,
          blobStyles.blob3,
          { backgroundColor: "#e03d3d55" },
        ]}
      />
    </View>
  );
}

function shadowForIdx(idx) {
  const offsets = [
    { x: 0, y: 8 },
    { x: 0, y: 9 },
    { x: 0, y: 7 },
    { x: 0, y: 6 },
    { x: 0, y: 10 },
  ];
  return {
    shadowOffset: offsets[idx % offsets.length],
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 5,
  };
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
    color: "#4e8cff",
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
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4e8cff",
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  fabIcon: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

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
