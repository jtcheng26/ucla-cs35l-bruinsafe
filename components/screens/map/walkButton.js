import {View, Text} from 'react-native';
import useState from 'react';
import TouchableScale from 'react-native-touchable-scale';

export default function walkButton({onPress}) {
    return (
        <TouchableScale className="absolute bottom-24 mb-5 bg-cyan-800/90 px-20 py-5 rounded-full" activeScale={0.97}>
            <Text className="font-bold text-cyan-400 text-xl">walk with someone</Text>
        </TouchableScale>
    );
}