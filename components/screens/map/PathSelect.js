import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';

export default function PathSelect({onPress}) {
    const [startDestination, setStartDestination] = useState("Your location.");
    const [endDestination, setEndDestination] = useState("Where to?");
    return (
        <View className="absolute items-center justify-center w-full h-full">
            <TextInput
                className="bg-sky-200 w-3/4 py-2 rounded-lg pl-2"
                onChangeText={setStartDestination}
                value={startDestination}
            />
            <TextInput
                className="bg-sky-200 w-3/4 py-2 mt-1 rounded-lg pl-2"
                onChangeText={setEndDestination}
                value={endDestination}
            />
        </View>
    );
}