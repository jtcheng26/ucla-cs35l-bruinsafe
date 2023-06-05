import { View, Text, TextInput } from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { useState } from "react"
import axios from "axios";
import MainPage from "../home/MainPage";
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Login() {
    const styles = {
        inputField: "w-full h-14 text-sky-200 rounded-full text-md bg-sky-700 px-6 my-4 text-justify",
        inputBox: "text-sky-200 pb-2 pt-1 w-full text-lg mb-4 justify-start border-b-2 border-sky-300",
        inputText: "text-sky-400 text-md align-left mt-6"
    }

    const [email, setEmail] = useState(null);
    const [pw, setPW] = useState(null);
    const [logError, setLogError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false)

    const handleSignup = () => {
        if(email && pw) {
            if(!email.includes('@')) {
                setLogError("Must use an email");
                return;
            }
            handle = email.slice(-8, email.length);
            if(handle != "ucla.edu") {
                setLogError("Must use a ucla.edu email");
                return;
            }

            setLogError(null);

            const sendUser = async() => {
                try {
                    const at = email.indexOf("@")
                    const userName = email.slice(0, at)
                    console.log(userName)
                    const data = {
                        name: userName,
                        email: email
                    }
                    const response = await axios.post('http://169.232.214.177:8080/user/create', data);
                    console.log(response.data);
                    await AsyncStorage.setItem('@name', response.data.name).then(() => console.log('Name saved ', response.data.name)).catch(error => console.log('Error saving data: ', error));
                    await AsyncStorage.setItem('@id', response.data._id).then(() => console.log('ID saved ', response.data._id)).catch(error => console.log('Error saving data: ', error));
                    setPW(null);
                    setEmail(null);
                    setSignupSuccess(true);
                } catch(error) {
                    console.error(error)
                }
            }
            sendUser();
        } else {
            setLogError("Must fill out all fields");
                return;
        }
    }

    const handleLogin = () => {

    }
    
    if(signupSuccess) {
        return (
            <MainPage />
        );
    }

    return (
       <View
       className="w-full h-full bg-sky-950 items-center justify-center"
       >
            <Text
            className="absolute top-1/4 text-5xl text-amber-400 font-extrabold"
            >
                BruinSafe
            </Text>
            <View
            className="absolute w-10/12 h-1/3 pt-4" 
            >
                <Text
                className={styles.inputText}
                >
                    Email:
                </Text>
                <TextInput
                className={styles.inputBox}
                placeholder=""
                placeholderTextColor={"rgb(2 132 199)"}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                />
                <Text
                className={styles.inputText}
                >
                    Password:
                </Text>
                <TextInput
                secureTextEntry
                className={styles.inputBox}
                placeholder=""
                placeholderTextColor={"rgb(2 132 199)"}
                onChangeText={setPW}
                value={pw}
                />

            </View>
            <TouchableScale 
                className="absolute bottom-64 border-sky-300 border-2 w-1/3 mt-10 h-10 items-center justify-center bg-transparent"
                activeScale={0.97}
                >
                    <Text
                    className="text-sky-300 text-md font-semibold"
                    >
                        LOGIN
                    </Text>
            </TouchableScale>

            <TouchableScale
            className="absolute bottom-48 border-sky-300 border-2 w-1/3 mt-10 h-10 items-center justify-center bg-sky-300"
            onPress={() => handleSignup()}
            activeScale={0.97}
            >
                <Text
                className="text-sky-950 text-md font-semibold"
                >
                    SIGN UP
                </Text>
            </TouchableScale>

            <Text
            className="absolute bottom-32 my-4 text-md text-red-600 bott"
            >
                {logError}
            </Text>
       </View>
    );
}