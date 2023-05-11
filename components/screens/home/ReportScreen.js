import { View, Text, TextInput, Keyboard, Image } from "react-native";
import { useState } from "react";
import NavBar from "../../overlays/NavBar";
import Camera from "../../../assets/camera.svg"
import ProfileHeader from "../../overlays/ProfileHeader";
import TouchableScale from "react-native-touchable-scale";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";



export default function ReportScreen() {
    const styles = {
        inputField: "p-2 rounded-xl w-12/12 m-2 bg-sky-200 justify-start",
        inputText: "text-white text-md align-left mt-6 mb-1 ml-3"
    }

    const [incidentType, setIncidentType] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const enterPress = ({ nativeEvent }) => {
        if(nativeEvent.key === 'Enter') Keyboard.dismiss();
    }

    return (
        <View 
        className="flex-1 justify-center items-center bg-sky-950"
        >
            <ProfileHeader name={"Bach Ngo"}/>
            <Text
            className="font-bold text-white text-center text-2xl"
            >
                Report an Incident
            </Text>

            <View
            className="w-11/12 mt-2 h-1/2 rounded-lg"
            >
                <Text
                className={styles.inputText}
                >
                    Incident Type:
                </Text>
                <TextInput
                className={styles.inputField + " h-10"}
                placeholderTextColor="#0369a1"
                placeholder="Ex: Attempted Robbery..."
                onChangeText={setIncidentType}
                />

                <Text
                className={styles.inputText}
                >
                    Date:
                </Text>
                <View
                className="flex-row justify-center"
                >
                    <RNDateTimePicker 
                    mode="date" 
                    value={new Date()}
                    themeVariant="dark"
                    onChange={setDate}
                    />

                    <View 
                    className="w-6"
                    />

                    <RNDateTimePicker 
                    mode="time" 
                    value={new Date()} 
                    themeVariant="dark"
                    onChange={setTime}
                    />
                </View>

                <Text
                className={styles.inputText}
                >
                    Description:
                </Text>
                <TextInput
                className={styles.inputField + " h-2/5 p-3"}
                textAlignVertical="bottom"
                placeholderTextColor="#0369a1"
                onChangeText={setDescription}
                onKeyPress={enterPress}
                multiline={true}
                placeholder="Ex: 5'7 man wearing a blue hoodie..."
                />  

            </View>

            <TouchableScale
            className="mt-10"
            >
                <Camera
                fill="#80ACBF"
                width={60}
                height={60}
                />
            </TouchableScale>

            <TouchableScale
            className="rounded-lg my-5 h-8 w-40 justify-center items-center bg-red-500"
            activeScale={0.95}
            >
                <Text
                className="text-white"
                >
                Submit Incident
                </Text>
            </TouchableScale>

            <NavBar />
        </View>
    );
}