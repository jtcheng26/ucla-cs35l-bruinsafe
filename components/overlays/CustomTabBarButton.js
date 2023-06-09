import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import TouchableScale from "react-native-touchable-scale";
import Svg, { Path, SvgXml, SvgUri, Circle } from "react-native-svg";
import Location from "../../assets/location.svg";
import Home from "../../assets/home.svg";
import Megaphone from "../../assets/megaphone.svg";

export default function CustomTabBarButton(props) {
  const { route, children, active, onPress } = props;
  const [buttonToggle, setButtonToggle] = useState([0, 1, 0]);

  const smallCircle = (
    <Svg height="20" width="20">
      {" "}
      <Circle cx="10" cy="10" r="4" fill="#FBBF24" />{" "}
    </Svg>
  );

  function buttonClick(i) {
    if (i == 0) {
      setButtonToggle([1, 0, 0]);
    } else if (i == 1) {
      setButtonToggle([0, 1, 0]);
    } else if (i == 2) {
      setButtonToggle([0, 0, 1]);
    } else {
      setButtonToggle([0, 0, 0]);
    }
  }

  if (route == "Home") {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableScale
          style={styles.active}
          activeScale={0.95}
          onPress={onPress}
        >
          <View className="flex justify-center items-center">
            <Home
              width="60"
              height="60"
              elevation="20"
              fill={true ? "#80ACBF" : "#FBBF24"}
            />
            {buttonToggle[0] == 1 ? (
              <Svg height="20" width="20">
                <Circle cx="10" cy="10" r="4" fill="#FBBF24" />
              </Svg>
            ) : null}
          </View>
        </TouchableScale>
      </View>
    );
  } else if (route == "Map") {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableScale
          style={styles.active}
          activeScale={0.95}
          onPress={onPress}
        >
          <View className="flex justify-center items-center">
            <Location
              width="60"
              height="60"
              elevation="20"
              fill={true ? "#80ACBF" : "#FBBF24"}
            />
            {buttonToggle[0] == 1 ? (
              <Svg height="20" width="20">
                <Circle cx="10" cy="10" r="4" fill="#FBBF24" />
              </Svg>
            ) : null}
          </View>
        </TouchableScale>
      </View>
    );
  } else if (route == "Report") {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableScale
          style={styles.active}
          activeScale={0.95}
          onPress={onPress}
        >
          <View className="flex justify-center items-center">
            <Megaphone
              width="60"
              height="60"
              elevation="20"
              fill={true ? "#80ACBF" : "#FBBF24"}
            />
            {buttonToggle[0] == 1 ? (
              <Svg height="20" width="20">
                <Circle cx="10" cy="10" r="4" fill="#FBBF24" />
              </Svg>
            ) : null}
          </View>
        </TouchableScale>
      </View>
    );
  } else if (route == "Home") {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableScale
          style={styles.active}
          activeScale={0.95}
          onPress={onPress}
        >
          <View className="flex justify-center items-center">
            <Home
              width="60"
              height="60"
              elevation="20"
              fill={true ? "#80ACBF" : "#FBBF24"}
            />
            {buttonToggle[0] == 1 ? (
              <Svg height="20" width="20">
                <Circle cx="10" cy="10" r="4" fill="#FBBF24" />
              </Svg>
            ) : null}
          </View>
        </TouchableScale>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inactive: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  active: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
    top: 12,
  },
});
