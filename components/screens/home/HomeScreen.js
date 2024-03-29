import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  RefreshControl,
  FlatList,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import MapView from "react-native-maps";
import ProfileHeader from "../../overlays/ProfileHeader";
import axios from "axios";
import { BASE_URL } from "../../../constants";
import WalkingRequestPanel from "./WalkingRequestPanel";
import { useState, useEffect, useMemo, useCallback } from "react";
import ReportsPanel from "./ReportsPanel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserId from "../../hooks/useUserId";
import MapScreen from "../map/MapScreen";

export default function HomeScreen({ updateScreen }) {
  const [walks, setWalks] = useState([]);
  const [fullWalks, setFullWalks] = useState([]);
  const [reports, setReports] = useState([]);
  const { id } = useUserId();
  const [walkAccepted, setWalkAccepted] = useState(false);
  const [refreshWalks, setRefreshWalks] = useState(false);
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
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const onRefreshWalks = useCallback(() => {
    setRefreshWalks(true);
    const fetchNearbyUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + "/walk/get");
        if (id) {
          setWalks(
            response.data
              .filter((u) => u.user._id !== id)
              .filter((u) => u.state === 0)
          );
          setFullWalks(
            response.data
              .filter((u) => u.user._id !== id)
              .filter((u) => u.state === 0)
          );
          setRefreshWalks(false);
        }
        const cur_loc = {
          latitude: 34.068925,
          longitude: -118.446629,
        };
        const response1 = await axios.post(
          BASE_URL + "/report/search",
          cur_loc
        );
        setReports(response1.data.reverse());
      } catch (e) {
        console.error(e);
      }
    };
    fetchNearbyUsers();
  }, [refreshWalks, id]);

  //ran once when component is first rendered
  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + "/walk/get");
        if (id) {
          setWalks(
            response.data
              .filter((u) => u.user._id !== id)
              .filter((u) => u.state === 0)
          );
          setFullWalks(
            response.data
              .filter((u) => u.user._id !== id)
              .filter((u) => u.state === 0)
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNearbyUsers();
  }, [id]);

  useEffect(() => {
    const fetchNearbyReports = async () => {
      try {
        const cur_loc = {
          latitude: 34.068925,
          longitude: -118.446629,
        };
        const response = await axios.post(BASE_URL + "/report/search", cur_loc); //All reports not nearby (possibly unintentional)
        setReports(response.data.reverse());
      } catch (e) {
        console.error(e);
      }
    };
    fetchNearbyReports();
  }, []);

  const handleAccept = (walk_id) => {
    const connectWalk = async () => {
      try {
        const data = {
          user: id,
          id: walk_id,
        };

        const response = await axios.post(BASE_URL + "/walk/accept", data);
        console.log(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    connectWalk();
    if (id) {
      setWalkAccepted(true);
      let newArr = walks
        .filter((u) => u.state === 0)
        .filter((u) => u.user._id === id);
      setWalks(newArr);
      newArr = fullWalks
        .filter((u) => u.state === 0)
        .filter((u) => u.user._id === id);
      setFullWalks(newArr);
    }
  };

  const search = (query) => {
    if (query == "" || query == null) setWalks(fullWalks);
    let newArr = [];
    for (let i = 0; i < fullWalks.length; i++) {
      if (fullWalks[i].user.name.toLowerCase().includes(query.toLowerCase()))
        newArr.push(fullWalks[i]);
    }
    setWalks(newArr);
  };

  useEffect(() => {
    if (walkAccepted) updateScreen("map");
  }, [walkAccepted]);

  return (
    <View className="w-full h-full bg-blue-900/90 justify-center">
      <View className="h-3/4">
        <ScrollView
          className=""
          refreshControl={
            <RefreshControl
              onRefresh={onRefreshWalks}
              refreshing={refreshWalks}
            />
          }
        >
          <Text className="text-2xl font-semibold text-amber-400 ml-8 mt-4">
            Walk Requests
          </Text>
          <View className="w-full items-center justify-center mb-8">
            <TextInput
              className="w-11/12 h-10 my-4 bg-gray-300 rounded-xl p-1 px-4"
              placeholder="Search for a Walk by Name"
              onChangeText={(query) => search(query)}
            />
            <View className="w-11/12">
              {walks.length > 0 ? (
                walks.map(
                  (
                    walk //All nondeclined walks
                  ) => (
                    <WalkingRequestPanel
                      key={walk._id}
                      user={walk.user}
                      walk_id={walk._id}
                      onAccept={handleAccept}
                      walk_obj={walk}
                    />
                  )
                )
              ) : (
                <Text className="text-blue-400 font-semibold top-full ml-4">
                  No Current Walking Requests
                </Text>
              )}
            </View>
          </View>
          <Text className="text-2xl font-semibold text-blue-200 mt-4 mb-4 ml-8">
            Nearby Incidents
          </Text>
          <View className="items-center">
            <View className="w-11/12 flex-row">
              <View className="w-1/2">
                {reports.length > 0 ? (
                  reports
                    .filter((_, i) => i % 2)
                    .map(
                      (
                        report //All reports
                      ) => (
                        <ReportsPanel
                          key={report._id}
                          type={report.types.join(", ")}
                          desc={report.description}
                          date={
                            month[report.timestamp.slice(5, 7)] +
                            " " +
                            report.timestamp.slice(8, 10)
                          }
                        />
                      )
                    )
                ) : (
                  <Text className="text-blue-400 font-semibold mt-4">
                    No Current Incidents Reported
                  </Text>
                )}
              </View>
              <View className="w-1/2">
                {reports.length > 0 ? (
                  reports
                    .filter((_, i) => i % 2 === 0)
                    .map(
                      (
                        report //All reports
                      ) => (
                        <ReportsPanel
                          key={report._id}
                          type={report.types.join(", ")}
                          desc={report.description}
                          date={
                            month[report.timestamp.slice(5, 7)] +
                            " " +
                            report.timestamp.slice(8, 10)
                          }
                        />
                      )
                    )
                ) : (
                  <Text className="text-sky-200 font-semibold">
                    No Current Incidents Reported
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
