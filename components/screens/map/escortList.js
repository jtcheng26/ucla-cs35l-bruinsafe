import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

export default function escortList() {
    const [data, setData] = useState({});
    useEffect(() => {
        const fetchData = () => {
            // get list of users
        };
        fetchData();
    }, []);

    return (
        <View className="absolute content-center">
            <Text>fasfd</Text>
        </View>
    );
}