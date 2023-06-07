import { View, Text } from "react-native";



export default function ReportsPanel({
    type,
    desc,
    date

}) {

    return (
        <View
        className="h-full items-center w-48"
        >   
            <Text
            className="text-amber-400 text-sm font-semibold mb-1"
            >
                {date}
            </Text>

            <View
            className="rounded-xl bg-blue-950 h-5/6 w-11/12 p-1 items-center"
            >
                <Text
                className="my-1 text-md text-blue-300 font-semibold text"
                >
                    {type}
                </Text>
                <Text
                className="font-bold mx-1 text-xs text-white"
                >
                    {desc}
                </Text>
            </View>
        </View>
    )
}