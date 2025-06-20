import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const EducationalResourcesScreen = () => {
  const resources = [
    { id: 1, title: 'Understanding Hypertension', type: 'Article' },
    { id: 2, title: 'How to take Metformin', type: 'Video' },
    { id: 3, title: 'Healthy Eating for Diabetes', type: 'Tutorial' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f8fa' }}>
      <BackgroundBlobs />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Educational Resources</Text>

        {resources.map((res, idx) => (
          <BlurView
            key={res.id}
            intensity={18}
            tint="light"
            style={[styles.cardWrap, shadowForIdx(idx)]}
          >
            <LinearGradient
              colors={['#fff0', '#e3f0ff99']}
              start={[0.5, 0]}
              end={[1, 1]}
              style={styles.card}
            >
              <TouchableOpacity
                onPress={() => Toast.show({
                  type: 'info',
                  text1: 'Opening Resource',
                  text2: `${res.title} (${res.type})`,
                })}
                activeOpacity={0.8}
              >
                <Text style={styles.cardTitle}>{res.title}</Text>
                <Text style={styles.cardSub}>Type: {res.type}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        ))}

        <Toast position="top" />
      </ScrollView>
    </View>
  );
};

export default EducationalResourcesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#4e8cff',
    marginBottom: 20,
  },
  cardWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    minHeight: 72,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cardTitle: {
    fontSize: 18,
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
});

// Background blobs & shadow helpers

const BackgroundBlobs = () => (
  <View style={StyleSheet.absoluteFill}>
    <LinearGradient
      colors={['#f7f8fa', '#cbe7ff', '#a3f2ca']}
      start={[0.7, 0.5]}
      end={[1, 1]}
      style={StyleSheet.absoluteFill}
    />
    <View style={[blobStyles.blob, blobStyles.blob1, { backgroundColor: "#4e8cff77" }]} />
    <View style={[blobStyles.blob, blobStyles.blob2, { backgroundColor: "#1dc48b66" }]} />
    <View style={[blobStyles.blob, blobStyles.blob3, { backgroundColor: "#e03d3d55" }]} />
  </View>
);

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

function shadowForIdx(idx) {
  const offsets = [
    { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 6 }
  ];
  return {
    shadowOffset: offsets[idx % offsets.length],
  };
}
