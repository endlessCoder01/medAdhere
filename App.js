import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/screens/auth/LoginScreen";
import SignupScreen from "./pages/screens/auth/SignUpScreen";
import SplashScreen from "./pages/screens/auth/SplashScreen";
import DoctorHomeScreen from "./pages/screens/dashboards/DoctorHomescreen";
import PatientHomeScreen from "./pages/screens/dashboards/PatientHomeScreen";
import CaregiverHomeScreen from "./pages/screens/dashboards/CaregiverHomeScreen";
import PharmacistHomeScreen from "./pages/screens/dashboards/PharmacistHomeScreen";
import ChangeLanguageScreen from "./pages/screens/shared/ChangeLanguage";

import AddReminderScreen from "./pages/components/AddReminder"
import EditMedicationScreen from "./pages/components/EditMedication"
import AddMedicationScreen from "./pages/components/AddMedication"
import ViewMedicationScreen from "./pages/components/ViewMedication"
import SettingsScreen from "./pages/screens/shared/Settings";
import ReportsScreen from "./pages/screens/shared/Reports";

import Toast from 'react-native-toast-message';
import ChangePasswordScreen from "./pages/screens/shared/ChangePassword";
import ChatScreen from "./pages/screens/shared/ChatScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
      <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
      <Stack.Screen name="CaregiverHome" component={CaregiverHomeScreen} />
      <Stack.Screen name="PharmacistHome" component={PharmacistHomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      <Stack.Screen name="AddReminder" component={AddReminderScreen} />

      <Stack.Screen name="EditMedication" component={EditMedicationScreen} />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
      <Stack.Screen name="ViewMedication" component={ViewMedicationScreen} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguageScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
