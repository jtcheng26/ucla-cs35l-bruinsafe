import { useState, useEffect } from "react";
import { View, Text, Image, TextInput, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import tw from "tailwind-react-native-classnames"
import TouchableScale from "react-native-touchable-scale";
import pfp from "../../assets/Default_pfp.svg.png"
import Cancel from "../../assets/cancel.svg"
import Check from "../../assets/check.svg"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { BASE_URL } from "../../constants";




export default function ProfileHeader({ name, icon }) {

    const [screenVisible, setScreenVisible] = useState(false)
    const [userName, setUserName] = useState(name)
    const [changedName, setChangedName] = useState(null);
    const [email, setEmail] = useState(null);

    const styles = {
        inputText: "text-white text-lg align-left mt-4 ml-3",
        inputField: "text-white p-2 w-12/12 m-2 justify-start border-b-2 border-sky-300",
    }


    const handleProfileEdit = () => {
        setScreenVisible(false);

        const retrieveUser = async() => {
            try {
                const r_id = await AsyncStorage.getItem("@id")
                const r_pw = await AsyncStorage.getItem("@pw")
                const data = {
                    name: changedName, 
                    id: r_id,
                    password: r_pw
                }
                const response = await axios.put(BASE_URL + '/user/edit', data);
                console.log(response.data);
                AsyncStorage.setItem('@name', changedName)
                setUserName(changedName)
            } catch(error) {
                console.error(error)
            }
        }

        if(!(changedName == "" || !changedName)) retrieveUser();
    }

    useEffect(() => {
        const getName = async() => {
            try {
                const cur_name = await AsyncStorage.getItem("@name")
                setUserName(cur_name)
            } catch(error) {
                console.error(error)
            }
        }
        getName();
    }, []);
    
    return (
        <>
            <Modal
            isVisible={screenVisible}
            onBackdropPress={() => setScreenVisible(false)}
            onDismiss={() => setScreenVisible(false)}
            animationIn="slideInDown"
            animationOut="slideOutUp"
            hideModalContentWhileAnimating={true}
            backdropOpacity={0.7}
            animationInTiming={500}
            animationOutTiming={500}
            propagateSwipe={true}
            className="justify-start m-0"
            >
                <SafeAreaView
                className="w-screen h-1/2 bg-sky-950 rounded-3xl flex-col items-center"
                >
                    <Text
                    className="text-white mt-14 text-4xl font-bold text-center"
                    >
                        Edit Your Profile
                    </Text>

                    <View
                    className="w-11/12 mt-8"
                    >
                        <Text
                        className={styles.inputText}
                        >
                            Name:
                        </Text>
                        <TextInput
                        className={styles.inputField + " h-10"}
                        placeholderTextColor="#0284BE"
                        placeholder={"Currently: " + userName}
                        onChangeText={setChangedName}
                        />
                    </View>

                    <View
                    className="w-full items-center absolute bottom-2"
                    >
                        <View
                        className="flex-row mb-4"
                        >
                            <TouchableScale
                            className="bg-red-500 w-10 h-10 m-6 pt-1 rounded-full items-center justify-center"
                            activeScale={0.98}
                            onPress={() => setScreenVisible(false)}
                            >
                                <Cancel 
                                width={20}
                                height={20}
                                fill="#FFF"
                                />
                            </TouchableScale>

                            <TouchableScale
                            className="bg-green-500 w-10 h-10 m-6 pt-2 rounded-full items-center justify-center"
                            activeScale={0.98}
                            onPress={() => handleProfileEdit()}
                            >
                                <Check 
                                width={45}
                                height={45}
                                fill="#FFF"
                                />
                            </TouchableScale>
                        </View>

                    </View>      

                </SafeAreaView>
            </Modal>
            <SafeAreaView
            className="absolute top-12 left-2"
            >
                <TouchableScale
                className="flex-row w h-12 items-center"
                activeScale={0.97}
                onPress={() => setScreenVisible(true)}
                >
                    <View
                    className="bg-white rounded-full mr-4 ml-4"
                    >
                        <Image 
                        source={pfp}
                        className="w-8 h-8"
                        />
                    </View>
                    <Text
                    className="text-white text-lg font-semibold"
                    >
                        {userName}
                    </Text>
                </TouchableScale>
            </SafeAreaView>

        </>
    );
}