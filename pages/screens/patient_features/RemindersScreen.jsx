import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Dimensions } from 'react-native';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const remindersData = [
  { id: 1, title: 'Morning Medication', time: '08:00 AM' },
  { id: 2, title: 'Evening Medication', time: '08:00 PM' },
  { id: 3, title: 'Blood Pressure Check', time: '07:00 AM' },
];

export default function RemindersScreen() {
  const [reminders] = useState(remindersData);
  const navigation = useNavigation();

  const [fabAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    sendNotification("Med Adhere Reminder", "You have a medication due soon.");
  }, []);

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const handleReminderPress = (reminder) => {
    Toast.show({
      type: 'success',
      text1: 'Reminder Acknowledged',
      text2: `${reminder.title} at ${reminder.time}`,
    });
  };

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
    navigation.navigate('AddReminder');
  };

  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f8fa' }}>
      <StatusBar barStyle="dark-content" />
      <BackgroundBlobs />

      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {reminders.map((reminder, idx) => (
          <BlurView
            key={reminder.id}
            intensity={19}
            tint="light"
            style={[styles.cardWrap, shadowForIdx(idx)]}
          >
            <LinearGradient
              colors={['#fff0', '#e3f0ff99']}
              start={[0.5, 0]}
              end={[1, 1]}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => handleReminderPress(reminder)} activeOpacity={0.8}>
                <Text style={styles.cardTitle}>{reminder.title}</Text>
                <Text style={styles.cardSub}>Time: {reminder.time}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        ))}
      </ScrollView>

      <Animated.View style={[
        styles.fab,
        { transform: [{ scale: fabScale }] }
      ]}>
        <TouchableOpacity
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.7}
          accessibilityLabel="Add new reminder"
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </Animated.View>

      <Toast position="top" />
    </View>
  );
}

function BackgroundBlobs() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#f7f8fa', '#cbe7ff', '#a3f2ca']}
        start={[0.7, 0.5]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[blobStyles.blob, blobStyles.blob1, { backgroundColor: "#4e8cff77" }]} />
      <Animated.View style={[blobStyles.blob, blobStyles.blob2, { backgroundColor: "#1dc48b66" }]} />
      <Animated.View style={[blobStyles.blob, blobStyles.blob3, { backgroundColor: "#e03d3d55" }]} />
    </View>
  );
}

function shadowForIdx(idx) {
  const offsets = [
    { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 7 }, { x: 0, y: 6 }, { x: 0, y: 10 }
  ];
  return {
    shadowOffset: offsets[idx % offsets.length],
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 5,
  };
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#4e8cff',
  },
    cardWrap: {
    borderRadius: 12, // LESS rounded
    overflow: 'hidden',
    marginBottom: 16, // Tighter spacing between cards
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Softer elevation
  },
  card: {
    borderRadius: 12, // Match cardWrap radius
    padding: 14,      // Less padding for tighter look
    minHeight: 72,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cardTitle: {
    fontSize: 18,  // Slightly smaller
    fontWeight: '700',
    marginBottom: 4,
    color: '#243358',
  },
  cardSub: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.85,
    color: '#4e8cff99',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e8cff',
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  fabIcon: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});

const blobStyles = StyleSheet.create({
  blob: {
    position: 'absolute',
    opacity: 0.44,
    borderRadius: 100,
    zIndex: 0,
  },
  blob1: {
    width: width * 0.7,
    height: width * 0.7,
    left: -width * 0.18,
    top: -width * 0.2,
  },
  blob2: {
    width: width * 0.4,
    height: width * 0.33,
    right: -width * 0.09,
    top: width * 0.33,
  },
  blob3: {
    width: width * 0.5,
    height: width * 0.38,
    left: -width * 0.12,
    bottom: -width * 0.15,
  },
});
