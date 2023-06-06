import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import ProfileHeader from '../../overlays/ProfileHeader';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import WalkingRequestPanel from './WalkingRequestPanel';
import { useState, useEffect } from 'react';
import PreviousWalksPanel from './PreviousWalksPanel';


export default function HomeScreen() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchNearbyUsers = async() => {
            try {
                const response = await axios.get(BASE_URL + "/users/nearby");
                setUsers(response.data);
            } catch(e) {
                console.error(e)
            }
        }
        fetchNearbyUsers();
    }, []);

    const handleDecline = (id) => {
        let newArr = users.filter(u => u._id !== id)
        setUsers(newArr)
    }

    return (
        <View className="flex-1 bg-sky-950">
            {/* <ProfileHeader /> */}
            <Text
            className="text-2xl font-semibold text-amber-400 mt-28 mb-2 ml-8"
            >
                Walk Requests
            </Text>
            <View
            className="w-full h-2/5 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                >
                    {users.map((user) => (
                        <WalkingRequestPanel 
                        key={user.id}
                        user={user}
                        onDecline={handleDecline}
                        />
                    ))}
                </ScrollView>
            </View>
            <Text
            className="text-2xl font-semibold text-blue-200 mt-4 mb-4 ml-8"
            >
                Previous Walks
            </Text>
            <View
            className="w-full h-1/5 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                horizontal
                >
                    <PreviousWalksPanel 
                    
                    />
                </ScrollView>
            </View>
            
        </View>
    );
}