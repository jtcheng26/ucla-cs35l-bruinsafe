import { View, Text, TextInput, Keyboard, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import NavBar from "../../overlays/NavBar";
import Camera from "../../../assets/camera.svg"
import ProfileHeader from "../../overlays/ProfileHeader";
import TouchableScale from "react-native-touchable-scale";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";




export default function ReportScreen() {
    const styles = {
        inputField: "p-2 rounded-xl w-12/12 m-2 bg-sky-200 justify-start",
        inputText: "text-white text-md align-left mt-4 mb-1 ml-3"
    }

    const [incidentType, setIncidentType] = useState(null);
    const [description, setDescription] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [toSubmit, setToSubmit] = useState(false);
    const [submitPressed, setSubmitPressed] = useState(false);

    const enterPress = ({ nativeEvent }) => {
        if(nativeEvent.key === 'Enter') Keyboard.dismiss();
    }

    const setDate1 = (newDate) => {
        const curDate = newDate;
        setDate(curDate);
      };

    const setTime1 = (newTime) => {
        const curTime = newTime;
        setTime(curTime);
    }

    const handleSubmit = () => {
        setSubmitPressed(true);
        //send data to back end
        if( incidentType && description ) {
            setToSubmit(true);
        }
    }

    const clear = () => {
        setSubmitPressed(false);
        setToSubmit(false);
        setIncidentType(null);
        setDescription(null);
        setDate(new Date());
        setTime(new Date());
    }

    return (
        <View
        className="flex-1 justify-center items-center bg-sky-950"
        >
            <ProfileHeader name={"Anonymous"}/>
            <Text
            className="font-bold text-white text-center text-2xl mt-12"
            >
                Report an Incident
            </Text>

            <View
            className="w-11/12 h-1/2 rounded-lg mt-2"
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
                value={incidentType}
                />

                <Text
                className={styles.inputText + " mb-3"}
                >
                    Time of Incident:
                </Text>
                <View
                className="flex-row justify-center"
                >
                    <RNDateTimePicker 
                    mode="date" 
                    value={date}
                    themeVariant="dark"
                    onChange={() => setDate1}
                    accentColor="#80ACBF"
                    maximumDate={new Date()}
                    />

                    <View 
                    className="w-6"
                    />

                    <RNDateTimePicker 
                    mode="time"
                    value={time} 
                    themeVariant="dark"
                    onChange={() => setTime1}
                    accentColor="#80ACBF"
                    //maximumDate={new Date()}
                    />
                </View>

                <Text
                className={styles.inputText}
                >
                    Description:
                </Text>
                <TextInput
                className={styles.inputField + " h-2/5 pt-3"}
                textAlignVertical="bottom"
                placeholderTextColor="#0369a1"
                onChangeText={setDescription}
                onKeyPress={enterPress}
                multiline={true}
                placeholder="Ex: 5'7 man wearing a blue hoodie..."
                value={description}
                />  

            </View>


            <Modal
            isVisible={toSubmit}
            onBackdropPress={() => clear()}
            onDismiss={() => clear()}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            hideModalContentWhileAnimating={true}
            backdropOpacity={0.8}
            animationInTiming={500}
            animationOutTiming={500}
            propagateSwipe={true}
            className="justify-center items-center"
            >
                <View
                className="rounded-xl bg-sky-500 w-10/12 h-1/5 items-center"
                >
                    <Text
                    className="font-bold text-white text-2xl mt-4"
                    >
                        Report Submitted!
                    </Text>

                    <Text
                    className="text-white text-md mt-2 text-center mx-3"
                    >
                        Our servers are processing your query
                    </Text>

                    <TouchableScale
                    className=" bg-amber-400 rounded-md p-2 mt-3 items-center"
                    onPress={() => clear()}
                    >
                        <Text
                        className="text-black"
                        >
                            Return
                        </Text>
                    </TouchableScale>
                </View>
            </Modal>


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
            className="rounded-lg mt-5 h-8 w-40 justify-center items-center bg-red-500"
            activeScale={0.95}
            onPress={handleSubmit}
            >
                <Text
                className="text-white font-bold"
                >
                Submit Incident
                </Text>
            </TouchableScale>
            {
                (submitPressed && (!incidentType || !description))
                ? (
                    <Text
                    className="text-sm text-red-500 mt-2"
                    >
                        Error: all fields must be filled out
                    </Text>
                )
                : (<></>)
            }
            <NavBar />
        </View>
    );
}