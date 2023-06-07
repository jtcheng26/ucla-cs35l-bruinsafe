import { View, Text, TextInput } from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { useState } from "react"
import axios from "axios";
import MainPage from "../home/MainPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../../../constants";




export default function Login() {
    const styles = {
        inputField: "w-full h-14 text-sky-200 rounded-full text-md bg-sky-700 px-6 my-4 text-justify",
        inputBox: "text-sky-200 pb-2 pt-1 w-full text-lg mb-4 justify-start border-b-2 border-sky-300",
        inputText: "text-sky-400 text-md align-left mt-6"
    }

    const [email, setEmail] = useState(null);
    const [pw, setPW] = useState(null);
    const [confirmPW, setConfirmPW] = useState(null)
    const [logError, setLogError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false)
    const [suTxt, setSUTxt] = useState("LOGIN")


    //Tests email req w/ regex
    const isEmailValid = (email) => {
        const emailRegex = /^[A-Z0-9+_.-]+@(ucla\.edu|g\.ucla\.edu)$/i; 
        return emailRegex.test(email);
    }

    //Tests password req w/ regex
    const isPwValid = (pw) => {
        const passRegex = /^(?=.*?[#?!@$%^&*-]).{8,}$/;
        return passRegex.test(pw);
    }

    //Identify issue within email/pw before sending to DB => saves time
    const quickCheck = (email, pw) =>
    {
        if (!isEmailValid(email)){
            setLogError("Invalid email");
            return;
        }

        if(!isPwValid(pw))
            {
                if (pw.length() < 8)
                    setLogError("Must have minimum of 8 characters");
                else
                    setLogError("Password must contain atleast one special character (#?!@$%^&*-)");
                return;
            }
    }

    const handleSignup = () => {
        //Email and Password processing logic
        if(email && pw && confirmPW) {
            if(!email.includes('@')) {
                setLogError("Must use an email");
                return;
            }
            handle = email.slice(-8, email.length);
            if(handle != "ucla.edu") {
                setLogError("Must use a ucla.edu email");
                return;
            }

            // quickCheck(email, pw);

            if(pw != confirmPW) {
                setLogError("Passwords must match");
                return;
            }

            setLogError(null);

            const sendUser = async() => {
                try {
                    const at = email.indexOf("@")
                    const userName = email.slice(0, at)
                    const data = { //json to send to API endpoint
                        name: userName,
                        email: email,
                        password: pw
                    }
                    const response = await axios.post(BASE_URL + '/user/create', data); //Sent user info to api endpoint to create UserModel in DB
                    console.log(response.data);
                    //Allows Session Maintanence => App caches user info => can identify which specific user is querying or using app.
                    await AsyncStorage.setItem('@name', response.data.name).then(() => console.log('Name saved ', response.data.name)).catch(error => console.log('Error saving data: ', error));
                    await AsyncStorage.setItem('@id', response.data._id).then(() => console.log('ID saved ', response.data._id)).catch(error => console.log('Error saving data: ', error));
                    await AsyncStorage.setItem('@pw', pw).then(() => console.log('PW saved ', pw)).catch(error => console.log('Error saving data: ', error));
                    setPW(null);
                    setEmail(null);
                    setConfirmPW(null);
                    setLogError(null);
                    setSignupSuccess(true);
                } catch(error) {
                    console.error(error)
                }
            }

            sendUser();
        } 
        
        else {
            setLogError("Must fill out all fields");
            return;
        }
    }

    const handleLogin = () => {
        if(!(email && pw)) {
            setLogError("Must fill out all fields");
            return;
        }

        // quickCheck(email, pw);

        try {
            const correctUNPW = async() => {
                const data = { //JSON data to send to endpoint
                    email: email,
                    password: pw
                }
                const response = await axios.post(BASE_URL + '/user/login', data); //Create user endpoint
                console.log(response.data._id)
                //Allows Session Maintanence => App caches user info => can identify which specific user is querying or using app.
                await AsyncStorage.setItem('@name', response.data.name).then(() => console.log('Name saved ', response.data.name)).catch(error => console.log('Error saving data: ', error));
                await AsyncStorage.setItem('@id', response.data._id).then(() => console.log('ID saved ', response.data._id)).catch(error => console.log('Error saving data: ', error));
                await AsyncStorage.setItem('@pw', pw).then(() => console.log('PW saved ', pw)).catch(error => console.log('Error saving data: ', error));
                setPW(null);
                setEmail(null);
                setLogError(null);
                setSignupSuccess(true);
            }   
            correctUNPW();
        } catch(error) {
            console.error(error)
            setLogError("Incorrect Email or Password");
        }
    }
    //Determine whether to use Signup/Logic logic
    const handleLoginAndSignUp = () => {
        if(suTxt == "SIGN UP") {
            handleSignup()
        } else {
            handleLogin();
        }
    }

    const handleSwitch = () => {
        setEmail(null);
        setPW(null);
        setLogError(null);
        setConfirmPW(null);
        if(suTxt == "SIGN UP") {
            setSUTxt("LOGIN")
        } else {
            setSUTxt("SIGN UP")
        }
    }
    
    if(signupSuccess) { //on sign in/log in send to main page
        return (
            <MainPage onLogout={setSignupSuccess}/>
        );
    }

    return (
       <View
       className="w-full h-full bg-sky-950 items-center justify-center pt-20"
       >
            <Text
            className="text-5xl text-amber-400 font-extrabold mb-10"
            >
                BruinSafe
            </Text>
            <View
            className="w-10/12" 
            >
                <Text
                className={styles.inputText}
                >
                    Email:
                </Text>
                <TextInput
                className={styles.inputBox}
                // placeholder="UCLA email"
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
                // placeholder="Minimum 8 characters with one special character"
                placeholderTextColor={"rgb(2 132 199)"}
                onChangeText={setPW}
                value={pw}
                />

                {(suTxt == "SIGN UP") ?
                (<>
                    <Text
                    className={styles.inputText}
                    >
                        Confirm Password:
                    </Text>
                    <TextInput
                    secureTextEntry
                    className={styles.inputBox}
                    placeholder=""
                    placeholderTextColor={"rgb(2 132 199)"}
                    onChangeText={setConfirmPW}
                    value={confirmPW}
                    />
                </>) :
                null}

            </View>
            <TouchableScale 
                className="border-sky-300 border-2 w-1/3 mt-10 h-10 items-center justify-center bg-sky-300 rounded-lg"
                activeScale={0.97}
                onPress={() => handleLoginAndSignUp()}
                >
                    <Text
                    className="text-sky-950 text-md font-semibold"
                    >
                        {suTxt}
                    </Text>
            </TouchableScale>

            <TouchableScale
            className="border-sky-300 border-2 w-1/3 mt-6 h-10 items-center justify-center bg-transparent rounded-lg"
            onPress={() => handleSwitch()}
            activeScale={0.97}
            >
                <Text
                className="text-sky-300 text-md font-semibold"
                >
                    {(suTxt == "SIGN UP") ?
                    "BACK":
                    "NEW USER?"}
                </Text>
            </TouchableScale>

            <Text
            className="my-6 text-md text-red-600"
            >
                {logError}
            </Text>
       </View>
    );
}