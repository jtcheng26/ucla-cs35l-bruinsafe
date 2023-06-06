import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import ProfileHeader from '../../overlays/ProfileHeader';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import WalkingRequestPanel from './WalkingRequestPanel';
import { useState, useEffect, useMemo } from 'react';
import ReportsPanel from './ReportsPanel';


export default function HomeScreen() {
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchNearbyUsers = async() => {
            try {
                const response = await axios.get(BASE_URL + "/walk/get");
                setUsers(response.data);
                let tu = {};
            } catch(e) {
                console.error(e)
            }
        }
        fetchNearbyUsers();
    }, []);

    useEffect(() => {
        const fetchNearbyReports = async() => {
            try {
                const cur_loc = {
                    latitude: 34.068925,
                    longitude: -118.446629
                }
                const response = await axios.post(BASE_URL + "/report/search", cur_loc);
                setReports(response.data)
            } catch(e) {
                console.error(e);
            }
        }
        fetchNearbyReports();
    }, [])

    const handleDecline = (id) => {
        let newArr = newUsers.filter(u => u._id !== id)
        setNewUsers(newArr)
    }

    const [userobjs, setUserobjs] = useState([]);
    //to decline
    const [newUsers, setNewUsers] = useState([]);

    useEffect(() => {
        if (!users) return [];
        (async () => {
            const fetched = await Promise.all(users.map(u => axios.get(BASE_URL + "/user/" + u.user)))
            setNewUsers(fetched.map(f =>
                f.data
            ))
        })()
        
    }, [users])

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
                    {newUsers.map(f => (
                        <WalkingRequestPanel 
                        key={f._id}
                        user={f}
                        onDecline={handleDecline}
                        />
                    ))}
                </ScrollView>
            </View>
            <Text
            className="text-2xl font-semibold text-blue-200 mt-4 mb-4 ml-8"
            >
                Nearby Incidents
            </Text>
            <View
            className="w-full h-1/5 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                horizontal
                >
                    {reports.map((report) => (
                        <ReportsPanel
                        key={report._id}
                        type={
                            (report.types.length > 0) ?
                            report.types.join(", ") :
                            report.type
                        }
                        desc={report.description}
                        date={report.timestamp.slice(0,10)}
                        />
                    ))}
                </ScrollView>
            </View>
            
        </View>
    );
}