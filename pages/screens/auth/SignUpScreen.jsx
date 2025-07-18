import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import md5 from "react-native-md5";
import { API_URL } from '../../services/api';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language_pref,setLanguage_pref] = useState('english');
  const [phone,setPhone] = useState();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      showToast('error', 'Validation Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
     const password_harsh = md5.hex_md5(password);
      const response = await fetch(`${API_URL}/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_harsh, role, phone, language_pref }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Signup Successful', 'You can now login.');
        setTimeout(() => navigation.replace('Login'), 1000);
      } else {
        showToast('error', 'Signup Failed', data.message || 'Please try again.');
      }

    } catch (err) {
      console.log(err)
      showToast('error', 'Network Error', 'Please check your connection.');
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
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#999"
        keyboardType="keypad"
        autoCapitalize="none"
        value={phone}
        onChangeText={setPhone}
      />

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
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#999"
            style={{ marginLeft: -35 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={{ color: '#333' }}
        >
          <Picker.Item label="Patient" value="patient" />
          <Picker.Item label="Doctor" value="doctor" />
          <Picker.Item label="Caregiver" value="caregiver" />
          <Picker.Item label="Pharmacist" value="pharmacist" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={language_pref}
          onValueChange={setLanguage_pref}
          style={{ color: '#333' }}
        >
          <Picker.Item label="Select Your Preferred Language" value="" />
          <Picker.Item label="English" value="english" />
          <Picker.Item label="Spanish" value="spanish" />
          <Picker.Item label="Chinesse (Mandarin)" value="mandarin" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
      <Toast position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#4e8cff',
    marginTop: 10,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
});


export default SignupScreen;
