import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../services/api';

const ChangeLanguageScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [selectedLang, setSelectedLang] = useState(user.language_pref || 'english');

  const saveLanguage = async () => {
    try {
      await fetch(`${API_URL}/user/${user.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language_pref: selectedLang }),
      });
      Toast.show({ type: 'success', text1: 'Language Changed', text2: `Now using ${selectedLang}` });
      setTimeout(() => navigation.goBack(), 1000);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to change language' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>

      {['english', 'spanish', 'french'].map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.langButton,
            selectedLang === lang && { backgroundColor: '#4e8cff' }
          ]}
          onPress={() => setSelectedLang(lang)}
        >
          <Text style={[
            styles.langText,
            selectedLang === lang && { color: '#fff' }
          ]}>
            {lang.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveLanguage}>
        <Text style={styles.saveButtonText}>Save Language</Text>
      </TouchableOpacity>

      <Toast position="top" />
    </View>
  );
};

export default ChangeLanguageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fa' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4e8cff', marginBottom: 20, textAlign: 'center' },
  langButton: { padding: 15, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, marginBottom: 10 },
  langText: { fontSize: 16, textAlign: 'center' },
  saveButton: { backgroundColor: '#4e8cff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
