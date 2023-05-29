import { useState } from "react";
import { View, Text, Image, TextInput, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import TouchableScale from "react-native-touchable-scale";
import pfp from "../../assets/Default_pfp.svg.png"
import Cancel from "../../assets/cancel.svg"
import Check from "../../assets/check.svg"



export default function ProfileHeader({ name, icon }) {

    const [screenVisible, setScreenVisible] = useState(false)
    const [userName, setUserName] = useState(name)
    const [changedName, setChangedName] = useState(null);
    const [phonenumber, setPhoneNumber] = useState(null);
    const [emergencyContact, setEmergencyContact] = useState(null);
    const [email, setEmail] = useState(null);

    const styles = {
        inputText: "text-white text-lg align-left mt-4 ml-3",
        inputField: "py-2 w-12/12 text-white m-2 justify-start border-b-2 border-sky-300",
    }
    
    return (
        <>
            <Modal
            isVisible={screenVisible}
            onBackdropPress={() => setScreenVisible(false)}
            onDismiss={() => setScreenVisible(false)}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            hideModalContentWhileAnimating={true}
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={500}
            propagateSwipe={true}
            className="justify-start m-0"
            >
                <SafeAreaView
                className="w-screen h-screen bg-sky-950 rounded-xl flex-col items-center"
                >
                    <Text
                    className="text-white mt-10 text-4xl font-bold text-center"
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
                        placeholder="Ex: John/Jane Doe..."
                        onChangeText={setChangedName}
                        />
                    </View>

                    <View
                    className="w-11/12 mt-4"
                    >
                        <Text
                        className={styles.inputText}
                        >
                            Email:
                        </Text>
                        <TextInput
                        className={styles.inputField + " h-10"}
                        placeholderTextColor="#0284BE"
                        placeholder="Ex: johndoe@g.ucla.edu"
                        onChangeText={setEmail}
                        />
                    </View>

                    <View
                    className="w-11/12 mt-4"
                    >
                        <Text
                        className={styles.inputText}
                        >
                            Phone Number:
                        </Text>
                        <TextInput
                        className={styles.inputField + " h-10"}
                        placeholderTextColor="#0284BE"
                        placeholder="Ex: (XXX) XXX - XXXX"
                        onChangeText={setPhoneNumber}
                        />
                    </View>

                    <View
                    className="w-11/12 mt-4"
                    >
                        <Text
                        className={styles.inputText}
                        >
                            Emergency Contact:
                        </Text>
                        <TextInput
                        className={styles.inputField + " h-10"}
                        placeholderTextColor="#0284BE"
                        placeholder="Ex: (XXX) XXX - XXXX"
                        onChangeText={setEmergencyContact}
                        />
                    </View>        

                    <View
                    className="w-full items-center absolute bottom-0"
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
                            onPress={() => {
                                setScreenVisible(false)
                                if(!(changedName == "" || !changedName)) setUserName(changedName);
                            }}
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
            <View
            className="absolute top-10 flex-row w-full h-12 items-center"
            >

                <TouchableScale
                className="flex-row w-1/2 h-12 items-center"
                activeScale={0.97}
                onPress={() => setScreenVisible(true)}
                >
                    <Image 
                    source={pfp}
                    className="w-8 h-8 mr-4 ml-6"
                    />
                    <Text
                    className="text-white "
                    >
                        {userName}
                    </Text>
                </TouchableScale>
            </View>
        </>
    );
}