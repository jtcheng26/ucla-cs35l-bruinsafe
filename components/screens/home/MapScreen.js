import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import tw from "tailwind-react-native-classnames";
import MapView from 'react-native-maps';
import Map from "../../overlays/Map";

import NavBar from '../../overlays/NavBar';

export default function MapScreen() {

    return (
        <View >
            <View> 
                <MapView>

                </MapView>
            </View>
        </View>
    );
}
