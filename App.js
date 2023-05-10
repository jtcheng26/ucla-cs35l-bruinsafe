import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/screens/home/HomeScreen';

export default function App() {
    const [screen, setScreen] = useState("home");
    if (screen == "home") return <HomeScreen />;
}