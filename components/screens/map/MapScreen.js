import { View, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../../overlays/NavBar";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import ProfileHeader from "../../overlays/ProfileHeader";
import WalkButton from "./walkButton";
import WalkingPage from "./WalkingPage";
import NumberReports from "./numberReports";
import mapStyle from "./mapStyle.json";
import moment from "moment";
import EscortList from "./escortList";
import PathSelect from "./PathSelect";
import SafetyLevel from "./SafetyLevel";
import axios from "axios";
import * as Location from "expo-location";
import { BASE_URL } from "../../../constants";
import LocationButton from "../../../assets/location.svg";
import useUserId from "../../hooks/useUserId";
import ConfirmPath from './confirmPath';

import MapViewDirections from "react-native-maps-directions";

// const origin = { latitude: 34.070819, longitude: -118.449262 };
// const destination = { latitude: 34.069201, longitude: -118.443515 };

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
function getHeading(coordinate1, coordinate2) {
  const lat1 = coordinate1.latitude;
  const lat2 = coordinate2.latitude;
  const lon1 = coordinate1.longitude;
  const lon2 = coordinate2.longitude;

  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360; // in degrees
  return brng;
}
export default function MapScreen() {
  const { id } = useUserId();
  const [walking, setWalking] = useState(false);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [mapMarkerList, setMapMarkerList] = useState([]);
  const [currentRegion, setRegion] = useState(null);
  const [walkPath, setWalkPath] = useState({
    start: null,
    end: null,
  });
  const [path, setPath] = useState();
  const [markerStyles, setMarkerStyles] = useState({
    width: 60,
    height: 60,
    fill: "#FBBF24",
  });
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
  const [currentDateTime, setDateTime] = useState(moment().format("hh:mm a"));
  const [permissionStatus, setPermissionStatus] = useState("");
  const [foundUserLoc, setFoundUserLoc] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const getPermissions = async () => {
    if (!permissionStatus || permissionStatus != "granted") {
      let { status } = await Location.requestForegroundPermissionsAsync();
      //console.log(status);
      setPermissionStatus(status);
      if (permissionStatus != "granted") {
        // console.log("Location Permissions Denied!");
        return;
      }
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);
  const fetchMarkers = async () => {
    let allMarkers = await axios.get(BASE_URL + "/walk/get");
    let copyMarkers = allMarkers.data.filter((x) => x.user === id);
    // for (let i = 0; i < allMarkers.data.length; i++) {
    //   if (allMarkers.data[i].user == id) {
    //     copyMarkers.push(<Marker coordinate={{latitude: allMarkers.data[i].origin.latitude, longitude: allMarkers.data[i].origin.longitude}} pinColor={'#C9123A'} />)
    //     copyMarkers.push(<Marker coordinate={{latitude: allMarkers.data[i].destination.latitude, longitude: allMarkers.data[i].destination.longitude}} pinColor={'#FBBF24'} />)
    //   }
    // }
    // console.log(id, allMarkers.data[0].user)
    // console.log(allMarkers.data)
    console.log(copyMarkers);
    setMapMarkerList(copyMarkers);
  };
  const getLocation = async () => {
    try {
      let curLocation = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };
      curLocation = await Location.getCurrentPositionAsync({ accuracy: 3 });
      const heading = await Location.getHeadingAsync();
      let locCopy = { ...location };
      locCopy.latitude = curLocation.coords.latitude;
      locCopy.longitude = curLocation.coords.longitude;
      setLocation(locCopy);
      setDeviceHeading(heading);
      setFoundUserLoc(true);
      return { coords: locCopy, heading: heading.magHeading };
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    (async () => {
      await getPermissions();
      // await getLocation()
    })();
  }, []);

  const CurrentButton = (actionState) => {
    if (actionState == 0) {
      return (
        <WalkButton
          text={"walk with someone"}
          onPress={setButtonAction}
          setMarker={setMarkerVisible}
          setMarkerStyle={setMarkerStyles}
          markerList={mapMarkerList}
          setMarkerList={setMapMarkerList}
          regionCoords={currentRegion}
          walkPath={walkPath}
          setWalkPath={setWalkPath}
        />
      );
    } else if (actionState == 1) {
      return (
        <WalkingPage
          locationName={data.cityName}
          walkerFullName={"Carey Nachenberg"}
          currentTime={currentDateTime}
          onPress={setButtonAction}
        />
      );
    } else if (actionState == 2) {
      return <ConfirmPath onPress={setButtonAction} coordinates={mapMarkerList[0]} />;
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
  const handleRegionChange = (region) => {
    setRegion(region);
  };
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   const interval = setInterval(getLocation, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  useEffect(() => {
    if (id) fetchMarkers();
    // console.log("fetched marers");
    // const interval = setInterval(fetchMarkers, 1000);
    // console.log("Placed Markers");
    // return () => {
    //   clearInterval(interval);
    // };
  }, [id]);
  // setInterval(() => {
  //   setDateTime(moment().format("hh:mm a"));
  // }, 2500);
  const mapRef = useRef(null);
  function animateToLocation(
    coords,
    heading,
    altitude = 200,
    pitch = 60,
    duration = 3000
  ) {
    mapRef.current.animateCamera(
      {
        center: coords,
        pitch: pitch,
        heading: heading,
        altitude: altitude,
        zoom: 40,
      },
      duration
    );
  }
  // console.log("render")
  // console.log(mapMarkerList)
  useEffect(() => {
    if (mapRef && permissionStatus === "granted") {
      //   const to = setTimeout(() => {
      // const h = getHeading(path.coordinates[0], path.coordinates[1])
      // const si = setInterval(() => {
      //     animateToLocation(origin, mapRef.current.heading)
      // }, 2000)
      (async () => {
        const { coords, heading } = await getLocation();
        animateToLocation(coords, heading, 700, 50, 500);
      })();

      // animateToLocation(origin, h)
      // return () => clearTimeout(si)
      //   }, 5000);
      //   return clearTimeout(to);
    }
  }, [mapRef, permissionStatus]);

  useEffect(() => {
    if (walking) {
      animateToLocation(
        mapMarkerList[0].origin,
        getHeading(path.coordinates[0], path.coordinates[1])
      );
    }
  }, [walking]);

  return (
    <View className="flex-1 justify-center items-center h-full w-full">
      <MapView
        // provider={PROVIDER_GOOGLE}
        userInterfaceStyle="dark"
        className="w-full h-full py-18"
        // region={location}
        mapType="standard"
        onRegionChange={handleRegionChange}
        showsPointsOfInterest={false}
        showsUserLocation
        onUserLocationChange={(e) => {
          // if (e.coordinate)
          //   console.log(e.coordinate)
        }}
        compassOffset={{
          x: 0,
          y: 50,
        }}
        ref={mapRef}
        showsCompass
      >
        {mapMarkerList && mapMarkerList.length >= 1 ? (
          <>
            <Marker
              key={mapMarkerList[0].user + "1"}
              coordinate={mapMarkerList[0].origin}
              pinColor="#FBBF24"
            />
            <Marker
              key={mapMarkerList[0].user + "0"}
              coordinate={mapMarkerList[0].destination}
              pinColor="#C9123A"
            />
          </>
        ) : (
          ""
        )}
        {(!mapMarkerList || mapMarkerList.length === 0) && walkPath.start ? (
          <Marker
            key={"start1"}
            coordinate={walkPath.start}
            pinColor="#FBBF24"
          />
        ) : (
          ""
        )}
        {/* {mapMarkerList.map((x, i) => <Marker key={x.user + i + "1"} coordinate={x.origin} pinColor="#FBBF24" />)[0]}
        {mapMarkerList.map((x, i) => <Marker key={x.user + i + "0"} coordinate={x.destination} pinColor="#C9123A" />)[0]} */}
        {/* <Marker coordinate={{latitude: 34.069201, longitude: -118.443515}}/> */}
        {GOOGLE_MAPS_APIKEY && mapMarkerList.length ? (
          <MapViewDirections
            origin={mapMarkerList[0].origin}
            destination={mapMarkerList[0].destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor="#fbbf24"
            strokeWidth={6}
            lineCap="round"
            mode="WALKING"
            onReady={(res) => {
              setPath(res);
              setWalking(true);
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
      <View className="w-1/12 h-1/12 absolute m-auto flex justify-center items-center">
        {markerVisible ? (
          <LocationButton
            width={markerStyles.width}
            height={markerStyles.height}
            fill={markerStyles.fill}
          />
        ) : null}
      </View>
      {CurrentButton(buttonAction)}
    </View>
  );
}
