import { View } from "react-native";
import { useState } from "react";
import HomeScreen from "./HomeScreen";
import MapScreen from "../map/MapScreen.js";
import ReportScreen from "./ReportScreen";
import NavBar from "../../overlays/NavBar";
import ProfileHeader from "../../overlays/ProfileHeader";

//After Login Render
export default function MainPage({ onLogout }) {
  const [screen, setScreen] = useState("map");
  let page = "";
  const updateScreen = (newScreen) => {
    //callback function for Navbar to update screen
    setScreen(newScreen);
  };
  return (
    <View className="w-full h-full">
      {screen === "map" && <MapScreen />}
      {screen === "home" && <HomeScreen updateScreen={updateScreen} />}
      {screen === "report" && <ReportScreen />}
      <ProfileHeader onLogout={onLogout} />
      <NavBar screen={screen} updateScreen={updateScreen} />
    </View>
  );
}
