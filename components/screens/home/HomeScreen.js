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
    const [users, setUsers] = useState([])
    const [newUsers, setNewUsers] = useState([]);
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
    //ran once when component is first rendered
    useEffect(() => {
        const fetchNearbyUsers = async() => {
            try {
                const response = await axios.get(BASE_URL + "/walk/get"); //list of all users - TOFIX: currently all walks someone change to /users/nearby assuming its like this for testing purposes
                setUsers(response.data);
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
                const response = await axios.post(BASE_URL + "/report/search", cur_loc); //All reports not nearby (possibly unintentional)
                setReports((response.data).reverse())
            } catch(e) {
                console.error(e);
            }
        }
        fetchNearbyReports();
    }, [])
    //callback function for declining a walk request 
    const handleDecline = (id) => {
        let newArr = newUsers.filter(u => u._id !== id) //If a user's walk request is declined, do not display their walk request anymore
        setUsers(newArr)
    }

    /*Likely Need handleAccept callback to accept a walk. Use the following if you want as a base to work off of.
        const handleAccept = async(walkID) => {
        try {
            const userID = await AsyncStorage.getItem('@id'); //Receives current user's ID
            const data = { //data for api endpoint
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
    */

    //ran for every modification to users state
    useEffect(() => {
        if (!users) return [];

        (async () => {
            const cur_user_id = await AsyncStorage.getItem("@id");
            let newArr = users.filter(u => u.user !== cur_user_id); //all nondeclined users except curr user
            const fetched = await Promise.all(newArr.map(u => axios.get(BASE_URL + "/user/" + u.user))); //fetching all nondeclined user data in parallel
            setNewUsers(fetched.map(f => //setNewUsers to be array of all nondeclined users json
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
                    {newUsers.map(user => ( //All nondeclined walks
                        <WalkingRequestPanel 
                        key={Math.random()}
                        user={user}
                        onDecline={handleDecline} //Likely want a onAccept callback to be passed in as well
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
                    {reports.map((report) => ( //All reports
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