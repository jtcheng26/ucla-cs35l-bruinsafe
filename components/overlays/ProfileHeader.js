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




export default function ProfileHeader({ onLogout }) {

    const [screenVisible, setScreenVisible] = useState(false)
    const [userName, setUserName] = useState(null)
    const [changedName, setChangedName] = useState(null);

    const styles = {
        inputText: "text-sky-300 text-lg align-left mt-4 ml-3",
        inputField: "text-white p-2 w-12/12 m-2 justify-start border-b-2 border-sky-300",
    }


    const handleProfileEdit = () => {
        setScreenVisible(false);

        const retrieveUser = async() => {
            try {
                const r_id = await AsyncStorage.getItem("@id") //get current userid and password
                const r_pw = await AsyncStorage.getItem("@pw")
                const data = {
                    name: changedName, 
                    id: r_id,
                    password: r_pw
                }
                const response = await axios.put(BASE_URL + '/user/edit', data); //edit current user's UserModel
                console.log(response.data);
                AsyncStorage.setItem('@name', changedName) //change user's session name
                setUserName(changedName)
            } catch(error) {
                console.error(error)
            }
        }

        if(!(changedName == "" || !changedName)) retrieveUser();
    }

    //run when component first renders
    useEffect(() => {
        const getName = async() => {
            try {
                //username state updated to "about to change" name 
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
                className="w-screen h-2/5 bg-sky-950 rounded-3xl flex-col items-center"
                >
                    <Text
                    className="text-white mt-8 text-4xl font-bold text-center"
                    >
                        Edit Your Profile
                    </Text>

                    <View
                    className="w-11/12 mt-4"
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
                    className="w-full absolute bottom-2"
                    >
                        <View
                        className="flex-row-reverse"
                        >
                            <TouchableScale
                            className="bg-green-500 w-10 h-10 m-4 pt-2 rounded-full items-center justify-center"
                            activeScale={0.98}
                            onPress={handleProfileEdit}
                            >
                                <Check 
                                width={45}
                                height={45}
                                fill="#FFF"
                                />
                            </TouchableScale>
                            <TouchableScale
                            className="bg-red-500 w-10 h-10 my-4 mr-4 ml-2 pt-1 rounded-full items-center justify-center"
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
                            className="items-center justify-center px-2 h-10 border-2 border-sky-300 m-4 rounded-full mr-40"
                            activeScale={0.95}
                            onPress={() => onLogout(false)}
                            >
                                <Text
                                className="text-sky-300 "
                                >
                                    Logout
                                </Text>
                            </TouchableScale>
                        </View>

                    </View>      

                </SafeAreaView>
            </Modal>
            <SafeAreaView
            className="absolute top-14 left-2"
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