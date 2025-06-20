import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CaregiverFeaturesScreen from '../caregiver_doc_pharm_features/CaregiverFeaturesScreen';
import MessagesScreen from '../shared/MessagesScreen';
import SettingsScreen from '../shared/Settings';

const Tab = createBottomTabNavigator();

const CaregiverHomeScreen = () => {
  useEffect(() => {
    sendNotification("Med Adhere Caregiver", "Patients need your attention.");
  }, []);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Patients') iconName = 'heart';
            else if (route.name === 'Messages') iconName = 'chatbubble';            
            else if (route.name === 'Settings') iconName = 'settings';
            else iconName = 'ellipse';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Patients" component={CaregiverFeaturesScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <Toast position="top" />
    </>
  );
};

export default CaregiverHomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f8fa',
    flexGrow: 1,
  },
});
