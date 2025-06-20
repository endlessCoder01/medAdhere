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
import AddReminderScreen from "./pages/components/AddReminder"

import Toast from 'react-native-toast-message';


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
      <Stack.Screen name="AddReminder" component={AddReminderScreen} />
      </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
