import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';

export default function escortList() {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchData = async() => {

        };
        fetchData();
    }, []);

    return (
        <View className="absolute content-center">
            <Text>fasfd</Text>
        </View>
    );
}