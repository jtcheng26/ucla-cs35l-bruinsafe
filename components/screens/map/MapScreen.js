import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from "../../overlays/NavBar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import ProfileHeader from "../../overlays/ProfileHeader";
import WalkButton from "./walkButton";
import WalkingPage from "./WalkingPage";
import NumberReports from "./numberReports";
import mapStyle from "./mapStyle.json";
import moment from 'moment';
import EscortList from './escortList';
import axios from 'axios';

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
    let location = {
        latitude: 34.069201,
        longitude: -118.443515,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
    };
    const [walking, setWalking] = useState(false);
    const [data, setData] = useState({});
    const [currentDateTime, setDateTime] = useState(moment().format("hh:mm a"));
    useEffect(() => {
        const fetchData = async () => {
            try {
                let dataCopy = {...data};
                let numReports = await axios.post("http://169.232.214.177:8080/report/search", {location:location});
                let currentLocation = await axios.get("http://api.openweathermap.org/geo/1.0/reverse?lat=" + location.latitude + "&lon=" + location.longitude + "&cnt=1&APPID=1107f09a2cd574c391617612953ada00");
                dataCopy.cityName = currentLocation.data[0].name;
                dataCopy.stateName = currentLocation.data[0].state;
                dataCopy.numReports = parseInt(numReports.data.length);
                setData(dataCopy);
            } catch (e) {
                console.error(e)
            }
        };
        fetchData();
    }, []);
    setInterval(() => {
        setDateTime(moment().format("hh:mm a"))}, 2500);
    return (
        <View className="bg-sky-950 from-slate-950 flex-1 justify-center items-center h-full w-full">
            <MapView 
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                className="w-full h-full py-18"
                region={location}
            />
            <View className="absolute top-0 w-full">
                <LinearGradient
                    colors={['#020617', 'transparent']}
                    start={{x : 0.5, y : 0.2}}
                    end={{x: 0.5, y: 1}}
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
                    colors={['transparent', '#020617']}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 0.8}}
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
            <ProfileHeader name={"David Smallberg"}/>
            <NumberReports numReports={data.numReports}/>
            {walking ? <WalkingPage locationName={data.cityName} walkerFullName={"Carey Nachenberg"} currentTime={currentDateTime}/> : <WalkButton text={"walk with someone"} onPress={setWalking} />}
        </View>
    )
}
