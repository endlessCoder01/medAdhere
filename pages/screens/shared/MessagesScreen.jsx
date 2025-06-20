import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Animated, StatusBar, Dimensions, ActivityIndicator, Modal, TextInput
} from 'react-native';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../services/api';

const { width } = Dimensions.get('window');

export default function MessagesScreen({ navigation }) {
  const theme = lightTheme;
  const [fabAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [composeVisible, setComposeVisible] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    fetchMessages();
    fetchStaff();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFabPressIn = () => {
    Animated.spring(fabAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
    setComposeVisible(true);
  };

  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  const fetchMessages = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      if (!userData) throw new Error('No user info');
      const user = JSON.parse(userData);

      const res = await fetch(`${API_URL}/message/${user.user_id}`);
      const messages = await res.json();

      const unseen = messages.filter(m => m.status === 'unseen');

      const groups = {};

      for (const msg of unseen) {
        if (!groups[msg.sender_id]) {
          const senderRes = await fetch(`${API_URL}/user/${msg.sender_id}`);
          const sender = await senderRes.json();
          groups[msg.sender_id] = {
            senderName: sender.name,
            senderId: sender.user_id,
            count: 0,
          };
        }
        groups[msg.sender_id].count += 1;
      }

      setGroupedMessages(Object.values(groups));
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to load messages' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API_URL}/user/staffrole`);
      const data = await res.json();
      setStaffList(data);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load staff list' });
    }
  };

  const sendMessage = async () => {
    try {
      if (!selectedStaff || !messageContent.trim()) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Select a receiver and write a message.' });
        return;
      }

      const userData = await AsyncStorage.getItem('userInfo');
      const user = JSON.parse(userData);

      await fetch(`${API_URL}/message/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.user_id,
          receiver_id: selectedStaff.user_id,
          content: messageContent.trim(),
          status: 'unseen'
        })
      });

      Toast.show({ type: 'success', text1: 'Sent', text2: 'Message sent successfully' });
      setComposeVisible(false);
      setMessageContent('');
      setSelectedStaff(null);
      fetchMessages();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send message' });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle="dark-content" />
      <MessagesBackground />

      <View style={[styles.header, { backgroundColor: theme.headerBg, shadowColor: theme.headerShadow }]}>
        <Text style={[styles.title, { color: theme.title }]}>Messages</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {groupedMessages.length > 0 ? (
            groupedMessages.map((group, idx) => (
              <TouchableOpacity
                key={group.senderId}
                activeOpacity={0.94}
                style={{ marginBottom: 18 }}
                onPress={() => navigation.navigate('ChatScreen', { senderId: group.senderId, senderName: group.senderName })}
              >
                <BlurView
                  tint="light"
                  intensity={theme.blurIntensity}
                  style={[styles.cardWrap, { shadowColor: theme.shadow }, shadowForIdx(idx)]}
                >
                  <LinearGradient
                    colors={theme.cardGradient}
                    start={[0.4, 0]}
                    end={[1, 1]}
                    style={[styles.card, { backgroundColor: theme.cardBg }]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.cardTitle, { color: theme.cardTitle, flex: 1 }]}>
                        From: {group.senderName}
                      </Text>
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{group.count}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>
              No unseen messages.
            </Text>
          )}
        </ScrollView>
      )}

      <Animated.View style={[
        styles.fab,
        {
          backgroundColor: theme.fabBg,
          shadowColor: theme.fabShadow,
          transform: [{ scale: fabScale }],
        }
      ]}>
        <TouchableOpacity
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.7}
        >
          <Text style={[styles.fabIcon, { color: theme.fabIcon }]}>✉️</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={composeVisible} transparent animationType="slide" onRequestClose={() => setComposeVisible(false)}>
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Compose Message</Text>
            <ScrollView style={{ maxHeight: 150 }}>
              {staffList.map(staff => (
                <TouchableOpacity
                  key={staff.user_id}
                  style={[
                    modalStyles.receiverItem,
                    selectedStaff?.user_id === staff.user_id && { backgroundColor: '#4e8cff33' }
                  ]}
                  onPress={() => setSelectedStaff(staff)}
                >
                  <Text style={{ fontSize: 16 }}>{staff.name} ({staff.role})</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              placeholder="Type your message..."
              value={messageContent}
              onChangeText={setMessageContent}
              style={modalStyles.input}
              multiline
            />
            <TouchableOpacity style={modalStyles.sendButton} onPress={sendMessage}>
              <Text style={modalStyles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modalStyles.sendButton, { backgroundColor: '#aaa' }]} onPress={() => setComposeVisible(false)}>
              <Text style={modalStyles.sendButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast position="top" visibilityTime={2200} topOffset={70} autoHide />
    </View>
  );
}


function MessagesBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#f7f8fa', '#cbe7ff', '#a3f2ca']}
        start={[0.7, 0.5]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[blobStyles.blob, blobStyles.blob1, { backgroundColor: "#4e8cff88" }]} />
      <Animated.View style={[blobStyles.blob, blobStyles.blob2, { backgroundColor: "#1dc48b77" }]} />
      <Animated.View style={[blobStyles.blob, blobStyles.blob3, { backgroundColor: "#e03d3d66" }]} />
    </View>
  );
}

function shadowForIdx(idx) {
  const offsets = [
    { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 7 }, { x: 0, y: 6 }, { x: 0, y: 10 }
  ];
  return { shadowOffset: offsets[idx % offsets.length] };
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 15,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    elevation: 8,
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  cardWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    minHeight: 82,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 5,
  },
  countBadge: {
    backgroundColor: '#4e8cff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 34,
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 11,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
  },
  fabIcon: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 10,
    textAlign: 'center',
  },
  receiverItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 6,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4e8cff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


const blobStyles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.33,
    borderRadius: 100,
    zIndex: 0,
  },
  blob1: {
    width: width * 0.62,
    height: width * 0.62,
    left: -width * 0.21,
    top: -width * 0.23,
  },
  blob2: {
    width: width * 0.33,
    height: width * 0.26,
    right: -width * 0.06,
    top: width * 0.38,
  },
  blob3: {
    width: width * 0.45,
    height: width * 0.34,
    left: -width * 0.13,
    bottom: -width * 0.17,
  },
});

const lightTheme = {
  bg: '#f7f8fa',
  headerBg: '#fdfeffcc',
  headerShadow: '#4e8cff33',
  title: '#4e8cff',
  cardBg: 'rgba(255,255,255,0.82)',
  cardTitle: '#243358',
  fabBg: '#4e8cff',
  fabShadow: '#4e8cff99',
  fabIcon: '#fff',
  blurIntensity: 20,
  shadow: '#4e8cff33',
  cardGradient: ['#fff0', '#e3f0ff99'],
  toastBg: '#fff',
  toastTitle: '#4e8cff',
  toastText: '#243358',
};
