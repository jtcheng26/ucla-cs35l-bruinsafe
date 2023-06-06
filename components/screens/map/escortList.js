import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

export default function escortList() {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchData = async() => {
            // get list of users
            try{
                const response = await axios.get(BASE_URL + "/users/nearby");
                setUsers(response.data);
            }
            catch (error)
            {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <View className="absolute content-center">
            <Text
            className="text-2xl font-semibold text-amber-400 mt-28 mb-2 ml-8"
            >
                Escorts
            </Text>
            <View
            className="w-full h-2/5 items-center justify-center"
            >
                <ScrollView
                className="w-10/12"
                >
                </ScrollView>
        </View>
        </View>
    );
}