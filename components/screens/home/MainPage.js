import { View } from "react-native"
import { useState } from "react";
import HomeScreen from "./HomeScreen";
import MapScreen from "../map/MapScreen.js"
import ReportScreen from "./ReportScreen";
import NavBar from "../../overlays/NavBar";

export default function MainPage() {
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