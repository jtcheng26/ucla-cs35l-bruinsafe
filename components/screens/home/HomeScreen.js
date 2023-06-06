import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router'
import MapView from 'react-native-maps'
import ProfileHeader from '../../overlays/ProfileHeader';
import axios from 'axios';
import { BASE_URL } from '../../../constants';
import WalkingRequestPanel from './WalkingRequestPanel';
import { useState, useEffect, useMemo } from 'react';
import ReportsPanel from './ReportsPanel';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const month = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec",
    }

    useEffect(() => {
        const fetchNearbyUsers = async() => {
            try {
                const response = await axios.get(BASE_URL + "/walk/get");
                setUsers(response.data);
                let tu = {};
            } catch(e) {
                console.error(e);
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

    const handleAccept = async(walkID) => {
        try {
            const userID = await AsyncStorage.getItem('@id');
            const data = {
                id: walkID,
                user: userID,
            }
        const response = await axios.post(BASE_URL + "/walk/accept", data);
        console.log(response.data);
        }
        catch(error)
        {
            console.log(error)
        }
    }
    
    const [userobjs, setUserobjs] = useState([]);
    //to decline
    const [newUsers, setNewUsers] = useState([]);

    useEffect(() => {
        if (!users) return [];
        (async () => {
            const cur_user_id = await AsyncStorage.getItem("@id");
            let newArr = users.filter(u => u.user !== cur_user_id);
            const fetched = await Promise.all(newArr.map(u => axios.get(BASE_URL + "/user/" + u.user)));
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
                Nearby Walk Requests
            </Text>
            <View
            className="w-full h-2/5 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                >
                    {newUsers.map(f => (
                        <WalkingRequestPanel 
                        key={Math.random()}
                        user={f}
                        onDecline={handleDecline}
                        onAccept={handleAccept}
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
                        type={report.types.join(", ")}
                        desc={report.description}
                        date={month[report.timestamp.slice(5,7)] + " " +
                            report.timestamp.slice(8,10) + 
                            ", " + report.timestamp.slice(0,4)
                        }
                        />
                    ))}
                </ScrollView>
            </View>
            
        </View>
    );
}