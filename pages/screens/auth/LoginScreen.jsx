import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import md5 from "react-native-md5";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast(
        "error",
        "Validation Error",
        "Please enter both email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const password_harsh = md5.hex_md5(password);
      console.log(password_harsh);
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password_harsh }),
      });

      const data = await response.json();
      // console.log("stored", data)

      AsyncStorage.setItem("userInfo", JSON.stringify(data));

      if (response.ok) {
        showToast("success", "Login Successful", "Welcome back!");
        // Navigate based on role
        setTimeout(() => {
          if (data.role === "patient") navigation.replace("PatientHome");
          else if (data.role === "doctor") navigation.replace("DoctorHome");
          else if (data.role === "caregiver")
            navigation.replace("CaregiverHome");
          else if (data.role === "pharmacist")
            navigation.replace("PharmacistHome");
          else showToast("info", "Info", "Role not recognized");
        }, 1000);
      } else {
        showToast(
          "error",
          "Login Failed",
          data.message || "Invalid credentials."
        );
      }
    } catch (err) {
      showToast("error", "Network Error", "Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../../images/medAdhere.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#999"
            style={{ marginLeft: -35 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#4e8cff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#4e8cff",
    marginTop: 10,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
});

export default LoginScreen;
