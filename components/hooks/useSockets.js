import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants";
import useUserId from "./useUserId";

//session management -> joining a walk
export default function useSockets() {
  const { id } = useUserId();
  const [socket, setSocket] = useState();
  const [walkerLoc, setWalkerLoc] = useState();
  const [roomId, setRoomId] = useState(null);
  const [isEnded, setEnd] = useState(false);
  const createRoom = useCallback(() => {
    socket.emit("start", id);
    setRoomId(id);
    setEnd(false);
  }, [socket, id]);
  const joinRoom = useCallback(
    (room_id) => {
      socket.emit("join", room_id); //join event, room is initalized
      setRoomId(room_id);
    },
    [socket]
  );
  const endRoom = useCallback(
    (room_id) => {
      setEnd(false);
      setRoomId(null);
      socket.emit("end", room_id); //end event, session is null
    },
    [socket]
  );
  const shareLoc = useCallback(
    (loc, room_id = id) => {
      socket.emit("update", room_id, loc);
    },
    [socket, roomId]
  );
  useEffect(() => {
    (async () => {
      const sock = await io.connect(BASE_URL);
      sock.on("connect", () => {
        setSocket(sock);
      });
      sock.on("end", () => {
        console.log(roomId, "Received end signal");
        setEnd(true);
      });
      sock.on("join", () => {
        setEnd(false);
      });
      sock.on("disconnect", () => {
        setSocket(sock);
      });
      sock.on("loc", (val) => {
        setWalkerLoc(val);
      });
    })();
  }, []);
  return {
    socket,
    connected: socket && socket.connected,
    isEnded,
    roomId,
    createRoom,
    joinRoom,
    endRoom,
    walkerLoc,
    shareLoc,
    setEnd,
  };
}
