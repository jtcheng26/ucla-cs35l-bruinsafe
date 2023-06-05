import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

const MyComponent = () => {
  const [text, setText] = useState('');

  const handleTextChange = (newText) => {
    setText(newText);
  };

  return (
    <View>
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type something..."
      />
    </View>
  );
};

export default MyComponent;
