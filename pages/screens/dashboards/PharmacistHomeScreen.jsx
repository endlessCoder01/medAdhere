import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

const PharmacistHomeScreen = ({ navigation }) => {
  const showFeatureToast = (feature) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: `${feature} will be available soon!`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, Pharmacist</Text>

      <TouchableOpacity style={styles.card} onPress={() => showFeatureToast('Patient Medications')}>
        <Text style={styles.cardText}>Patient Medications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => showFeatureToast('Inventory')}>
        <Text style={styles.cardText}>Inventory</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => showFeatureToast('Reports')}>
        <Text style={styles.cardText}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => showFeatureToast('Messages')}>
        <Text style={styles.cardText}>Messages</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f7f8fa',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
});


export default PharmacistHomeScreen;
