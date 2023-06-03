import { View, Text } from "react-native";
import { useState } from "react";
import NavBar from "../../overlays/NavBar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import ProfileHeader from "../../overlays/ProfileHeader";
import WalkButton from "./walkButton";
import WalkingPage from "./WalkingPage";
import NumberReports from "./numberReports";
import mapStyle from "./mapStyle.json";

import MapViewDirections from "react-native-maps-directions";

const origin = { latitude: 34.070819, longitude: -118.449262 };
const destination = { latitude: 34.069201, longitude: -118.443515 };

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_APIKEY;
/*
34.069201, -118.443515 boelter
34.069871, -118.443453 intersection outside
34.069881, -118.446001 pauley intersection
34.070988, -118.446062 pauley bruinwalk intersectino
34.070819, -118.449262 bruinwalk intersection
34.071156, -118.449693 de neve intersection
34.070726, -118.450186 de neve plaza
*/

export default function MapScreen() {
  
  let location = {
    latitude: 33.1507,
    longitude: -96.8236,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  };
  const [walking, setWalking] = useState(false);
  return (
    <View className="flex-1 justify-center items-center h-full w-full bg-sky-950">
      {/* <ProfileHeader /> */}
      <MapView
        provider={PROVIDER_GOOGLE}
        userInterfaceStyle={"dark"}
        className="w-full h-full py-18"
        // mapType="terrain"
        region={location}
        customMapStyle={mapStyle}
      >
        {/* {GOOGLE_MAPS_APIKEY && ( */}
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor="red"
            strokeWidth={6}
            onReady={(res) => {
              console.log(res);
            }}
          />
        {/* )} */}
      </MapView>
      <NumberReports numReports={9} />
      {walking ? <WalkingPage /> : <WalkButton />}
      <NavBar />
    </View>
  );
}
