import { View, Text } from "react-native";

export default function ReportsPanel({ type, desc, date }) {
  return (
    <View className="rounded-xl bg-blue-950 w-11/12 p-3 my-2 mx-2">
      <Text className="text-amber-400 text-xs font-semibold mb-1">{date}</Text>
      <Text className="text-red-400/80 font-semibold mb-1">{type}</Text>
      <Text className="text-xs text-blue-200/80">{desc}</Text>
    </View>
  );
}
