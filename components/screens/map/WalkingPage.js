import { View, Text, Image } from 'react-native';
import Svg, { Path, SvgXml, SvgUri, Circle } from 'react-native-svg';
import pfp from "../../../assets/Default_pfp.svg.png"
import ProgressBar from './ProgessBar';

export default function WalkingPage({walkerFullName, locationName, currentTime}) {
    const timeLeft = 15;
    return (
        <View className="absolute bottom-10 mb-20 w-11/12 rounded-2xl px-2 pt-1 pb-3 bg-sky-600 shadow-xl">
            <View className="flex-row items-center align-center justify-between">
                <Image 
                        source={pfp}
                        className="w-8 h-8 mr-2 ml-4 mt-2"
                    />
                <View className="flex flex-row justify-end mr-4 mt-3">
                    <View className="">
                        <View className="flex-row justify-end align-center content-center items-center">
                            <Svg height="20" width="20">
                                    <Circle cx="10" cy="10" r="4" fill="#FBBF24"/>
                            </Svg>
                            <Text className="text-amber-400 text-right">{currentTime}</Text>
                        </View>
                        <Text className="text-slate-300 text-right">{locationName}</Text> 
                    </View>
                </View>
            </View>
            <View className="ml-3 mt-2">
                <Text className="text-white/60 font-bold">Walking with</Text>
                <Text className="font-bold text-xl text-white">{walkerFullName}</Text>
            </View>
            <View className="flex-row align-center items-center mt-2 ml-3">
                <Text className="font-bold text-amber-400 text-base">{timeLeft} min left</Text>
                <ProgressBar/>
            </View>
        </View>
    );
}