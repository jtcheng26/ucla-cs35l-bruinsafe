import {View, Text} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export default function numberReports({numReports}) {
    const styles = {
        bgStyle: "absolute top-32 px-5 py-2 rounded-full",
        textStyle: "font-bold"
    }
    if (numReports > 20) {
        styles.bgStyle += " bg-red-800/50";
        styles.textStyle += " text-red-600";
    } else if (numReports > 10) {
        styles.bgStyle += " bg-yellow-600/50";
        styles.textStyle += " text-amber-400";
    } else {
        styles.bgStyle += " bg-green-900/50";
        styles.textStyle += " text-green-400";
    }
    return (
        <TouchableScale className={styles.bgStyle} activeScale={1}>
            <Text className={styles.textStyle}>{numReports} {(numReports != 1) ? "reports nearby" : "report nearby"}</Text>
        </TouchableScale>
    );
}