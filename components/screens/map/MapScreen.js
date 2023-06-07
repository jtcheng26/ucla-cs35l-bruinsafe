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
import ConfirmPath from "./confirmPath";
import TouchableScale from "react-native-touchable-scale";

import MapViewDirections from "react-native-maps-directions";
import useSockets from "../../hooks/useSockets";
import isOutsidePath from "../../utils/isOutsidePath";
import isDoneWalk from "../../utils/isDoneWalk";
import timeToDestination from "../../utils/timeToDestination";

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
  const π = Math.PI;
  const φ1 = (lat1 * π) / 180; // φ, λ in radians
  const φ2 = (lat2 * π) / 180;
  const Δφ = ((lat2 - lat1) * π) / 180;
  const Δλ = ((lon2 - lon1) * π) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / π + 360) % 360; // in degrees
  return brng;
}
export default function MapScreen() {
  const { id } = useUserId(); //current usersid -- maintains session state
  const [walking, setWalking] = useState(false);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [mapMarkerList, setMapMarkerList] = useState([]);
  const [isGuardian, setIsGuardian] = useState(false);
  const [currentRegion, setRegion] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [currentWalker, setCurrentWalker] = useState("");
  const [walkPath, setWalkPath] = useState({
    start: null,
    end: null,
  });
  const [currentWalkId, setCurrentWalkId] = useState();
  // useEffect(() => {
  //   console.log("Map marker", mapMarkerList)
  // }, [mapMarkerList])
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
  const findWalkPath = async () => {
    if (id) {
      const result = await axios.get(BASE_URL + "/walk/get");
      let filtered = result.data.filter((w) => w.user._id == id);
      let guard = result.data.filter((w) =>
        w.guardian ? w.guardian._id == id : false
      );
      if (filtered.length > 0) {
        if (filtered[0].state) {
          setButtonAction(1);
          setCurrentWalker(filtered[0].guardian.name);
          setCurrentWalkId(filtered[0]._id);
        } else {
          setButtonAction(3);
          setWaiting(true);
        }
      } else if (guard.length > 0) {
        setMapMarkerList(guard);
        setIsGuardian(true);
        setButtonAction(1);
        setCurrentWalkId(guard[0]._id);
        setCurrentWalker(guard[0].user.name);
      }
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);
  useEffect(() => {
    const hrs = timeToDestination(location, path);
    console.log("TIME LEFT: " + Math.floor(hrs));
  }, [path]);
  useEffect(() => {
    if (id) findWalkPath();
  }, [id]);
  const fetchMarkers = async () => {
    let allMarkers = await axios.get(BASE_URL + "/walk/get");
    let copyMarkers = allMarkers.data.filter((x) => x.user._id === id);
    let guardMarkers = allMarkers.data.filter((x) =>
      x.guardian ? x.guardian._id === id : false
    );
    // for (let i = 0; i < allMarkers.data.length; i++) {
    //   if (allMarkers.data[i].user == id) {
    //     copyMarkers.push(<Marker coordinate={{latitude: allMarkers.data[i].origin.latitude, longitude: allMarkers.data[i].origin.longitude}} pinColor={'#C9123A'} />)
    //     copyMarkers.push(<Marker coordinate={{latitude: allMarkers.data[i].destination.latitude, longitude: allMarkers.data[i].destination.longitude}} pinColor={'#FBBF24'} />)
    //   }
    // }
    // console.log(id, allMarkers.data[0].user)
    // console.log(allMarkers.data)
    // console.log(copyMarkers);

    if (copyMarkers.length) {
      setMapMarkerList(copyMarkers);
      if (copyMarkers[0].state) {
        setWalking(true);
        setCurrentWalkId(copyMarkers[0]._id);
      }
    } else if (guardMarkers.length) {
      setMapMarkerList(guardMarkers);
      setMapMarkerList(guardMarkers);
      setIsGuardian(true);
      setCurrentWalkId(guardMarkers[0]._id);
      setCurrentWalker(guardMarkers[0].user.name);
      setButtonAction(1);
    }
  };
  const getLocation = async (accuracy = 3) => {
    try {
      let curLocation = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };
      curLocation = await Location.getCurrentPositionAsync({
        accuracy: accuracy,
      });
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
          curLocation={location}
          setWaiting={setWaiting}
        />
      );
    } else if (actionState == 1) {
      return (
        <WalkingPage
          locationName={data.cityName}
          walkerFullName={currentWalker}
          currentTime={currentDateTime}
          timeLeft={timeToDestination(location, path)}
          onPress={setButtonAction}
        />
      );
    } else if (actionState == 2) {
      return (
        <ConfirmPath
          onPress={setButtonAction}
          coordinates={mapMarkerList[0]}
          setMarkerList={setMapMarkerList}
          setThePath={setWalkPath}
          copyPath={walkPath}
          setWalking={setWalking}
          setWaiting={setWaiting}
          waiting={waiting}
          setCurrentWalker={setCurrentWalker}
          setCurrentWalkId={setCurrentWalkId}
          timeLeft={timeToDestination(location, path)}
        />
      );
    } else if (actionState == 3) {
      return (
        <TouchableScale
          className="absolute bottom-24 mb-5 bg-blue-500/90 w-5/6 py-5 rounded-full items-center justify-center"
          activeScale={1}
        >
          <Text className="font-bold text-zinc-200 text-xl">
            finding match...
          </Text>
        </TouchableScale>
      );
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
    // console.log("MARKER LIST");
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
        if (!isGuardian) {
          const { coords, heading } = await getLocation();
          animateToLocation(coords, heading, 700, 50, 500);
        }
      })();

      // animateToLocation(origin, h)
      // return () => clearTimeout(si)
      //   }, 5000);
      //   return clearTimeout(to);
    }
  }, [mapRef, isGuardian, permissionStatus]);

  useEffect(() => {
    // console.log("WalkingMarkerList", mapMarkerList);
    if ((walking || isGuardian) && path) {
      animateToLocation(
        mapMarkerList[0].origin,
        getHeading(path.coordinates[0], path.coordinates[1])
      );
    }
  }, [walking, path, isGuardian]);

  const {
    socket,
    connected,
    createRoom,
    joinRoom,
    endRoom,
    shareLoc,
    walkerLoc,
    roomId,
  } = useSockets();
  useEffect(() => {
    if (isGuardian && walkerLoc) {
      console.log("Received location from walker", walkerLoc);
    }
  }, [isGuardian, walkerLoc]);
  function endWalk() {
    setMapMarkerList([]);
    setWalking(false);
    setCurrentWalker("");
    setButtonAction(0);
    axios.post(BASE_URL + "/walk/end", { id: currentWalkId });
    setCurrentWalkId(null);
  }
  useEffect(() => {
    if (currentWalker && connected && path && currentWalkId) {
      joinRoom(currentWalkId);
      const stream = setInterval(async () => {
        if (!currentWalkId) clearInterval(stream);
        if (isGuardian) return;
        const { coords } = await getLocation(5);
        if (isOutsidePath(coords, path)) {
          // TODO: alert user
          console.log("User is leaving path!");
        } else if (isDoneWalk(coords, path)) {
          console.log("User is finished walk.");
          endRoom(currentWalkId);
          endWalk();
          clearInterval(stream);
        }
        shareLoc(coords, currentWalkId);
      }, 1000);
      return () => {
        endRoom(currentWalkId);
        clearInterval(stream);
      };
    }
  }, [currentWalker, currentWalkId, isGuardian, connected, path]);

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
        {isGuardian && walkerLoc && (
          <Marker coordinate={walkerLoc} pinColor="#FFFFFF" />
        )}
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
        {walkPath.start && (
          <Marker
            key={"start1"}
            coordinate={walkPath.start}
            pinColor="#FBBF24"
          />
        )}

        {walkPath.end && (
          <Marker key={"end1"} coordinate={walkPath.end} pinColor="#BA132C" />
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
              console.log(res);
              setPath(res);
              //setWalking(false);
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
