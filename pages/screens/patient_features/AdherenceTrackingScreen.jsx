import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, StatusBar, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const initialRecords = [
  { id: 1, med: 'Aspirin', date: '2025-06-18', status: 'Taken' },
  { id: 2, med: 'Metformin', date: '2025-06-18', status: 'Missed' },
  { id: 3, med: 'Lisinopril', date: '2025-06-17', status: 'Taken' },
];

export default function AdherenceTrackingScreen() {
  const [records] = useState(initialRecords);

  // FAB Animation
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
    // Add functionality here
  };
  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.13],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f8fa' }}>
      <StatusBar barStyle="dark-content" />
      <BackgroundBlobs />

      {/* Header */}
      <View style={[styles.header]}>
        <Text style={styles.title}>Adherence Tracking</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {records.map((rec, idx) => (
          <BlurView
            key={rec.id}
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
              <Text style={styles.cardTitle}>{rec.med}</Text>
              <Text style={styles.cardSub}>Date: {rec.date}</Text>
              <StatusChip status={rec.status} />
            </LinearGradient>
          </BlurView>
        ))}
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[
        styles.fab,
        {
          transform: [{ scale: fabScale }],
        }
      ]}>
        <TouchableOpacity
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.7}
          accessibilityLabel="Add new record"
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Status chip
function StatusChip({ status }) {
  const isTaken = status === "Taken";
  return (
    <View style={[
      chipStyles.chip,
      {
        backgroundColor: isTaken ? "#a3f2ca" : "#f2a3a3",
        borderColor: isTaken ? "#1dc48b" : "#e03d3d",
        shadowColor: isTaken ? "#24e0a2aa" : "#e03d3daa"
      }
    ]}>
      <Text style={[
        chipStyles.chipText,
        { color: isTaken ? "#228c5b" : "#e03d3d" }
      ]}>
        {isTaken ? "✔ Taken" : "✖ Missed"}
      </Text>
    </View>
  );
}

// Background blobs
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

// Shadow helper
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

// Styles
const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 5,
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
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    minHeight: 96,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#243358',
  },
  cardSub: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.85,
    marginBottom: 8,
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

const chipStyles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.2,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  }
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
