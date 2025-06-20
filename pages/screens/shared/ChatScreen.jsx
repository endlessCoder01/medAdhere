import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "../../services/api";
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen({ route }) {
  const { senderId, senderName } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchChat();
      const interval = setInterval(fetchChat, 2000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) throw new Error("No user info");
      const user = JSON.parse(userData);
      setUserId(user.user_id);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "User load failed",
      });
    }
  };

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_URL}/message/chat/${senderId}/${userId}`);
      const data = await res.json();
      const sorted = data.sort(
        (a, b) => new Date(a.sent_at) - new Date(b.sent_at)
      );
      setMessages(sorted);

      // Check if there are unseen messages from sender
      const unseen = sorted.filter(
        (m) => m.sender_id === senderId && m.status === "unseen"
      );
      if (unseen.length > 0) {
        await markMessagesSeen();
      }

    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to load chat",
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesSeen = async () => {
    try {
      await fetch(`${API_URL}/message/chatUpdate/${senderId}/${userId}`, {
        method: "PATCH",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: e.message || "Failed to mark seen",
      });
    }
  };

  const sendMessage = async () => {
    try {
      if (!input.trim()) return;

      await fetch(`${API_URL}/message/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: senderId,
          content: input.trim(),
          status: "unseen",
        }),
      });

      setInput("");
      fetchChat();
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send message",
      });
    }
  };

  const getDateLabel = (dateStr) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString();
  };

  let lastDateLabel = null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with {senderName}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4e8cff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ padding: 10 }}
        >
          {messages.map((m) => {
            const isMe = m.sender_id === userId;
            const dateLabel = getDateLabel(m.sent_at);
            const showDateLabel = dateLabel !== lastDateLabel;
            lastDateLabel = dateLabel;

            return (
              <View key={m.message_id}>
                {showDateLabel && (
                  <View style={styles.dateLabelWrap}>
                    <Text style={styles.dateLabel}>{dateLabel}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.theirBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isMe ? { color: "#fff" } : { color: "#000" },
                    ]}
                  >
                    {m.content}
                  </Text>
                  <View style={styles.timeWrap}>
                    <Text style={styles.timeText}>
                      {new Date(m.sent_at).toLocaleTimeString()}
                    </Text>
                    {isMe && (
                      <Text style={styles.tick}>
                        {m.status === "seen" ? "✔✔" : "✔"}
                      </Text>
                    )}
                  </View>
                </View>
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
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4e8cff",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backText: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  chatContainer: { flex: 1 },
  dateLabelWrap: {
    alignItems: "center",
    marginVertical: 6,
  },
  dateLabel: {
    backgroundColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    color: "#333",
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "75%",
  },
  myBubble: {
    backgroundColor: "#4e8cff",
    alignSelf: "flex-end",
  },
  theirBubble: {
    backgroundColor: "lightblue",
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 15,
  },
  timeWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: "#eee",
    marginRight: 4,
  },
  tick: {
    fontSize: 10,
    color: "#eee",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#4e8cff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
