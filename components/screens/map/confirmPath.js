import { View, Text } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { TouchableOpacity } from 'react-native';
import useUserId from '../../hooks/useUserId';
import { BASE_URL } from '../../../constants';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';


export default function confirmPath({onPress, coordinates, setMarkerList, setThePath, copyPath, setWalking, setWaiting, waiting, setCurrentWalker, setCurrentWalkId, timeLeft}) {
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

    //run whenever waiting or confirmed changed


    const handleClick = async (confirm) => {
        if (confirm) {
            setWalking(true);
            setWaiting(true)
            const pushCoords = await axios.post(BASE_URL + "/walk/request", {origin: copyPath.start, destination: copyPath.end, user: id, timeLeft: timeLeft }); //Create walk request
            setConfirmed(true);
            onPress(3)
        } else {
            onPress(0);
            setMarkerList([]);
            setThePath({start: null, end: null});
        }
    };
    return (
        <View className="absolute bottom-32 content-center space-x-5 w-full flex-row items-center align-center justify-center">
            <TouchableOpacity className="bg-blue-500/90 py-3 rounded-2xl w-5/12" onPress={() => handleClick(true)}>
                <Text className="flex justify-center text-zinc-200 text-base font-bold text-center">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-zinc-200/70 py-3 rounded-2xl w-5/12" onPress={() => handleClick(false)}>
                <Text className="text-center text-black text-base font-bold">Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}