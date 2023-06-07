import { View } from "react-native";
import { useState } from "react";
import HomeScreen from "./HomeScreen";
import MapScreen from "../map/MapScreen.js";
import ReportScreen from "./ReportScreen";
import NavBar from "../../overlays/NavBar";
import ProfileHeader from "../../overlays/ProfileHeader";

export default function MainPage({ onLogout }) {
  const [screen, setScreen] = useState("map");
  let page = "";
  const updateScreen = (newScreen) => {
    setScreen(newScreen);
  };
  return (
    <View className="w-full h-full">
      <View className={screen === "map" ? "w-full h-full" : "hidden"}>
        <MapScreen />
      </View>
      {screen === "home" && <HomeScreen />}
      {screen === "report" && <ReportScreen />}
      <ProfileHeader onLogout={onLogout} />
      <NavBar updateScreen={updateScreen} />
    </View>
  );
}
