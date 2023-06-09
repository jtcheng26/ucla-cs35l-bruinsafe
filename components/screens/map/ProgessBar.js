import { View, Text, Image, Animated } from 'react-native';
import { useEffect, useState , useRef} from 'react';
import TouchableScale from 'react-native-touchable-scale';


export default function ProgressBar({ progress=0 }) {
    // const [progress, setProgress] = useState(0.9); //potential issue: setProgress needs to update progress for bar to move. Component should take in current location, and destination and check for distance.
    let progressStyle = "absolute ml-3 py-1 rounded-full bg-amber-400/100 z-20 transition-all duration-500 ease-in";
    const padArray = new Array(2,3,4,5,6,7,8,9,10,11,12,14,16,20,24);
    var newStyle = 0;
    const prog = useRef(new Animated.Value(0)).current
    useEffect(() => {
        if (progress || progress === 0)  {
            const t = Animated.timing(prog, {
                toValue: (isNaN(progress) ? 0 : progress) * 200,
                duration: 500,
                useNativeDriver: false,
            });
            t.start()
            return () => t.stop()
        }
    }, [progress, prog])
    // for (let i = 0; i < padArray.length; i++) {
    //     if (Math.abs(padArray[i] - (24 * progress)) < Math.abs(newStyle - (24 * progress))) {
    //         newStyle = padArray[i];
    //     }
    // }
    // progressStyle += "px-" + String(newStyle);
    return (
        <View className="relative mb-2">
            <TouchableScale className="absolute ml-3 py-1 rounded-full bg-amber-500/40 z-0 w-full" style={{width: 200}} activeScale={1}>
            </TouchableScale>
            <Animated.View className={progressStyle} style={{width: prog}} activeScale={1} />
        </View>
    );
}