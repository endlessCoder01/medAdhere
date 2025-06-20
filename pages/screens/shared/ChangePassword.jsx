import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import md5 from "react-native-md5";
import { API_URL } from "../../services/api";


const ChangePasswordScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const savePassword = async () => {
    if (password !== confirm) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Password too short' });
      return;
    }

    try {
              const password_harsh = md5.hex_md5(password);
      await fetch(`${API_URL}/user/${user.user_id}/password_harsh`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: password_harsh }),  
      });
      Toast.show({ type: 'success', text1: 'Password Changed', text2: 'Your password was updated' });
      setTimeout(() => navigation.goBack(), 1000);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to change password' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={savePassword}>
        <Text style={styles.buttonText}>Save Password</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fa' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4e8cff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  button: { backgroundColor: '#4e8cff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
