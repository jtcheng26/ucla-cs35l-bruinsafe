import { View, Text, Alert, Image } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import WalkButton from "./walkButton";
import WalkingPage from "./WalkingPage";
import NumberReports from "./numberReports";
import moment from "moment";
import SafetyLevel from "./SafetyLevel";
import axios from "axios";
import * as Location from "expo-location";
import { BASE_URL } from "../../../constants";
import LocationButton from "../../../assets/location.svg";
import useUserId from "../../hooks/useUserId";
import ConfirmPath from "./confirmPath";
import TouchableScale from "react-native-touchable-scale";
import Megaphone from "../../../assets/megaphone.svg";
import PFP from "../../../assets/Default_pfp.svg.png";
import EndWalk from "./endWalk";
import MapViewDirections from "react-native-maps-directions";
import useSockets from "../../hooks/useSockets";
import isOutsidePath from "../../utils/isOutsidePath";
import isDoneWalk from "../../utils/isDoneWalk";
import timeToDestination, {
  progressToDestination,
} from "../../utils/timeToDestination";

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
  const [reports, setReports] = useState([]);
  const [isAlerted, setIsAlerted] = useState(false);
  const [walkPath, setWalkPath] = useState({
    start: null,
    end: null,
  });
  const [currentWalkId, setCurrentWalkId] = useState();
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
      setPermissionStatus(status);
      if (permissionStatus != "granted") {
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
          timeLeft={timeToDestination(walkerLoc ? walkerLoc.coords : location, path)}
          progress={progressToDestination(
            walkerLoc
              ? walkerLoc.coords
              : path
              ? path.coordinates[0]
              : { latitude: 0, longitude: 0 },
            path
          )}
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

  useEffect(() => {
    if (waiting) {
      const interval = setInterval(async () => {
        console.log("Polling...");
        let allWalks = (await axios.get(BASE_URL + "/walk/get")).data; //array of all WalkModels in DB
        let result = allWalks.filter(
          (walk) => walk.user._id == id && walk.state == 1
        ); //filter for the WalkModel that pertains to User and has been accepted
        if (result.length > 0) {
          setCurrentWalkId(result[0]._id);
          setCurrentWalker(result[0].guardian.name); //if there is such a walkmodel, setCurrentWalker to guardian of Walk
          setWaiting(false);
          setButtonAction(1);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [waiting]);
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
  useEffect(() => {
    if (id) fetchMarkers();
  }, [id]);
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
  useEffect(() => {
    if (mapRef && permissionStatus === "granted") {
      (async () => {
        if (!isGuardian) {
          const { coords, heading } = await getLocation();
          animateToLocation(coords, heading, 700, 50, 500);
        }
      })();
    }
  }, [mapRef, isGuardian, permissionStatus]);

  useEffect(() => {
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
    isEnded,
    setEnd,
  } = useSockets();

  function endWalk() {
    console.log("Ending walk", isEnded, currentWalkId);
    setMapMarkerList([]);
    setWalking(false);
    setIsGuardian(false);
    setCurrentWalker("");
    setButtonAction(0);
    if (!isGuardian) {
      axios.post(BASE_URL + "/walk/end", { id: currentWalkId });
      endRoom(currentWalkId);
    } else {
      Alert.alert(
        "Finished Walk!",
        "The user safely made it to their destination. Thank you for your service!",
        [
          {
            text: "Ok",
            onPress: () => setEnd(false),
          },
        ]
      );
    }
    setCurrentWalkId(null);
    setEnd(false);
    console.log(id, "Set end to false");
  }
  useEffect(() => {
    if (isGuardian && isEnded && currentWalkId) endWalk();
  }, [isGuardian, isEnded, currentWalkId]);
  useEffect(() => {
    if (
      walkerLoc &&
      path &&
      isGuardian &&
      isOutsidePath(walkerLoc.coords, path) &&
      !isAlerted
    ) {
      setIsAlerted(true);
      Alert.alert(
        "User has gone off Path!",
        "Call them to make sure they are OK!",
        [
          {
            text: "Done",
            onPress: () => {
              setTimeout(() => {
                setIsAlerted(false);
              }, 30000);
            },
          },
        ]
      );
      console.log("User is leaving path!");
    }
  }, [walkerLoc, path, isAlerted, setIsAlerted, isGuardian]);
  useEffect(() => {
    console.log(currentWalker, currentWalkId, isGuardian, connected);
    if (currentWalker && connected && path && currentWalkId) {
      setEnd(false);
      joinRoom(currentWalkId);
      const stream = setInterval(async () => {
        if (!currentWalkId) clearInterval(stream);
        if (isGuardian) return;
        const coords = await Location.getCurrentPositionAsync({
          accuracy: 3,
        });
        if (isDoneWalk(coords.coords, path)) {
          endWalk();
          clearInterval(stream);
        }
        if (isGuardian) return;
        shareLoc(coords, currentWalkId);
      }, 1000);
      return () => {
        clearInterval(stream);
      };
    }
  }, [currentWalker, currentWalkId, isGuardian, connected, path]);

  useEffect(() => {
    const fetchNearbyReports = async () => {
      try {
        const cur_loc = {
          //center of ucla
          latitude: 34.068925,
          longitude: -118.446629,
        };
        const response = await axios.post(BASE_URL + "/report/search", cur_loc);
        setReports(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNearbyReports();
  }, []);

  return (
    <View className="flex-1 justify-center items-center h-full w-full">
      <MapView
        userInterfaceStyle="dark"
        className="w-full h-full py-18"
        mapType="standard"
        onRegionChange={handleRegionChange}
        showsPointsOfInterest={false}
        showsUserLocation
        onUserLocationChange={(e) => {
          if (e.coordinate) console.log(e.coordinate);
        }}
        compassOffset={{
          x: 0,
          y: 50,
        }}
        ref={mapRef}
        showsCompass
      >
        {isGuardian && walkerLoc && (
          <Marker coordinate={walkerLoc.coords}>
            <View className="w-10 h-10 bg-white rounded-full items-center just">
              <Image source={PFP} className="w-10 h-10" />
            </View>
          </Marker>
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
            }}
          />
        ) : (
          ""
        )}

        {reports
          ? reports.map((report) => (
              <Marker
                coordinate={report.location}
                key={report._id}
                title={report.types.join(", ")}
                description={report.description}
              >
                <TouchableScale className="w-10 h-10 bg-red-500 items-center justify-center rounded-full pt-1">
                  <Megaphone width={30} height={30} fill={"#000"} />
                </TouchableScale>
              </Marker>
            ))
          : null}
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
      <NumberReports numReports={reports.length} />
      <SafetyLevel numReports={reports.length} />
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
      {currentWalker || isGuardian ? <EndWalk endWalkFunction={endWalk} /> : ""}
    </View>
  );
}
