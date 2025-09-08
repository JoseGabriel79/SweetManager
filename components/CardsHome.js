import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions, 
    Alert
} from "react-native";

const { width } = Dimensions.get("window")
const isSmallScreen = width < 520;

export default function ({ titulo }) {
    return (
        <TouchableOpacity style={styles.card}
            activeOpacity={0.6}
            onPress={() => Alert.alert("Clicado!")}
            onLongPress={() => Alert.alert("Pressionado por mais tempo!")}
        >
            <Text style={styles.title}>{titulo}</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#51AFF9",
        borderRadius: 12,
        margin: 8,
        width: "45%", // 2 cards por linha
        alignItems: "center",
        justifyContent: "center",
        height: isSmallScreen ? "20%" : "25%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
});
