import { View, Text } from "react-native";



export default function PreviousWalksPanel({
    date="Jan. 1",
    name="Carey Nachenberg",
    time=10

}) {

    return (
        <View
        className="h-full items-center"
        >   
            <Text
            className="text-white text-sm font-semibold"
            >
                {date}
            </Text>

            <View
            className="rounded-xl bg-sky-700 h-5/6 px-2"
            >
                <View
                className="flex-row mt-2"
                >
                    <Text
                    className="font-bold text-xs text-amber-300"
                    >
                        {time + "min"}
                    </Text>
                    <Text
                    className="ml-1 text-xs text-sky-300"
                    >
                        Virtual Walk with 
                    </Text>
                </View>

                <Text
                className="mb-1 text-md text-white font-semibold text"
                >
                    {name}
                </Text>
            </View>
        </View>
    )
}