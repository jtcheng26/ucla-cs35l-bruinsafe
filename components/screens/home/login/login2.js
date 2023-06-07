import React, { useState } from 'react';
import personImage from "../../../../assets/User_alt_fill.png";
import lock from "../../../../assets/lock.png";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import TextBox from './textBox2';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { create } from 'tailwind-react-native-classnames';
// Import the functions you need from the SDKs you need
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const Login2 = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleEmailChange = (text) => {
    setEmail(text);
  };


  const handlePasswordChange = (text) => {
    setPassword(text);
  };




  

  const handleSignUp = () => {


    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {

    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("signup error:", errorCode, errorMessage);
    // ..
  });

  };

  const handleLogin = () => {
   // const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
     // console.log("logged in");
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("login error:", errorCode, errorMessage);
    });


  };




    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginLogo}>BruinSafe</Text>
        <TextBox 
          placeholder="username" 
          style={styles.loginBox1}
          value={email}
          onChangeText={handleEmailChange}
        />
          <Image source={personImage} style={styles.loginPerson} />

        <TextBox 
          placeholder="password" 
          style={styles.loginBox2}
          value={password}
          onChangeText={handlePasswordChange}
        />
          <Image source={lock} style={styles.loginLock} />


        <TouchableOpacity style={styles.signup} onPress={handleSignUp}>
          <Text style={styles.buttonText}>signup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login} onPress={handleLogin}>
          <Text style={styles.buttonText}>login</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#0b1e33',
    borderRadius: 25,
  },
  loginLogo: {
    flex: 1,
    width: 270,
    height: 124,
    left: 60,
    top: 186,
    fontFamily: 'Source Sans 3',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 60,
    lineHeight: 85,
    textAlign: 'center',
    color: '#fbbf24',
  },
  loginBox1: {
    position: 'absolute',
    left: 25,
    top: 350,
    width: 339,
    height: 63,
    borderRadius: 20,
    backgroundColor: "#10597C80",
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPerson: {
    position: 'absolute',
    top: 370,
    left: 25,
    width: 18,
    height: 19,
    marginLeft: 22,
    zIndex: 1,
  },
  loginBox2: {
    position: 'absolute',
    width: 339,
    height: 63,
    left: 25,
    top: 430,
    backgroundColor: 'rgba(16, 89, 124, 0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLock: {

    position: 'absolute',
    top: 450,
    left: 25,
    width: 18,
    height: 19,
    marginLeft: 22,
    zIndex: 1,
  },
  loginInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Source Sans 3',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    color: '#0ea5e9',
    border: 'none',
  },
  login: {
    position: 'absolute',
    width: 110,
    height: 30,
    left: 140,
    top: 550,
    backgroundColor: '#0ea5e9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Source Sans 3',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
  },

  signup: {
    position: 'absolute',
    width: 110,
    height: 30,
    left: 140,
    top: 509,
    backgroundColor: '#0ea5e9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Login2;
