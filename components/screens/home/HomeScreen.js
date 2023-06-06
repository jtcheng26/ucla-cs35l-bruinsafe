import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import ProfileHeader from '../../overlays/ProfileHeader';

export default function HomeScreen() {

    return (
        <View className="flex-1 items-center bg-sky-950">
            <ProfileHeader />
            <Text
            className="text-2xl font-semibold text-sky-300 mt-28"
            >
                Active Walking Requests
            </Text>
            
        </View>
    );
}