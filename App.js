import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/screens/home/HomeScreen';
import MapScreen from './components/screens/map/MapScreen';
import ReportScreen from './components/screens/home/ReportScreen';
import NavBar from './components/overlays/NavBar';

export default function App() {
    const [screen, setScreen] = useState("map");
    let page = "";
    const updateScreen = (newScreen) => {
        setScreen(newScreen);
    };
    if (screen == "home") page = <HomeScreen />;
    else if (screen == "map") page = <MapScreen />;
    else if (screen == "report") page = <ReportScreen />;
    return (
        <View className="w-full h-full">
            {page}
            <NavBar updateScreen={updateScreen} />
        </View>
    )

}