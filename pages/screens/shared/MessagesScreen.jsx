import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, StatusBar, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const messages = [
  { id: 1, sender: 'Doctor Smith', preview: 'Please remember your check-up...', unread: true },
  { id: 2, sender: 'Pharmacist Jane', preview: 'Your prescription is ready...', unread: false },
  { id: 3, sender: 'Nurse Amy', preview: 'Lab results are available.', unread: true },
];

export default function MessagesScreen() {
  const theme = lightTheme;

  const [fabAnim] = useState(new Animated.Value(0));

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
    Toast.show({
      type: 'success',
      text1: 'Compose',
      text2: 'Compose a new message!',
    });
  };

  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle="dark-content" />
      <MessagesBackground />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, shadowColor: theme.headerShadow }]}>
        <Text style={[styles.title, { color: theme.title }]}>Messages</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {messages.map((msg, idx) => (
          <TouchableOpacity
            key={msg.id}
            activeOpacity={0.94}
            style={{ marginBottom: 18 }}
            accessibilityRole="button"
            accessibilityLabel={`Message from ${msg.sender}`}
            onPress={() => Toast.show({
              type: 'info',
              text1: `Opening Message`,
              text2: `From: ${msg.sender}`,
              visibilityTime: 2000,
            })}
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
                    From: {msg.sender}
                  </Text>
                  {msg.unread && (
                    <View style={styles.dotAnimWrap}>
                      <Animated.View style={[
                        styles.dotAnim,
                        { backgroundColor: theme.unreadDot }
                      ]} />
                    </View>
                  )}
                </View>
                <Text style={[styles.cardSub, { color: theme.cardSub }]}>
                  {msg.preview}
                </Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
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
          accessibilityLabel="Compose new message"
        >
          <Text style={[styles.fabIcon, { color: theme.fabIcon }]}>✉️</Text>
        </TouchableOpacity>
      </Animated.View>

      <Toast
        position="top"
        visibilityTime={2200}
        topOffset={70}
        autoHide
        text1Style={{ color: theme.toastTitle, fontWeight: 'bold', fontSize: 18 }}
        text2Style={{ color: theme.toastText, fontSize: 15 }}
        style={{ backgroundColor: theme.toastBg, borderRadius: 14 }}
      />
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
    borderWidth: 1,
    borderColor: "gray",
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
  cardSub: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.85,
  },
  dotAnimWrap: {
    marginLeft: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotAnim: {
    width: 13,
    height: 13,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
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
  text: '#2a3340',
  cardBg: 'rgba(255,255,255,0.82)',
  cardTitle: '#243358',
  cardSub: '#4e8cff99',
  fabBg: '#4e8cff',
  fabShadow: '#4e8cff99',
  fabIcon: '#fff',
  blurIntensity: 20,
  shadow: '#4e8cff33',
  unreadDot: '#4e8cff',
  cardGradient: ['#fff0', '#e3f0ff99'],
  toastBg: '#fff',
  toastTitle: '#4e8cff',
  toastText: '#243358',
};
