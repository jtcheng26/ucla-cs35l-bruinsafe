import { View, Text, TextInput } from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { useState } from "react"
import axios from "axios";



export default function Login() {
    const styles = {
        inputField: "w-full h-14 text-sky-200 rounded-full text-md bg-sky-700 px-6 my-4 text-justify",
        inputBox: "text-sky-200 pb-2 pt-1 w-full text-lg mb-4 justify-start border-b-2 border-sky-300",
        inputText: "text-sky-400 text-md align-left mt-6"
    }

    const [email, setEmail] = useState(null);
    const [pw, setPW] = useState(null);
    const [logError, setLogError] = useState("");

    const handleSubmit = () => {
        if(email && pw) {
            if(!email.includes('@')) {
                setLogError("Must use an email");
                return;
            }
            handle = email.slice(-8, -1);
            if(handle != "ucla.edu") {
                setLogError("Must use a ucla.edu email");
                return;
            }



        } else {
            setLogError("Must fill out all fields");
                return;
        }
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
                />

            </View>
            <TouchableScale 
                className="absolute bottom-64 border-sky-300 border-2 w-1/3 mt-10 h-10 items-center justify-center bg-transparent"
                onPress={() => handleSubmit()}
                activeScale={0.97}
                >
                    <Text
                    className="text-sky-300 text-md"
                    >
                        LOGIN
                    </Text>
            </TouchableScale>
            <Text
            className="absolute bottom-48 my-4 text-md text-red-600 bott"
            >
                {logError}
            </Text>
       </View>
    );
}