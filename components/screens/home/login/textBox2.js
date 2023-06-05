import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const TextBox = ({ placeholder, style }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={inputValue}
        onChangeText={handleInputChange}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#0EA5E9" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10597C80',
    borderRadius: 20,
    padding: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 45,
    paddingBottom: 10,

    fontFamily: 'Source Sans 3',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    color: '#0EA5E9',
  },
});

export default TextBox;
