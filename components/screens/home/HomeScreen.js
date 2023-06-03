import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'

import NavBar from '../../overlays/NavBar';

export default function HomeScreen() {




    return (
        <View className="flex-1 justify-center items-center bg-sky-950">
            <MapView
            >
            </MapView>
            <Text className="text-red-600">Home Screen</Text>
        </View>
    );
}