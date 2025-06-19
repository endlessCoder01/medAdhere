import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // You can check async storage token or any auth logic here
      navigation.replace('Login');
    }, 5000); // 2 seconds splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../images/medAdhere.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Med Adhere</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 28,
    color: '#4e8cff',
    marginTop: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
