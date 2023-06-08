import {View, Text} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export default function endWalk({endWalkFunction}) {
    const handleClick = () => {
        console.log("Ended the Walk!");
        endWalkFunction();
    }
    return (
        <TouchableScale className="absolute w-2/12 h-1/12 bottom-72 right-6 py-4 rounded-lg bg-zinc-300" activeScale={0.97} onPress={handleClick}>
            <Text className="items-center text-center font-bold">End Path</Text>
        </TouchableScale>
    );
}