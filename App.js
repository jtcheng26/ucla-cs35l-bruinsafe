import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/screens/home/HomeScreen';
import MapScreen from './components/screens/map/MapScreen';
import ReportScreen from './components/screens/home/ReportScreen';

export default function App() {
    const [screen, setScreen] = useState("map");
    if (screen == "home") return <HomeScreen />;
    else if (screen == "map") return <MapScreen />;
    else if (screen == "report") return <ReportScreen />;
}