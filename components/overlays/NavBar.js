import { View, Text, TouchableOpacity, Image } from 'react-native'; 
import TouchableScale from 'react-native-touchable-scale';
import Svg from 'react-native-svg';
import home from '../../assets/home.svg';

export default function NavBar({onPress}) {
    return (
        <View>
            <TouchableScale>
                <Image source={require('../../assets/home.svg')}
                        style={{width:500, height:700, tintColor: 'red'}}/>
            </TouchableScale>
        </View>
    )
}