import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function useUserId() {
  const [id, setId] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("@id", (err, res) => { //current User's id
      if (!err) setId(res);
    });
  }, []);

  return { id };
}
