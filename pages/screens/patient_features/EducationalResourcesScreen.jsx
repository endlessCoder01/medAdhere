import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const EducationalResourcesScreen = () => {
  const resources = [
    { id: 1, title: 'Understanding Hypertension', type: 'Article' },
    { id: 2, title: 'How to take Metformin', type: 'Video' },
    { id: 3, title: 'Healthy Eating for Diabetes', type: 'Tutorial' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Educational Resources</Text>

      {resources.map((res) => (
        <TouchableOpacity
          key={res.id}
          style={styles.card}
          onPress={() => Toast.show({
            type: 'info',
            text1: 'Opening Resource',
            text2: `${res.title} (${res.type})`,
          })}
        >
          <Text style={styles.cardTitle}>{res.title}</Text>
          <Text style={styles.cardSub}>Type: {res.type}</Text>
        </TouchableOpacity>
      ))}

      <Toast position="top" />
    </ScrollView>
  );
};

export default EducationalResourcesScreen;

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
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSub: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});
