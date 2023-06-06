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
            className="text-white text-sm mb-1 font-semibold"
            >
                {date}
            </Text>

            <View
            className="rounded-xl bg-sky-700 h-5/6 w-11/12 p-1 items-center"
            >
                <Text
                className="my-1 text-md text-sky-200 font-semibold text"
                >
                    {type}
                </Text>
                <Text
                className="font-bold mx-1 text-xs text-amber-400"
                >
                    {desc}
                </Text>
            </View>
        </View>
    )
}