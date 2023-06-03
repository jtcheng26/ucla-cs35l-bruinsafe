import { View, Text, TextInput, Keyboard, Image, TouchableOpacity, SafeAreaView, Linking } from "react-native";
import { useState, useRef, useEffect } from "react";
import ProfileHeader from "../../overlays/ProfileHeader";
import TouchableScale from "react-native-touchable-scale";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios"




export default function ReportScreen() {
    const styles = {
        inputField: "p-2 rounded-xl w-12/12 m-2 bg-sky-200 justify-start",
        inputText: "text-white text-md align-left mt-6 mb-1 ml-3"
    }

    const [incidentDescription, setDescription] = useState(null);
    const [toSubmit, setToSubmit] = useState(false);
    const [submitPressed, setSubmitPressed] = useState(false);
    const [ddopen, setDDOpen] = useState(false);

    const [incidentType, setIncidentType] = useState([
        {label: 'Theft', value: 'theft'},
        {label: 'Assault', value: 'assault'},
        {label: 'Rape', value: 'rape'},
        {label: 'Abuse', value: 'abuse'},
        {label: 'Kidnapping', value: 'kidnapping'},
        {label: 'Stalking', value: 'stalking'},
        {label: 'Hate Crime', value: 'hate crime'},
        {label: 'Indecent Exposure', value: 'indecent exposure'},
        {label: 'Drug Distribution', value: 'drug distribution'},
        {label: 'Vandalism', value: 'vandalism'},
        {label: 'Solicitation', value: 'solicitation'},
    ]);

    const [incidentValue, setIncidentValue] = useState([]);

    const enterPress = ({ nativeEvent }) => {
        if(nativeEvent.key === 'Enter') Keyboard.dismiss();
    }

    const handleSubmit = () => {
        setSubmitPressed(true);
        if( incidentValue.length != 0 && incidentDescription ) {
            // axios.post('/report/create', {
            //     type: incidentValue,
            //     description: incidentDescription,
            // })
            // .catch(error => {
            //     console.log("Error: ", error)
            // });
            // useEffect(() => {
            // setDescription(incidentDescription.trim());
            const sendData = async () => {
                try {
                    const data = {
                        type: incidentValue[0],
                        description: incidentDescription.replace('\n', ''),
                        location: {
                            latitude: 169,
                            longitude: 198
                        }
                    };
                    const response = await axios.post('http://169.232.214.177:8080/report/create', data);
                    console.log(response.data);
                } catch(error) {
                    console.error(error);
                }
            };
            sendData();
            // }, []);
            setToSubmit(true);
        }
    }


    const clear = () => {
        setSubmitPressed(false);
        setToSubmit(false);
        setIncidentValue([]);
        setDescription(null);
        setDDOpen(false);
    }

    return (
        <SafeAreaView
        className="flex-1 justify-center items-center bg-sky-950"
        >
            <ProfileHeader name={"David Smalberg"}/>
            <Text
            className="font-bold text-white text-center text-3xl"
            >
                Report an Incident
            </Text>

            <View
            className="w-11/12 h-1/2 mt-6"
            >
                <Text
                className={styles.inputText}
                >
                    Incident Type:
                </Text>
                {/* <TextInput
                className={styles.inputField + " h-10"}
                placeholderTextColor="#0369a1"
                placeholder="Ex: Attempted Robbery..."
                onChangeText={setIncidentType}
                value={incidentType}
                /> */}

                <DropDownPicker
                placeholder="Select at least one"
                mode="BADGE"
                showBadgeDot={false}
                //itemSeparator
                multiple
                min={0}
                items={incidentType}
                setItems={setIncidentType}
                value={incidentValue}
                setValue={setIncidentValue}
                open={ddopen}
                onPress={() => setDDOpen(!ddopen)}
                style={{
                    backgroundColor: "rgb(186 230 253)",
                    width: '96%',
                    marginLeft: '2%',
                    marginVertical: '2%'
                  }}
                textStyle={{
                    color: "#0369a1"
                  }}
                dropDownContainerStyle={{
                    backgroundColor: "rgb(186 230 253)",
                    width: '96%',
                    marginLeft: '2%'
                }}
                props={{
                    activeOpacity: 0.8
                }}
                listItemLabelStyle={{
                    color: "#0369a1"
                }}
                selectedItemContainerStyle={{
                    backgroundColor: "rgb(166 210 250)"
                }}
                badgeTextStyle={{
                    color: "#075985"
                }}
                badgeColors="rgb(166 210 250)"
                />

                <Text
                className={styles.inputText}
                >
                    Description:
                </Text>
                <TextInput
                enablesReturnKeyAutomatically
                returnKeyType="done"
                className={styles.inputField + " h-1/2 pt-3"}
                textAlignVertical="bottom"
                placeholderTextColor="#0369a1"
                onChangeText={setDescription}
                onKeyPress={enterPress}
                multiline={true}
                placeholder="Ex: 5'7 man wearing a blue hoodie..."
                value={(incidentDescription) ? incidentDescription.replace('\n', '') : null}
                />  

            </View>


            <Modal
            isVisible={toSubmit}
            onBackdropPress={() => clear()}
            onDismiss={() => clear()}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            hideModalContentWhileAnimating={true}
            backdropOpacity={0.9}
            animationInTiming={500}
            animationOutTiming={500}
            propagateSwipe={true}
            className="justify-center items-center"
            >
                <View
                className="rounded-xl bg-sky-900 w-10/12 h-44 items-center"
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

                    {/* <View> */}
                    <TouchableScale
                    className=" bg-amber-400 rounded-md p-2 mt-3 items-center absolute bottom-4"
                    onPress={() => clear()}
                    >
                        <Text
                        className="text-black"
                        >
                            Return
                        </Text>
                    </TouchableScale>
                    {/* </View> */}
                </View>
            </Modal>


            <TouchableScale
            className="rounded-lg mt-20 h-8 w-40 justify-center items-center bg-red-500"
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
                (submitPressed && (incidentValue.length == 0 || !incidentDescription))
                ? (
                    <Text
                    className="text-sm text-red-500 mt-3"
                    >
                        Error: ALL fields must be filled out
                    </Text>
                )
                : (<></>)
            }
        </SafeAreaView>
    );
}