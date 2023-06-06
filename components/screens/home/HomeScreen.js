import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import ProfileHeader from '../../overlays/ProfileHeader';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import WalkingRequestPanel from './WalkingRequestPanel';
import { useState } from 'react';


export default function HomeScreen() {

    const [users, setUsers] = useState([])

    const fetchNearbyUsers = async() => {
        try {
            const response = await axios.get(BASE_URL + "/users/nearby");
            setUsers(response.data);
        } catch(e) {
            console.error(e)
        }
    }
    fetchNearbyUsers();


    return (
        <View className="flex-1 bg-sky-950">
            <ProfileHeader />
            <Text
            className="text-3xl font-semibold text-amber-400 mt-28 mb-4 ml-8"
            >
                Walk Requests
            </Text>
            <View
            className=" w-full h-2/3 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                >
                    {users.map((user) => (
                        <WalkingRequestPanel 
                        name={user.name}
                        />
                    ))}

                </ScrollView>
            </View>
            
        </View>
    );
}