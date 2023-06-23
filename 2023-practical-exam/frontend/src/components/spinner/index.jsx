import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2272C3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;

