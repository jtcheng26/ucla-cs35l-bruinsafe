import { View, Text } from 'react-native';
import NavBar from '../../overlays/NavBar';

export default function HomeScreen() {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-red-600">Hello</Text>
            <NavBar />
        </View>
    );
}