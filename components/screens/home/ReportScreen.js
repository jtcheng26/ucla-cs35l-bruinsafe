import {
  View,
  Text,
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import ProfileHeader from "../../overlays/ProfileHeader";
import TouchableScale from "react-native-touchable-scale";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "../../../constants";

export default function ReportScreen() {
  const styles = {
    inputField:
      "p-2 text-blue-100 rounded-xl w-12/12 m-2 bg-blue-950/80 justify-start",
    inputText: "text-blue-200 text-md align-left mt-6 mb-1 ml-3",
  };

  const [incidentDescription, setDescription] = useState(null);
  const [toSubmit, setToSubmit] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);
  const [ddopen, setDDOpen] = useState(false);
  const [incidentType, setIncidentType] = useState([
    { label: "Theft", value: "Theft" },
    { label: "Assault", value: "Assault" },
    { label: "Rape", value: "Rape" },
    { label: "Abuse", value: "Abuse" },
    { label: "Kidnapping", value: "Kidnapping" },
    { label: "Stalking", value: "Stalking" },
    { label: "Hate Crime", value: "Hate Crime" },
    { label: "Indecent Exposure", value: "Indecent Exposure" },
    { label: "Drug Distribution", value: "Drug Distribution" },
    { label: "Vandalism", value: "Vandalism" },
    { label: "Solicitation", value: "Solicitation" },
    { label: "Speeding", value: "Speeding" },
  ]);

  const [incidentValue, setIncidentValue] = useState([]);

  const enterPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter") Keyboard.dismiss();
  };

  const handleSubmit = () => {
    setSubmitPressed(true);
    if (incidentValue.length != 0 && incidentDescription) {
      const sendData = async () => {
        try {
          const lat_offset = 0.0055 - 0.012 * Math.random();
          const lon_offset = 0.0055 - 0.012 * Math.random();
          const data = {
            types: incidentValue,
            description: incidentDescription.replace("\n", ""),
            location: {
              latitude: 34.068925 + lat_offset,
              longitude: -118.446629 + lon_offset,
            },
          };
          const response = await axios.post(BASE_URL + "/report/create", data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      sendData();
      setToSubmit(true);
    }
  };

  const clear = () => {
    setSubmitPressed(false);
    setToSubmit(false);
    setIncidentValue([]);
    setDescription(null);
    setDDOpen(false);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-blue-900/90">
      {/* <ProfileHeader name={"David Smalberg"}/> */}
      <Text className="font-bold text-amber-400 text-center text-3xl">
        Report an Incident
      </Text>

      <View className="w-11/12 h-1/2 mt-6">
        <Text className={styles.inputText}>Incident Type:</Text>

        <DropDownPicker
          placeholder="Select at least one"
          mode="BADGE"
          showBadgeDot={false}
          //itemSeparator
          multiple
          min={0}
          max={3}
          items={incidentType}
          setItems={setIncidentType}
          value={incidentValue}
          setValue={setIncidentValue}
          open={ddopen}
          onPress={() => setDDOpen(!ddopen)}
          style={{
            backgroundColor: "#172554",
            width: "96%",
            marginLeft: "2%",
            marginVertical: "2%",
          }}
          textStyle={{
            color: "#ffffff",
          }}
          dropDownContainerStyle={{
            backgroundColor: "#172554",
            width: "96%",
            marginLeft: "2%",
          }}
          props={{
            activeOpacity: 0.8,
          }}
          listItemLabelStyle={{
            color: "#ffffff",
          }}
          selectedItemContainerStyle={{
            backgroundColor: "#f87171",
          }}
          selectedItemLabelStyle={{
            color: "#000",
          }}
          badgeTextStyle={{
            color: "#000",
          }}
          badgeColors="#f87171"
        />

        <Text className={styles.inputText}>Description:</Text>
        <TextInput
          enablesReturnKeyAutomatically
          returnKeyType="done"
          className={styles.inputField + " h-1/2 pt-3"}
          textAlignVertical="bottom"
          placeholderTextColor="#ffffff"
          maxLength={100}
          onChangeText={setDescription}
          onKeyPress={enterPress}
          multiline={true}
          placeholder="100 character maximum"
          value={
            incidentDescription ? incidentDescription.replace("\n", "") : null
          }
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
        <View className="rounded-xl bg-blue-900/90 w-10/12 h-44 items-center">
          <Text className="font-bold text-white text-2xl mt-4">
            Report Submitted!
          </Text>

          <Text className="text-white text-md mt-2 text-center mx-3">
            Our servers are processing your query
          </Text>
          <TouchableScale
            className=" bg-violet-300/80 rounded-md py-2 px-4 mt-3 items-center absolute bottom-4"
            onPress={() => clear()}
          >
            <Text className="text-black font-bold">Return</Text>
          </TouchableScale>
        </View>
      </Modal>

      <TouchableScale
        className={
          "rounded-lg mt-16 h-10 w-40 justify-center items-center " +
          (incidentValue.length == 0 || !incidentDescription
            ? "bg-zinc-300/70"
            : "bg-red-400/80")
        }
        activeScale={
          incidentValue.length == 0 || !incidentDescription ? 1 : 0.95
        }
        onPress={handleSubmit}
      >
        <Text className="text-black font-semibold">Submit Incident</Text>
      </TouchableScale>
    </SafeAreaView>
  );
}
