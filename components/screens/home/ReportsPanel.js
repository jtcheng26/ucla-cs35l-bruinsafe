import { View, Text } from "react-native";



export default function ReportsPanel({
    type="Assault",
    desc="Pranav beat me",
    date="Jan. 1"

}) {

    return (
        <View
        className="h-full items-center w-48"
        >   
            <Text
            className="text-white text-sm font-semibold"
            >
                {date}
            </Text>

            <View
            className="rounded-xl bg-sky-700 h-5/6 w-11/12 px-1 items-center"
            >
                <Text
                className="my-2 text-md text-white font-semibold text"
                >
                    {type}
                </Text>
                <Text
                className="font-bold text-xs text-amber-300"
                >
                    {desc}
                </Text>
            </View>
        </View>
    )
}