import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants";
import useUserId from "./useUserId";

export default function useSockets() {
  const { id } = useUserId();
  const [socket, setSocket] = useState();
  const [walkerLoc, setWalkerLoc] = useState();
  const [roomId, setRoomId] = useState(null);
  const createRoom = useCallback(() => {
    socket.emit("start", id);
    socket.emit("start", 1);
    setRoomId(id)
  }, [socket, id]);
  const joinRoom = useCallback(
    (room_id) => {
      socket.emit("join", room_id);
      setRoomId(room_id)
    },
    [socket]
  );
  const endRoom = useCallback(
    (room_id) => {
      socket.emit("end", room_id);
      setRoomId(null)
    },
    [socket]
  );
  const shareLoc = useCallback(
    (loc) => {
        // if (roomId)
            socket.emit("update", id, loc);
    },
    [socket, roomId]
  );
  useEffect(() => {
    (async () => {
      const sock = await io.connect(BASE_URL);
      sock.on("connect", () => {
        setSocket(sock);
      });
      sock.on("disconnect", () => {
        setSocket(sock);
      });
      sock.on("loc", (val) => {
        console.log("Received location:", val);
        setWalkerLoc(val);
      });
    })();
  }, []);
  return {
    socket,
    connected: socket && socket.connected,
    roomId,
    createRoom,
    joinRoom,
    endRoom,
    walkerLoc,
    shareLoc,
  };
}
