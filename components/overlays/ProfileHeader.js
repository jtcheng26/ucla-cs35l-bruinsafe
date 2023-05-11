import { View, Text, Image } from "react-native";
import TouchableScale from "react-native-touchable-scale";
import pfp from "../../assets/Default_pfp.svg.png"



export default function ProfileHeader({ name, icon }) {
    return (
        <View
        className="flex-row w-full h-12 mt-12 items-center"
        >
            <TouchableScale
            className="flex-row w-1/2 h-12 items-center"
            activeScale={0.97}
            >
                <Image 
                source={pfp}
                className="w-8 h-8 mr-4 ml-6"
                />
                <Text
                className="text-white "
                >
                    {name}
                </Text>
            </TouchableScale>
        </View>
    );
}