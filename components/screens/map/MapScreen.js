import { View, Text } from 'react-native';
import { useState } from 'react';
import NavBar from '../../overlays/NavBar';
import MapView from 'react-native-maps';
import ProfileHeader from '../../overlays/ProfileHeader';
import WalkButton from './walkButton';
import WalkingPage from './WalkingPage';
import NumberReports from './numberReports';

export default function MapScreen() {
    let location = {
        latitude: 33.1507,
        longitude: -96.8236,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
    };
    const [walking, setWalking] = useState(true);
    return (
        <View className="flex-1 justify-center items-center h-full w-full bg-sky-950">
            {/* <ProfileHeader /> */}
            <MapView 
                userInterfaceStyle={'dark'}
                className="w-full h-full py-18"
                mapType="terrain"
                region={location}
            />
            <NumberReports numReports={9}/>
            {walking ? <WalkingPage /> : <WalkButton />}
            <NavBar />
        </View>
    )
}