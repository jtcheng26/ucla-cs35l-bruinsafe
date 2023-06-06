import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function useUserId() {
    const [id, setId] = useState("")
    (async () => {
        AsyncStorage.getItem("@id", (err, res) => {
            if (!err) setId(res)
        })
    })()
    return { id }
}
