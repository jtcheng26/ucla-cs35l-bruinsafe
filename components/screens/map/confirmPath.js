import { View, Text } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { TouchableOpacity } from 'react-native';
import useUserId from '../../hooks/useUserId';
import { BASE_URL } from '../../../constants';
import axios from 'axios';

export default function confirmPath({onPress, coordinates}) {
    const { id } = useUserId();
    const isMatched = async () => {
        console.log("Polling...");
        const allWalks = await axios.get(BASE_URL + "/walk/get");
        const result = allWalks.filter(walk => (walk.user == id && walk.state == 1));
        if (result.length > 0) {
            clearInterval(interval);
            onPress(1);
        }
    }
    const handleClick = async (confirmed) => {
        if (confirmed) {
            const pushCoords = await axios.post(BASE_URL + "/walk/request", {origin: coordinates.start, destination: coordinates.end, user: id });
            // console.log("Pushed data to database!");
            const interval = setInterval(async () => {
                console.log("Polling...");
                const allWalks = await axios.get(BASE_URL + "/walk/get");
                const result = allWalks.filter(walk => (walk.user == id && walk.state == 1));
                if (result.length > 0) {
                    clearInterval(interval);
                    onPress(1);
                }
            }, 1500);
            clearInterval(interval);
        } else {
            onPress(0);
        }
    };
    return (
        <View className="absolute bottom-32 content-center space-x-4 w-full flex-row items-center align-center justify-center">
            <TouchableOpacity className="bg-green-500/80 py-4 rounded-xl w-5/12 hover:bg-green-500/70" onPress={() => handleClick(true)}>
                <Text className="flex justify-center text-white font-bold text-center">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-600/80 py-4 rounded-xl w-5/12 hover:bg-red-600/70" onPress={() => handleClick(false)}>
                <Text className="text-center text-white font-bold">Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}