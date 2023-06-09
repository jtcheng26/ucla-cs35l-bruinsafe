import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import TouchableScale from "react-native-touchable-scale";
import Svg, { Path, SvgXml, SvgUri, Circle } from "react-native-svg";
import Location from "../../../assets/location.svg";
import { Marker } from "react-native-maps";
import axios from "axios";
import { BASE_URL } from "../../../constants";
import useUserId from "../../hooks/useUserId";

export default function walkButton({
  onPress,
  text,
  setMarker,
  setMarkerStyle,
  region,
  markerList,
  setMarkerList,
  regionCoords,
  walkPath,
  setWalkPath,
  curLocation,
  setWaiting,
}) {
  const [buttonText, setButtonText] = useState(text);
  const { id } = useUserId();
  // useEffect(() => {
  //     if (id)
  //         console.log(id)
  // }, [id])
  const handleClick = async () => {
    if (buttonText === "walk with someone") {
      //console.log(regionCoords);
      setButtonText("set end");
      setMarker(true);
      setMarkerStyle({
        width: 60,
        height: 60,
        fill: "#FBBF24",
      });
      // setMarkerList([]);
    } else if (buttonText === "set start") {
      setButtonText("set end");
      setMarkerStyle({
        width: 60,
        height: 60,
        fill: "#BA132C",
      });
      let copyMarkerList = markerList.slice();
      let copyPath = { ...walkPath };
      copyPath.start = regionCoords;
      setWalkPath(copyPath);
      setWaiting(true);
      // copyMarkerList.push(<Marker coordinate={regionCoords} pinColor="#FBBF24"/>);
      // setMarkerList(copyMarkerList);
    } else if (buttonText === "set end") {
      setButtonText("finding match...");
      setMarker(false);
      setMarkerStyle({
        width: 60,
        height: 60,
        fill: "#FBBF24",
      });
      let copyMarkerList = markerList.slice();
      let copyPath = { ...walkPath };
      copyPath.start = curLocation;
      copyPath.end = regionCoords;
      setWalkPath(copyPath);
      setMarkerList([
        { origin: copyPath.start, destination: copyPath.end, user: id },
      ]);
      //const pushCoords = await axios.post(BASE_URL + "/walk/request", {origin: copyPath.start, destination: copyPath.end, user: id });
      //console.log(pushCoords.data)
      // setMarkerList([{...copyPath, user: id}]);
      setWaiting(true);
      onPress(2);
      // console.log(pushCoords)
      // copyMarkerList.push(<Marker coordinate={regionCoords} pinColor="#BA132C"/>);
      // setMarkerList(copyMarkerList);
      // const pushCoords = await axios.post(BASE_URL + "");
    }
  };
  return (
    <TouchableScale
      className="absolute bottom-24 mb-5 bg-blue-500/90 w-5/6 py-5 rounded-full items-center justify-center"
      activeScale={0.97}
      onPress={handleClick}
    >
      <Text className="font-bold text-zinc-200 text-xl">{buttonText}</Text>
    </TouchableScale>
  );
}
