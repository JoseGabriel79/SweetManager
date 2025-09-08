import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default function ({ titulo }) {
    return  <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{titulo}</Text>
       
        </TouchableOpacity>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#51AFF9",
        borderRadius: 12,
        padding: 16,
        margin: 8,
        width: "45%", // 2 cards por linha
        alignItems: "center",
        justifyContent: "center",
        height:"20%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 12,
        textAlign: "center",
    },
});
