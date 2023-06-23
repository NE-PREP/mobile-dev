import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from "react-native-paper";

export default function Button({ mode, style, disabled = false, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        { backgroundColor: disabled ? '#cccccc' : '#2272C3' }, // Different background color when disabled
        style,
      ]}
      disabled={disabled}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    padding: 4,
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#FFFFFF',
  },
});
