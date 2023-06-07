import { View, Text, Button } from "react-native";
import useSockets from "../hooks/useSockets";
import React, { useEffect } from "react";
import useUserId from "../hooks/useUserId";

export default function SocketTester() {
  const room = 1;
  const { id } = useUserId();
  const {
    socket,
    connected,
    createRoom,
    joinRoom,
    endRoom,
    shareLoc,
    walkerLoc,
    roomId,
  } = useSockets();
  useEffect(() => {
    if (connected && roomId) {
      const stream = setInterval(() => {
        if (!roomId) clearInterval(stream);
        shareLoc({
          latitude: Math.random() * 180,
          longitude: Math.random() * 180,
        });
      }, 500);
      return () => clearInterval(stream);
    }
  }, [connected, roomId]);
  return (
    <View className="w-full h-full flex justify-center items-center">
      {connected ? (
        <>
          <Text>Connected</Text>
          {walkerLoc && (
            <Text>
              Current Location: {walkerLoc.latitude}, {walkerLoc.longitude}
            </Text>
          )}
          <Button onPress={createRoom} title="Join room id" />
          <Button onPress={() => joinRoom(room)} title="Join room 1" />
          {roomId && (
            <Button
              onPress={() => endRoom("647d6f1e7516cf9c2dd9e6a2")}
              title="End room id"
            />
          )}
          <Button onPress={() => endRoom(room)} title="End room 1" />
          <Button
            onPress={() =>
              shareLoc({
                latitude: Math.random() * 180,
                longitude: Math.random() * 180,
              })
            }
            title="Share Location"
          />
        </>
      ) : (
        <Text>Not Connected</Text>
      )}
    </View>
  );
}
