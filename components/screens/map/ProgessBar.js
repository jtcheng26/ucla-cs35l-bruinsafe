import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import TouchableScale from 'react-native-touchable-scale';


export default function ProgressBar() {
    const [progress, setProgress] = useState(0.9);
    let progressStyle = "absolute ml-3 w-full py-1 rounded-full bg-amber-400/100 z-0 ";
    const padArray = new Array(2,3,4,5,6,7,8,9,10,11,12,14,16,20,24);
    var newStyle = 0;
    for (let i = 0; i < padArray.length; i++) {
        if (Math.abs(padArray[i] - (24 * progress)) < Math.abs(newStyle - (24 * progress))) {
            newStyle = padArray[i];
        }
    }
    progressStyle += "px-" + String(newStyle);
    return (
        <View className="relative mb-2">
            <TouchableScale className="absolute ml-3 w-full px-24 py-1 rounded-full bg-amber-500/40 z-0" activeScale={1}>
            </TouchableScale>
            <TouchableScale className={progressStyle} activeScale={1}>
            </TouchableScale>
        </View>
    );
}