import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './components/overlays/Tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/screens/home/HomeScreen';
import MapScreen from './components/screens/map/MapScreen';
import ReportScreen from './components/screens/home/ReportScreen';
import MapScreen from './components/screens/home/MapScreen';

export default function App() {
    const [screen, setScreen] = useState("map");
    if (screen == "home") return <HomeScreen />;
    else if (screen == "map") return <MapScreen />;
    else if (screen == "report") return <ReportScreen />;
}