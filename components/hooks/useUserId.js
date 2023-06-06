import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

//SESSION MANAGEMENT

export default function useUserId() {
    const [id, setId] = useState("")
    AsyncStorage.getItem("@id", (err, res) => {
        if (!err) setId(res)
    })
    return { id }
}
