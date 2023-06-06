import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../../overlays/NavBar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import ProfileHeader from "../../overlays/ProfileHeader";
import WalkButton from "./walkButton";
import WalkingPage from "./WalkingPage";
import NumberReports from "./numberReports";
import mapStyle from "./mapStyle.json";
import moment from 'moment';
import EscortList from './escortList';
import PathSelect from './PathSelect';
import SafetyLevel from './SafetyLevel';
import axios from 'axios';
import * as Location from 'expo-location';
import { BASE_URL } from '../../../constants';

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

//#020617
export default function MapScreen() {
  const [walking, setWalking] = useState(true);
  const [location, setLocation] = useState({
    latitude: 34.069201,
    longitude: -118.443515,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  });
  const [buttonAction, setButtonAction] = useState(0);
  const [data, setData] = useState({
    numReports: 0,
    cityName: "Westwood Plaza",
    stateName: "California",
  });
  const [path, setPath] = useState({});
  const [currentDateTime, setDateTime] = useState(moment().format("hh:mm a"));
  const getLocation = async () => {
    try {
      let curLocation = await Location.getCurrentPositionAsync({});
      let locCopy = { ...location };
      locCopy.latitude = curLocation.coords.latitude;
      locCopy.longitude = curLocation.coords.longitude;
      setLocation(locCopy);
    } catch (e) {
      console.error(e);
    }
  };
  const CurrentButton = (actionState) => {
    if (actionState == 0) {
        return <WalkButton text={"walk with someone"} onPress={setButtonAction} />;
    } else if (actionState == 1) {
        return <WalkingPage locationName={data.cityName} walkerFullName={"Carey Nachenberg"} currentTime={currentDateTime} onPress={setButtonAction} />;
    } else if (actionState == 2) {
        return <PathSelect />
    } else {
        return null;
    }
};
  const fetchData = async () => {
    try {
      let dataCopy = { ...data };
      let numReports = await axios.post(BASE_URL + "/report/search", {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      let currentLocation = await axios.get(
        "http://api.openweathermap.org/geo/1.0/reverse?lat=" +
          location.latitude +
          "&lon=" +
          location.longitude +
          "&cnt=1&APPID=1107f09a2cd574c391617612953ada00"
      );
      dataCopy.cityName = currentLocation.data[0].name;
      dataCopy.stateName = currentLocation.data[0].state;
      dataCopy.numReports = parseInt(10);
      setData(dataCopy);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const interval = setInterval(fetchData, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(getLocation, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);
  setInterval(() => {
    setDateTime(moment().format("hh:mm a"));
  }, 2500);
  return (
    <View className="flex-1 justify-center items-center h-full w-full">
      <MapView
        // provider={PROVIDER_GOOGLE}
        userInterfaceStyle="dark"
        className="w-full h-full py-18"
        region={location}
        mapType="standard"
        showsPointsOfInterest={false}
        showsUserLocation
        compassOffset={{
          x: 0,
          y: 50,
        }}
        showsCompass
      >
        {GOOGLE_MAPS_APIKEY && walking ? (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor="#fbbf24"
            strokeWidth={6}
            lineCap="round"
            mode="WALKING"
            onReady={(res) => {
                console.log(res)
            }}
          />
        ) : (
          ""
        )}
      </MapView>
      <View
        className="absolute top-0 left-0 bottom-0 right-0 bg-blue-700/40"
        pointerEvents="none"
      />

      <View className="absolute top-0 w-full">
        <LinearGradient
          colors={["rgb(30 58 138)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        >
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
        </LinearGradient>
      </View>
      <View className="absolute bottom-0 w-full">
        <LinearGradient
          colors={["transparent", "rgb(30 58 138)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
        </LinearGradient>
      </View>
      {/* <ProfileHeader name={"David Smallberg"} /> */}
      <NumberReports numReports={data.numReports} />
      <SafetyLevel numReports={data.numReports} />
      {CurrentButton(buttonAction)}
    </View>
  );
}
