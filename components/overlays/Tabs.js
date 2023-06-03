import * as React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/home/MapScreen';
import ReportScreen from '../screens/home/ReportScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SvgXml } from 'react-native-svg';
import CustomTabBarButton from './CustomTabBarButton';
import Location from '../../assets/location.svg';
import Home from '../../assets/home.svg';
import Megaphone from '../../assets/megaphone.svg';
import {useNavigation} from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const homeName = 'Home';
const mapName = 'Map';
const reportName = 'Report';



export default function NavContainer()
{
    const navigation = useNavigation();
    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                showLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    elevation: 0,
                  //  backgroundColor: '#fffff',
                    borderRadius: 25,
                    height: 90,
                    paddingTop: 7,
                    borderLeftWidth: 0.2,
                    borderRightWidth: 0.2,
                    overflow: 'hidden',
                    ...styles.shadow,
                },
                tabBarShowLabel: false,
          

            })}
        
        >
            

        <Tab.Screen name={homeName} component={HomeScreen} options={{
            tabBarButton: props => <CustomTabBarButton  {...props} route="Home"/>,


        }} />
        <Tab.Screen name={mapName} component={MapScreen} options={{
            tabBarButton: props => <CustomTabBarButton {...props} route="Map" />,


        }}
        />
        <Tab.Screen name={reportName} component={ReportScreen} options={{
            tabBarButton: props => <CustomTabBarButton {...props} route="Report"/>,


        }}/>
        
        </Tab.Navigator>
         



    )


}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000000dd0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})