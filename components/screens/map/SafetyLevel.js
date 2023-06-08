import {View, Text} from 'react-native';

export default function SafetyLevel({numReports}) {
    let styles = {
        textStyle: "",
        text: ""
    }
    if (numReports > 20) {
        styles.textStyle += "text-red-600 font-bold text-lg";
        styles.text = "Dangerous"
    } else if (numReports > 10) {
        styles.textStyle += "text-amber-400 font-bold text-lg";
        styles.text = "Moderate"
    } else {
        styles.textStyle += "text-green-400 font-bold text-lg";
        styles.text = "Safe"
    }
    return (
        <View className="absolute top-12 w-11/12 items-end">
            <View className="flex align-center items-end">
                <Text className="text-sky-400/70 mt-3 -mb-0.5">Safety Level</Text>
                <Text className={styles.textStyle}>{styles.text}</Text>
            </View>
        </View>
    );
}