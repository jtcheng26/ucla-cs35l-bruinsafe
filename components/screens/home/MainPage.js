import { View } from "react-native"
import { useState } from "react";
import HomeScreen from "./HomeScreen";
import MapScreen from "../map/MapScreen.js"
import ReportScreen from "./ReportScreen";
import NavBar from "../../overlays/NavBar";
import ProfileHeader from "../../overlays/ProfileHeader";

export default function MainPage({ onLogout }) {
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
            <ProfileHeader onLogout={onLogout}/>
            <NavBar updateScreen={updateScreen} />
        </View>
    )
}