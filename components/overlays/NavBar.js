import { View, Text, TouchableOpacity, Image } from 'react-native'; 
import { useState } from 'react';
import TouchableScale from 'react-native-touchable-scale';
import Svg, { Path, SvgXml, SvgUri, Circle } from 'react-native-svg';
import Location from '../../assets/location.svg';
import Home from '../../assets/home.svg';
import Megaphone from '../../assets/megaphone.svg';


export default function NavBar({onPress}) {
    const [buttonToggle, setButtonToggle] = useState([0, 1, 0]);
    const styles = {
        buttonSize: 40,
    };
    const smallCircle = (
        <Svg height="20" width="20"> <Circle cx="10" cy="10" r="4" fill="#FBBF24"/> </Svg>
    );
    function buttonClick(i) {
        if (i == 0) {
            setButtonToggle([1, 0, 0]);
        } else if (i == 1) {
            setButtonToggle([0, 1, 0]);
        } else if (i == 2) {
            setButtonToggle([0, 0, 1]);
        } else {
            setButtonToggle([0, 0, 0]);
        }
    }
    return (
        <View className="flex-1 justify-end">
            <View className="flex flex-row space-x-5 mb-7">
                <TouchableScale activeScale={0.95} onPress={() => buttonClick(0)}>
                    <View className="flex justify-center items-center">
                        <Home width={styles.buttonSize} height={styles.buttonSize} fill={buttonToggle[0] == 1 ? "#FBBF24" : "#80ACBF"} />
                        {buttonToggle[0] == 1 ? (
                        <Svg height="20" width="20">
                                <Circle cx="10" cy="10" r="4" fill="#FBBF24"/>
                        </Svg>) : null}
                    </View>
                </TouchableScale>
                <TouchableScale activeScale={0.95} onPress={() => buttonClick(1)}>
                    <View className="flex justify-center items-center">
                        <Location width={styles.buttonSize} height={styles.buttonSize} fill={buttonToggle[1] == 1 ? "#FBBF24" : "#80ACBF"} />
                        {buttonToggle[1] == 1 ? (
                        <Svg height="20" width="20">
                                <Circle cx="10" cy="10" r="4" fill="#FBBF24"/>
                        </Svg>) : null}
                    </View>
                </TouchableScale>
                <TouchableScale activeScale={0.95} onPress={() => buttonClick(2)}>
                    <View className="flex justify-center items-center">
                        <Megaphone width={styles.buttonSize} height={styles.buttonSize} fill={buttonToggle[2] == 1 ? "#FBBF24" : "#80ACBF"} />
                        {buttonToggle[2] == 1 ? (
                        <Svg height="20" width="20">
                                <Circle cx="10" cy="10" r="4" fill="#FBBF24"/>
                        </Svg>) : null}
                    </View>

                </TouchableScale>
            </View>
        </View>
    )
}
