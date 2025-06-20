import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      console.log("response", userData);

      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No user info found' });
        navigation.replace('Login');
      }
    } catch  {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load user info' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Toast.show({ type: 'success', text1: 'Logged Out', text2: 'You have been logged out.' });
      setTimeout(() => navigation.replace('Login'), 1000);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to log out' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" />
      ) : user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Name: {user.name}</Text>
            <Text style={styles.cardSub}>Email: {user.email}</Text>
            <Text style={styles.cardSub}>Phone: {user.phone}</Text>
            <Text style={styles.cardSub}>Role: {user.role}</Text>
            <Text style={styles.cardSub}>Language: {user.language_pref}</Text>
            <Text style={styles.cardSub}>Joined: {new Date(user.created_at).toLocaleDateString()}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangeLanguage', { user })}>
            <Text style={styles.buttonText}>Change Language</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangePassword', { user })}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noUser}>User information unavailable</Text>
      )}

      <Toast position="top" />
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f8fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardSub: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noUser: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
