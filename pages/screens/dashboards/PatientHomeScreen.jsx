import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import MedicationScheduleScreen from "../patient_features/MedicationScheduleScreen";
import AdherenceTrackingScreen from "../patient_features/AdherenceTrackingScreen";
import EducationalResourcesScreen from "../patient_features/EducationalResourcesScreen";
import RemindersScreen from "../patient_features/RemindersScreen";
import MessagesScreen from "../shared/MessagesScreen";
import SettingsScreen from "../shared/Settings";

const Tab = createBottomTabNavigator();

const PatientHomeScreen = () => {
  const medications = [
    { id: 1, name: "Aspirin 100mg", schedule: "Once daily - Morning" },
    {
      id: 2,
      name: "Metformin 500mg",
      schedule: "Twice daily - Morning & Evening",
    },
    { id: 3, name: "Lisinopril 10mg", schedule: "Once daily - Evening" },
  ];

  useEffect(() => {
    sendNotification(
      "Med Adhere Reminder",
      "It's time for your morning medication."
    );
  }, []);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Schedule":
                iconName = "medkit";
                break;
              case "Settings":
                iconName = "settings";
                break;
              case "Adherence":
                iconName = "checkmark-circle";
                break;
              case "Resources":
                iconName = "book";
                break;
              case "Reminders":
                iconName = "alarm";
                break;
              case "Messages":
                iconName = "chatbubble";
                break;
              default:
                iconName = "ellipse";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Schedule" component={MedicationScheduleScreen} />
        <Tab.Screen name="Adherence" component={AdherenceTrackingScreen} />
        <Tab.Screen name="Resources" component={EducationalResourcesScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

      <Toast position="top" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    // padding: 20,
    backgroundColor: "#f7f8fa",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4e8cff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardSub: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});

export default PatientHomeScreen;
