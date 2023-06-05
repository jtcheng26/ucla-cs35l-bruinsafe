import {View, Text} from 'react-native';
import {useState} from 'react';
import TouchableScale from 'react-native-touchable-scale';

export default function walkButton({onPress, text}) {
    const [buttonText, setButtonText] = useState(text);
    const handleClick = async () => {
        setButtonText("finding a match...");
        // user location, full name
        const userSearch = await axios.post("http://169.232.214.177:8080/user/escort", userData);
        // setButtonText("walk with someone");
        // onPress(true); 
    };
    return (
        <TouchableScale className="absolute bottom-24 mb-5 bg-cyan-800/90 w-5/6 py-5 rounded-full items-center justify-center" activeScale={0.97} onPress={handleClick}>
            <Text className="font-bold text-cyan-400 text-xl">{buttonText}</Text>
        </TouchableScale>
    );
}