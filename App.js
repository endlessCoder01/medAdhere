import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/screens/auth/LoginScreen";
import SignupScreen from "./pages/screens/auth/SignUpScreen";
import SplashScreen from "./pages/screens/auth/SplashScreen";
// import PatientHomeScreen from "./screens/PatientHomeScreen";
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
      </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
