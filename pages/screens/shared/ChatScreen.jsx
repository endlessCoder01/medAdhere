import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_URL } from '../../services/api';

export default function ChatScreen({ route }) {
  const { senderId, senderName } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchChat = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      if (!userData) throw new Error('No user info');
      const user = JSON.parse(userData);

      const res = await fetch(`${API_URL}/message/${user.user_id}`);
      const data = await res.json();

      // Get messages between user and sender
      const filtered = data.filter(
        m => m.sender_id === senderId || m.receiver_id === senderId
      );

      setMessages(filtered.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at)));
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to load chat' });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!input.trim()) return;

      const userData = await AsyncStorage.getItem('userInfo');
      const user = JSON.parse(userData);

      await fetch(`${API_URL}/message/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.user_id,
          receiver_id: senderId,
          content: input.trim(),
          status: 'unseen'
        })
      });

      setInput('');
      fetchChat();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send message' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {senderName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4e8cff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.chatContainer} contentContainerStyle={{ padding: 10 }}>
          {messages.map(m => {
            const isMe = m.sender_id !== senderId;
            return (
              <View
                key={m.message_id}
                style={[
                  styles.bubble,
                  isMe ? styles.myBubble : styles.theirBubble
                ]}
              >
                <Text style={styles.bubbleText}>{m.content}</Text>
                <Text style={styles.timeText}>{new Date(m.sent_at).toLocaleTimeString()}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Toast position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#4e8cff',
    color: '#fff',
    textAlign: 'center',
  },
  chatContainer: { flex: 1 },
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '75%',
  },
  myBubble: {
    backgroundColor: '#4e8cff',
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: '#ddd',
    alignSelf: 'flex-start',
  },
  bubbleText: { color: '#fff' },
  timeText: { fontSize: 10, color: '#eee', textAlign: 'right', marginTop: 2 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4e8cff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
