import { View, Text, Image } from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { useState, useEffect } from 'react';
import pfp from "../../../assets/Default_pfp.svg.png"



export default function WalkingRequestPanel({
    user,
    src={pfp},
    time,
    onAccept,
    walk_id,
}) {

    const [walkID, setWalkID] = useState(null);

    // useEffect(() => {
    //     const fetchWalks = async() => {
    //         try {
    //             const response = await axios.get(BASE_URL + "/walk/get");
    //             walks = response.data;
    //         } catch(e) {
    //             console.error(e);
    //         }
    //         const foundWalk = walks.find(walk => walk.user === key);
    //         setWalkID(foundWalk._id);
    //     }
    //     fetchWalks();
    // }, []);

    return (
        <View
        className="rounded-3xl mt-6 mb-2 bg-blue-950 py-2"
        >
            <View
            className="flex-row mt-6"
            >
                <Text
                className="ml-6 font-bold text-md text-amber-400"
                >
                    {time + " min"}
                </Text>
                <Text
                className="ml-1 text-md text-blue-300"
                >
                    Virtual Walk with 
                </Text>
            </View>

            <Text
            className="ml-6 mb-1 text-2xl text-white font-semibold"
            >
                {user.name}
            </Text>

            <View
            className="items-center my-2 flex-row px-6"
            >
                <TouchableScale
                className="rounded-full px-6 h-8 bg-violet-300/60 justify-center items-center"
                activeScale={0.95}
                onPress={() => onAccept(walk_id)}
                >
                    <Text
                    className="text-white"
                    >
                        accept
                    </Text>
                </TouchableScale>
            </View>

            <View
            className="bg-white rounded-full absolute left-6 -top-6"
            >
                <Image 
                source={pfp}
                className="w-12 h-12"
                />
            </View>
            
        </View>
    )
}