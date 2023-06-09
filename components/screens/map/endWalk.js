import { View, Text } from "react-native";
import TouchableScale from "react-native-touchable-scale";

export default function endWalk({ endWalkFunction }) {
  const handleClick = () => {
    console.log("Ended the Walk!");
    endWalkFunction();
  };
  return (
    <TouchableScale
      className="absolute w-3/12 h-1/12 bottom-72 right-6 py-4 rounded-lg bg-blue-500 border-2 border-blue-900"
      activeScale={0.97}
      onPress={handleClick}
    >
      <Text className="items-center text-center font-bold text-white">
        End Path
      </Text>
    </TouchableScale>
  );
}
