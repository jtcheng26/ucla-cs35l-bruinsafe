import { View, Text } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { TouchableOpacity } from 'react-native';
import useUserId from '../../hooks/useUserId';
import { BASE_URL } from '../../../constants';
import axios from 'axios';
import { useEffect } from 'react';

export default function confirmPath({onPress, coordinates, setMarkerList, setThePath, copyPath, setWalking, setWaiting, waiting}) {
    const { id } = useUserId();
    const isMatched = async () => {
        console.log("Polling...");
        const allWalks = await axios.get(BASE_URL + "/walk/get");
        const result = allWalks.filter(walk => (walk.user == id && walk.state == 1));
        if (result.length > 0) {
            onPress(1);
        }
    }
    useEffect(() => {
        if (waiting) {
            const interval = setInterval(async () => {
                console.log("Polling...");
                const allWalks = await axios.get(BASE_URL + "/walk/get");
                const result = allWalks.filter(walk => (walk.user == id && walk.state == 1));
                if (result.length > 0) {
                    setWaiting(false)
                    setWalking(true)
                    clearInterval(interval)
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [waiting])
    const handleClick = async (confirmed) => {
        if (confirmed) {
            setWalking(true);
            const pushCoords = await axios.post(BASE_URL + "/walk/request", {origin: copyPath.start, destination: copyPath.end, user: id });
            // set interval for isMatched

        } else {
            onPress(0);
            setMarkerList([]);
            setThePath({start: null, end: null});
        }
    };
    return (
        <View className="absolute bottom-32 content-center space-x-4 w-full flex-row items-center align-center justify-center">
            <TouchableOpacity className="bg-green-500/80 py-5 rounded-full w-5/12 hover:bg-green-500/70" onPress={() => handleClick(true)}>
                <Text className="flex justify-center text-white text-xl font-bold text-center">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-600/80 py-5 rounded-full w-5/12 hover:bg-red-600/70" onPress={() => handleClick(false)}>
                <Text className="text-center text-white text-xl font-bold">Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}