import { View, Text } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { TouchableOpacity } from 'react-native';
import useUserId from '../../hooks/useUserId';
import { BASE_URL } from '../../../constants';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

export default function confirmPath({onPress, coordinates, setMarkerList, setThePath, copyPath, setWalking, setWaiting, waiting, setCurrentWalker}) {
    const { id } = useUserId();
    const [confirmed, setConfirmed] = useState(false);

    // const isMatched = async () => {
    //     console.log("Polling..");
    //     const allWalks = await axios.get(BASE_URL + "/walk/get");
    //     const result = allWalks.filter(walk => (walk.user == id && walk.state == 1));
    //     if (result.length > 0) {
    //         onPress(1);
    //     }
    // }
    useEffect(() => {
        if (waiting && confirmed) {
            const interval = setInterval(async () => {
                console.log("Polling...");
                let allWalks = (await axios.get(BASE_URL + "/walk/get")).data;
                let result = allWalks.filter(walk => (walk.user._id == id && walk.state == 1));
                if (result.length > 0) {
                    setCurrentWalker(result[0].guardian.id)
                    setWaiting(false);
                    clearInterval(interval);
                    onPress(1);
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [waiting, confirmed])
    const handleClick = async (confirm) => {
        if (confirm) {
            setWalking(true);
            const pushCoords = await axios.post(BASE_URL + "/walk/request", {origin: copyPath.start, destination: copyPath.end, user: id });
            setConfirmed(true);
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